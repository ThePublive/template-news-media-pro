#!/bin/bash

# Utility to create zip files for assets and templates folders and upload to S3
# Usage: ./upload_assets.sh [options]

set -e  # Exit on any error

# Default values
CONFIG_FILE="remote_config.json"
UPLOAD_TO_S3=true
PROCESS_ASSETS=true
PROCESS_TEMPLATES=true
UPLOAD_EXTRACTED_ASSETS=true
PURGE_CLOUDFRONT=false
AWS_PROFILE=""
VERBOSE=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Create zip files for assets and templates folders and upload to S3.

OPTIONS:
    -c, --config FILE       Configuration file path (default: remote_config.json)
    -p, --profile PROFILE   AWS profile to use for S3 upload
    --no-upload            Only create zip files, do not upload to S3
    --assets-only          Only process assets folder
    --templates-only       Only process templates folder
    --purge-cdn            Purge CloudFront cache after upload
    -v, --verbose          Enable verbose output
    -h, --help             Show this help message

EXAMPLES:
    $0                     # Process both assets and templates, upload to S3
    $0 --no-upload         # Only create zip files
    $0 --assets-only       # Only process assets folder
    $0 --purge-cdn         # Upload and purge CloudFront cache
    $0 --profile myprofile # Use specific AWS profile
    $0 -c custom_config.json # Use custom config file

EOF
}

# Function to check dependencies
check_dependencies() {
    local missing_deps=()
    
    # Check for required commands
    command -v zip >/dev/null 2>&1 || missing_deps+=("zip")
    command -v jq >/dev/null 2>&1 || missing_deps+=("jq")
    
    if [ "$UPLOAD_TO_S3" = true ]; then
        command -v aws >/dev/null 2>&1 || missing_deps+=("aws-cli")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        echo
        echo "Please install the missing dependencies:"
        echo "  - zip: usually pre-installed on most systems"
        echo "  - jq: brew install jq (macOS) or apt-get install jq (Ubuntu)"
        echo "  - aws-cli: pip install awscli or brew install awscli"
        exit 1
    fi
}

# Function to load configuration
load_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        print_error "Configuration file '$CONFIG_FILE' not found"
        exit 1
    fi
    
    # Parse S3 path from JSON config
    S3_PATH=$(jq -r '.s3_path' "$CONFIG_FILE" 2>/dev/null)
    
    if [ "$?" -ne 0 ] || [ "$S3_PATH" = "null" ] || [ -z "$S3_PATH" ]; then
        print_error "Failed to read 's3_path' from $CONFIG_FILE"
        print_error "Make sure the file contains valid JSON with 's3_path' field"
        exit 1
    fi
    
    # Parse AWS configuration
    AWS_REGION=$(jq -r '.aws.region // "us-east-1"' "$CONFIG_FILE" 2>/dev/null)
    AWS_ACCESS_KEY_ID=$(jq -r '.aws.access_key_id // empty' "$CONFIG_FILE" 2>/dev/null)
    AWS_SECRET_ACCESS_KEY=$(jq -r '.aws.secret_access_key // empty' "$CONFIG_FILE" 2>/dev/null)
    AWS_SESSION_TOKEN=$(jq -r '.aws.session_token // empty' "$CONFIG_FILE" 2>/dev/null)
    
    # Parse CloudFront configuration
    CLOUDFRONT_DISTRIBUTION_ID=$(jq -r '.cloudfront.distribution_id // empty' "$CONFIG_FILE" 2>/dev/null)
    CLOUDFRONT_BASE_URL=$(jq -r '.cloudfront.base_url // "https://cdn.thepublive.com"' "$CONFIG_FILE" 2>/dev/null)
    
    print_info "Using S3 path: $S3_PATH"
    print_info "Using AWS region: $AWS_REGION"
    if [ -n "$AWS_PROFILE" ]; then
        print_info "Using AWS profile: $AWS_PROFILE"
    fi
    if [ -n "$AWS_ACCESS_KEY_ID" ]; then
        print_info "Using AWS credentials from config file"
    fi
    if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        print_info "CloudFront distribution configured: $CLOUDFRONT_DISTRIBUTION_ID"
    fi
}

# Function to create zip file
create_zip_file() {
    local source_folder="$1"
    local zip_filename="$2"
    
    if [ ! -d "$source_folder" ]; then
        print_warning "$source_folder folder not found, skipping..."
        return 1
    fi
    
    print_info "Creating $zip_filename from $source_folder..."
    
    # Remove existing zip file if it exists
    [ -f "$zip_filename" ] && rm "$zip_filename"
    
    # Create zip file
    if [ "$VERBOSE" = true ]; then
        zip -r "$zip_filename" "$source_folder" -x "*.DS_Store" "*/.git/*"
    else
        zip -r "$zip_filename" "$source_folder" -x "*.DS_Store" "*/.git/*" >/dev/null
    fi
    
    if [ $? -eq 0 ]; then
        local size=$(du -h "$zip_filename" | cut -f1)
        print_success "Successfully created $zip_filename ($size)"
        return 0
    else
        print_error "Failed to create $zip_filename"
        return 1
    fi
}

# Function to upload to S3
upload_to_s3() {
    local local_file="$1"
    local s3_path="$2"
    
    if [ ! -f "$local_file" ]; then
        print_error "Local file '$local_file' not found"
        return 1
    fi
    
    # Construct S3 destination
    local filename=$(basename "$local_file")
    local s3_destination="${s3_path}${filename}"
    
    print_info "Uploading $local_file to $s3_destination..."
    
    # Prepare AWS CLI command with environment variables
    local aws_env=""
    if [ -n "$AWS_ACCESS_KEY_ID" ]; then
        aws_env="AWS_ACCESS_KEY_ID=\"$AWS_ACCESS_KEY_ID\" AWS_SECRET_ACCESS_KEY=\"$AWS_SECRET_ACCESS_KEY\""
        if [ -n "$AWS_SESSION_TOKEN" ]; then
            aws_env="$aws_env AWS_SESSION_TOKEN=\"$AWS_SESSION_TOKEN\""
        fi
        aws_env="$aws_env AWS_DEFAULT_REGION=\"$AWS_REGION\""
    fi
    
    local aws_cmd="aws s3 cp \"$local_file\" \"$s3_destination\""
    
    if [ -n "$AWS_PROFILE" ] && [ -z "$AWS_ACCESS_KEY_ID" ]; then
        aws_cmd="aws s3 cp \"$local_file\" \"$s3_destination\" --profile \"$AWS_PROFILE\""
    fi
    
    # Execute upload with environment variables if provided
    if [ -n "$aws_env" ]; then
        aws_cmd="$aws_env $aws_cmd"
    fi
    
    if eval "$aws_cmd"; then
        print_success "Successfully uploaded to $s3_destination"
        return 0
    else
        print_error "Failed to upload $local_file to S3"
        return 1
    fi
}

# Function to upload extracted assets folder to S3
upload_extracted_assets() {
    local assets_folder="assets"
    local s3_path="$1"
    
    if [ ! -d "$assets_folder" ]; then
        print_warning "Assets folder not found, skipping extracted upload..."
        return 1
    fi
    
    # Construct S3 destination for assets folder
    local s3_destination="${s3_path}assets/"
    
    print_info "Uploading extracted assets folder to $s3_destination..."
    
    # Prepare AWS CLI sync command with environment variables
    local aws_env=""
    if [ -n "$AWS_ACCESS_KEY_ID" ]; then
        aws_env="AWS_ACCESS_KEY_ID=\"$AWS_ACCESS_KEY_ID\" AWS_SECRET_ACCESS_KEY=\"$AWS_SECRET_ACCESS_KEY\""
        if [ -n "$AWS_SESSION_TOKEN" ]; then
            aws_env="$aws_env AWS_SESSION_TOKEN=\"$AWS_SESSION_TOKEN\""
        fi
        aws_env="$aws_env AWS_DEFAULT_REGION=\"$AWS_REGION\""
    fi
    
    local aws_cmd="aws s3 sync \"$assets_folder\" \"$s3_destination\" --delete"
    
    # Add exclusions for files we don't want to upload
    aws_cmd="$aws_cmd --exclude \"*.DS_Store\" --exclude \"node_modules/*\" --exclude \".git/*\""
    
    if [ -n "$AWS_PROFILE" ] && [ -z "$AWS_ACCESS_KEY_ID" ]; then
        aws_cmd="aws s3 sync \"$assets_folder\" \"$s3_destination\" --delete --profile \"$AWS_PROFILE\" --exclude \"*.DS_Store\" --exclude \"node_modules/*\" --exclude \".git/*\""
    fi
    
    if [ "$VERBOSE" = true ]; then
        aws_cmd="$aws_cmd --debug"
    fi
    
    # Execute upload with environment variables if provided
    if [ -n "$aws_env" ]; then
        aws_cmd="$aws_env $aws_cmd"
    fi
    if eval "$aws_cmd"; then
        print_success "Successfully uploaded extracted assets to $s3_destination"
        return 0
    else
        print_error "Failed to upload extracted assets to S3"
        return 1
    fi
}

# Function to purge CloudFront cache
purge_cloudfront_cache() {
    local template_name="$1"
    
    if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        print_warning "CloudFront distribution ID not configured, skipping cache purge..."
        return 1
    fi
    
    if [ -z "$template_name" ]; then
        print_error "Template name is required for CloudFront cache purge"
        return 1
    fi
    
    # Construct the path to purge
    local purge_path="/publive-publisher-templates/$template_name/*"
    local full_url="${CLOUDFRONT_BASE_URL}${purge_path}"
    
    print_info "Purging CloudFront cache for path: $purge_path"
    print_info "Full URL pattern: $full_url"
    
    # Prepare AWS CLI command with environment variables
    local aws_env=""
    if [ -n "$AWS_ACCESS_KEY_ID" ]; then
        aws_env="AWS_ACCESS_KEY_ID=\"$AWS_ACCESS_KEY_ID\" AWS_SECRET_ACCESS_KEY=\"$AWS_SECRET_ACCESS_KEY\""
        if [ -n "$AWS_SESSION_TOKEN" ]; then
            aws_env="$aws_env AWS_SESSION_TOKEN=\"$AWS_SESSION_TOKEN\""
        fi
        aws_env="$aws_env AWS_DEFAULT_REGION=\"$AWS_REGION\""
    fi
    
    local aws_cmd="aws cloudfront create-invalidation --distribution-id \"$CLOUDFRONT_DISTRIBUTION_ID\" --paths \"$purge_path\" --output json --no-cli-pager --no-cli-auto-prompt"
    
    if [ -n "$AWS_PROFILE" ] && [ -z "$AWS_ACCESS_KEY_ID" ]; then
        aws_cmd="aws cloudfront create-invalidation --distribution-id \"$CLOUDFRONT_DISTRIBUTION_ID\" --paths \"$purge_path\" --profile \"$AWS_PROFILE\" --output json --no-cli-pager --no-cli-auto-prompt"
    fi
    
    if [ "$VERBOSE" = true ]; then
        aws_cmd="$aws_cmd --debug"
    fi
    
    # Execute invalidation with environment variables if provided
    if [ -n "$aws_env" ]; then
        aws_cmd="$aws_env $aws_cmd"
    fi
    
    print_info "Executing CloudFront invalidation..."
    
    # Capture response to variable instead of printing to terminal
    response=$(eval "$aws_cmd" 2>&1)
    exit_code=$?

    if [ $exit_code -eq 0 ]; then
        print_success "Successfully initiated CloudFront cache invalidation"
        # Extract and show invalidation ID if needed
        invalidation_id=$(echo "$response" | jq -r '.Invalidation.Id // empty')
        if [ -n "$invalidation_id" ]; then
            print_info "Invalidation ID: $invalidation_id"
        fi
        return 0
    else
        print_error "Failed to purge CloudFront cache"
        print_info "Response: $response"
        return 1
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -c|--config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        -p|--profile)
            AWS_PROFILE="$2"
            shift 2
            ;;
        --no-upload)
            UPLOAD_TO_S3=false
            shift
            ;;
        --assets-only)
            PROCESS_ASSETS=true
            PROCESS_TEMPLATES=false
            UPLOAD_EXTRACTED_ASSETS=true
            shift
            ;;
        --templates-only)
            PROCESS_ASSETS=false
            PROCESS_TEMPLATES=true
            shift
            ;;
        --purge-cdn)
            PURGE_CLOUDFRONT=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main execution
main() {
    print_info "Starting asset upload utility..."
    
    # Check dependencies
    check_dependencies
    
    # Load configuration
    load_config
    
    # Determine which folders to process
    local folders_to_process=()
    
    if [ "$PROCESS_ASSETS" = true ]; then
        folders_to_process+=("assets:assets.zip")
    fi
    
    if [ "$PROCESS_TEMPLATES" = true ]; then
        folders_to_process+=("templates:templates.zip")
    fi
    
    # Create zip files
    local created_files=()
    local failed_files=()
    
    for folder_zip in "${folders_to_process[@]}"; do
        IFS=':' read -r folder zip_name <<< "$folder_zip"
        
        if create_zip_file "$folder" "$zip_name"; then
            created_files+=("$zip_name")
        else
            failed_files+=("$zip_name")
        fi
    done
    
    if [ ${#created_files[@]} -eq 0 ]; then
        print_error "No zip files were created successfully"
        exit 1
    fi
    
    # Upload to S3 if enabled
    if [ "$UPLOAD_TO_S3" = true ]; then
        echo
        print_info "Uploading files to S3..."
        
        local upload_success=true
        for zip_file in "${created_files[@]}"; do
            if ! upload_to_s3 "$zip_file" "$S3_PATH"; then
                upload_success=false
            fi
        done
        
        # Upload extracted assets if requested
        if [ "$UPLOAD_EXTRACTED_ASSETS" = true ]; then
            echo
            if ! upload_extracted_assets "$S3_PATH"; then
                upload_success=false
            fi
        fi
        
        echo
        if [ "$upload_success" = true ]; then
            print_success "All files uploaded successfully!"
            
            # Purge CloudFront cache if requested
            if [ "$PURGE_CLOUDFRONT" = true ]; then
                echo
                print_info "Purging CloudFront cache..."
                local template_name
                template_name=$(jq -r '.template_name' "$CONFIG_FILE" 2>/dev/null)
                if ! purge_cloudfront_cache "$template_name"; then
                    print_warning "CloudFront cache purge failed, but upload was successful"
                fi
            fi
        else
            print_error "Some uploads failed. Please check the error messages above."
            exit 1
        fi
    else
        echo
        print_info "Skipping S3 upload (--no-upload flag specified)"
    fi
    
    # Summary
    echo
    print_info "Summary:"
    if [ ${#created_files[@]} -gt 0 ]; then
        print_success "Created zip files: ${created_files[*]}"
    fi
    if [ ${#failed_files[@]} -gt 0 ]; then
        print_warning "Failed to create: ${failed_files[*]}"
    fi
    
    print_success "Asset upload utility completed!"
}

# Run main function
main "$@" 