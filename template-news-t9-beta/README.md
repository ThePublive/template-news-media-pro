# Template Upload Utility

This utility helps you build and upload template assets to AWS S3 for deployment.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure AWS Credentials

You have two options for AWS authentication:

#### Option A: Using AWS CLI Profiles 
```bash
aws configure --profile your-profile-name
```

#### Option B: Using Configuration File (Recommended)
Copy the example configuration:
```bash
cp remote_config.example.json remote_config.json
```

Then edit `remote_config.json` with your actual AWS credentials:
```json
{
    "s3_path": "s3://your-bucket/your-path/",
    "template_name": "your-template-name",
    "aws": {
        "region": "us-east-1",
        "access_key_id": "AKIA...",
        "secret_access_key": "your-secret-key",
        "session_token": "your-session-token"
    },
    "cloudfront": {
        "distribution_id": "YOUR_CLOUDFRONT_DISTRIBUTION_ID",
        "base_url": "https://cdn.thepublive.com"
    }
}
```

⚠️ **Security Note**: The `remote_config.json` file contains sensitive credentials and is excluded from git. Never commit this file to version control.

## Usage

### Build Assets
```bash
npm run build
```

### Upload to S3

#### Basic Upload (zip files only)
```bash
./upload_assets.sh
```

#### Upload and Purge CloudFront Cache
```bash
./upload_assets.sh --purge-cdn
```

#### Use Specific AWS Profile
```bash
./upload_assets.sh --profile your-profile-name
```

#### Create Zip Files Only (No Upload)
```bash
./upload_assets.sh --no-upload
```

#### Verbose Output
```bash
./upload_assets.sh --verbose
```

## Configuration Options

### AWS Configuration
- `region`: AWS region (default: us-east-1)
- `access_key_id`: AWS access key ID
- `secret_access_key`: AWS secret access key  
- `session_token`: AWS session token (for temporary credentials)

### CloudFront Configuration
- `distribution_id`: CloudFront distribution ID for cache invalidation
- `base_url`: Base URL for the CDN (default: https://cdn.thepublive.com)



## File Structure

```
├── assets/                    # Source assets
│   ├── css/                   # CSS files
│   ├── js/                    # JavaScript files
│   ├── images/                # Image files
│   └── bundles/               # Generated webpack bundles
├── templates/                 # HTML templates
├── webpack.config.js          # Webpack configuration
├── package.json               # NPM dependencies
├── upload_assets.sh           # Upload utility script
├── remote_config.json         # AWS configuration (gitignored)
└── remote_config.example.json # Example configuration
```

## Security Best Practices

1. **Never commit credentials** - `remote_config.json` is gitignored
2. **Use AWS profiles** - Configure credentials with `aws configure`
3. **Use IAM roles** - For production deployments
4. **Rotate credentials** - Regularly update access keys
5. **Limit permissions** - Use least-privilege IAM policies

## Troubleshooting


### Permission Denied
Ensure your AWS credentials have S3 permissions:
- `s3:PutObject`
- `s3:DeleteObject` (for sync operations)
- `s3:ListBucket`

### CloudFront Cache Purge
For CloudFront cache invalidation, ensure your AWS credentials have:
- `cloudfront:CreateInvalidation` 