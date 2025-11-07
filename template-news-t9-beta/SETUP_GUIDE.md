# Template Development Setup Guide

This guide walks you through setting up a new template for local development in the Publive platform.

## Prerequisites

- Git installed on your system
- Node.js and npm installed
- AWS CLI configured (optional, for CloudFront cache purging)
- Access to Publive Dashboard

## Step 1: Clone an Existing Starter Template

Start by cloning an existing template from GitHub to use as a foundation:

```bash
# Clone the starter template
git clone <starter-template-repo-url>
cd <template-directory>

# Or if you have a specific template to work from
git clone https://github.com/publive/template-news-t9.git
cd template-news-t9
```

## Step 2: Configure Remote Settings

### Create/Update `remote_config.json`

Create or update the `remote_config.json` file with your template-specific configuration:

```json
{
    "s3_path": "s3://publive/publive-publisher-templates/your-template-name/",
    "template_name": "your-template-name",
    "cloudfront": {
        "distribution_id": "YOUR_CLOUDFRONT_DISTRIBUTION_ID",
        "base_url": "https://cdn.thepublive.com"
    }
}
```

**Important Notes:**
- Replace `your-template-name` with your actual template name
- The `template_name` should match your template key
- For AWS credentials, refer to the main [README.md](README.md) for detailed configuration options
- The `remote_config.json` file is gitignored for security reasons

### AWS Credentials Setup

You have two options for AWS authentication:

#### Option A: AWS CLI Profiles (Recommended)
```bash
aws configure --profile your-profile-name
```

#### Option B: Configuration File
Add AWS credentials to your `remote_config.json`:
```json
{
    "s3_path": "s3://publive/publive-publisher-templates/your-template-name/",
    "template_name": "your-template-name",
    "aws": {
        "region": "us-east-1",
        "access_key_id": "YOUR_ACCESS_KEY_ID",
        "secret_access_key": "YOUR_SECRET_ACCESS_KEY",
        "session_token": "YOUR_SESSION_TOKEN"
    },
    "cloudfront": {
        "distribution_id": "YOUR_CLOUDFRONT_DISTRIBUTION_ID",
        "base_url": "https://cdn.thepublive.com"
    }
}
```

⚠️ **Security Warning**: Never commit `remote_config.json` to version control as it contains sensitive credentials.

## Step 3: Configure Publive Dashboard

### Access the Dashboard
1. Go to **Publive Dashboard**
2. Navigate to **Settings** → **UI Dashboard** → **Reader UI Json**

### Update Template Configuration
Create or update the existing `template_config` key with your template settings:

```json
{
    "template_config": {
        "template_key": "your-template-name",
        "dev_mode_enabled": "1"
    }
}
```

**Configuration Details:**
- **`template_key`**: Must match the `template_name` in your `remote_config.json`
- **`dev_mode_enabled`**: Set to `"1"` for active development
  - Disables template caching for live previews
  - Site loads slower but shows real-time changes
  - Set to `"0"` for production mode

### Additional Template Variables
You can add other template-specific variables to the `template_config`:

```json
{
    "template_config": {
        "template_key": "your-template-name",
        "dev_mode_enabled": "1",
        "custom_color_scheme": "dark",
        "enable_analytics": "true",
        "max_articles_per_page": "10"
    }
}
```

## Step 4: Development Workflow

### HTML-Only Changes
If you're only modifying HTML template files:

```bash
# Upload changes to remote template path
./upload_assets.sh
```

### CSS/JS Changes (Requires Rebuilding)
If you're modifying CSS or JavaScript files:

1. **Rebuild the bundles:**
   ```bash
   npm run build
   ```

2. **Upload and purge CloudFront cache:**
   ```bash
   ./upload_assets.sh --purge-cdn
   ```

### Available Upload Options

View all available options:
```bash
./upload_assets.sh --help
```

**Common Commands:**
- `./upload_assets.sh` - Upload both assets and templates
- `./upload_assets.sh --assets-only` - Upload only assets folder
- `./upload_assets.sh --templates-only` - Upload only templates folder
- `./upload_assets.sh --no-upload` - Create zip files only (no upload)
- `./upload_assets.sh --purge-cdn` - Upload and purge CloudFront cache
- `./upload_assets.sh --verbose` - Enable detailed output
- `./upload_assets.sh --profile your-profile` - Use specific AWS profile

## Development Best Practices

### 1. File Organization
```
template-directory/
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

### 2. Development Workflow
1. **Make changes** to your template files
2. **Test locally** if possible
3. **Rebuild bundles** if CSS/JS changed (`npm run build`)
4. **Upload changes** (`./upload_assets.sh`)
5. **Purge cache** if needed (`--purge-cdn`)
6. **Test on live site** with dev mode enabled

### 3. Cache Management
- **HTML changes**: Upload immediately, no cache purge needed
- **CSS/JS changes**: Rebuild + upload + purge cache
- **Image changes**: Upload + purge cache
- **Production deployment**: Set `dev_mode_enabled` to `"0"`

### 4. Troubleshooting

#### Build Issues
```bash
# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Security Considerations

1. **Never commit credentials** - `remote_config.json` is gitignored
2. **Use AWS profiles** - Configure credentials with `aws configure`
3. **Limit permissions** - Use least-privilege IAM policies
4. **Rotate credentials** - Regularly update access keys
5. **Use IAM roles** - For production deployments

## Next Steps

After setting up your template:

1. **Start development** by making changes to HTML/CSS/JS files
2. **Test your changes** using the upload workflow
3. **Enable production mode** by setting `dev_mode_enabled` to `"0"`
4. **Monitor performance** and cache behavior
5. **Deploy to production** when ready

For more detailed information about the upload utility and configuration options, refer to the main [README.md](README.md). 