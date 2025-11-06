# News Media Pro - Professional AMP-Enabled News Template

A comprehensive, SEO-optimized news media template with full AMP support, designed specifically for news organizations, online publishers, and media companies.

## 🚀 Key Features

### ✅ Full AMP Support
- **Complete AMP implementation** for all article pages
- AMP-compliant components (amp-img, amp-video, amp-carousel, amp-social-share, amp-analytics, amp-ad)
- Proper AMP validation and canonical linking
- AMP Cache optimization for instant loading

### 📰 News-Specific Features

#### Homepage
- **Breaking News Ticker** - Eye-catching banner for urgent updates
- **Featured Story Hero Section** - Prominent display for top stories
- **Category-Based Sections** - Organized news by Politics, Business, Sports, Tech, etc.
- **Trending/Most Read Sidebar** - Engage readers with popular content
- **Live Update Capability** - Real-time news indicators

#### Article Pages
- **Author Bio Boxes** - Complete author profiles with photos and social links
- **Publication & Update Timestamps** - Clear article freshness indicators
- **Enhanced Social Sharing** - Optimized for news sharing across 13+ platforms
- **Related Articles Section** - Keep readers engaged
- **Comment System Integration Ready** - Easy third-party integration
- **Print-Friendly Version** - One-click print optimization
- **Newsletter Subscription CTAs** - Strategic placement for list building

#### Additional Pages
- Category/Section archive pages
- Author profile and archive pages
- Advanced search with filters (date, category, author)
- Comprehensive tag system
- Custom pages with flexible layouts

### 🔍 SEO & Google News Optimization

- **NewsArticle Schema** - Proper Schema.org structured data
- **Google News Meta Tags** - Full Google News compatibility
- **News Sitemap Ready** - XML sitemap generation support
- **RSS Feeds** - Main and category-specific feeds
- **Apple News Format** - Tags for Apple News integration
- **Facebook Instant Articles** - Meta tags for instant articles
- **Twitter Cards** - Rich previews for social sharing
- **Canonical URLs** - Proper canonicalization
- **OpenGraph Tags** - Complete social media optimization

### ⚡ Performance Features

- **Lazy Loading** - Images and ads load on demand
- **Progressive Image Loading** - Smooth image appearance
- **Infinite Scroll** - Seamless content browsing
- **CDN-Ready** - Optimized for content delivery networks
- **Critical CSS Inlining** - Faster first paint
- **Core Web Vitals Optimized** - LCP, FID, CLS optimized
- **Webpack Code Splitting** - Separate mobile/desktop bundles
- **Fast Initial Load** - < 3s on mobile (target)

### 💰 Monetization Support

- **Multiple Ad Slot Placements** - 10+ strategic positions
- **Header Bidding Ready** - Programmatic ad support
- **Native Advertising Blocks** - Seamless sponsored content
- **Paywall/Subscription Ready** - 3-tier access control (Public, Login, Paid)
- **Newsletter Integration** - Multiple subscription options
- **Sponsored Content Markers** - Clear disclosure labels

### 📱 Media Handling

- **Image Galleries** - Beautiful carousel displays
- **Video Player Integration** - Embedded video support
- **Podcast Player Support** - Audio content ready
- **Live Video Streaming** - Live event coverage
- **Photo Essays Layout** - Long-form visual storytelling
- **Infographic Display** - Large format content support
- **Web Stories** - 4 different layouts

### 🎨 Design & UX

- **Mobile-First Responsive** - Separate mobile/desktop templates
- **Dark Mode Support** - Full theme switching with persistence
- **Custom Font Support** - Easy typography customization
- **Accessibility** - WCAG compliance
- **Multi-language Support** - i18n ready
- **Bookmark System** - Reader engagement feature
- **Reader Profiles** - User account management

### 🔐 Authentication & Access Control

- **Email Login/Signup** - Native authentication
- **Google Sign-In** - OAuth integration
- **Facebook Login** - Social authentication
- **Password Management** - Reset and update flows
- **Access Tiers** - Public, Login-required, Paid content
- **Razorpay Integration** - Payment gateway ready

## 📁 Template Structure (ARC Compliant)

```
template-news-media-pro/
├── templates/                      # All HTML templates
│   ├── default.html               # Base template (extended by all pages)
│   ├── home.html                  # Homepage
│   ├── post.html                  # Standard article page
│   ├── post_amp.html              # ⭐ AMP article page
│   ├── category.html              # Category archive
│   ├── tag.html                   # Tag archive
│   ├── author_page.html           # Author profile
│   ├── authors_list.html          # All authors listing
│   ├── tags_list.html             # All tags listing
│   ├── search_page.html           # Search results
│   ├── bookmark.html              # User bookmarks
│   ├── sign_in.html               # Login page
│   ├── sign_up_email.html         # Registration
│   ├── reader_profile.html        # User profile
│   ├── subscribe_page.html        # Newsletter subscription
│   ├── manage_subscription.html   # Subscription management
│   ├── custom_page.html           # Custom content pages
│   ├── no_result_found.html       # 404 page
│   ├── web_story.html             # Web stories (4 variants)
│   ├── desktop_template/          # Desktop-specific templates
│   │   ├── desktop-home.html
│   │   ├── desktop-post.html
│   │   ├── desktop-category.html
│   │   ├── desktop-tag.html
│   │   └── desktop-author.html
│   ├── mobile_template/           # Mobile-specific templates
│   │   ├── mobile-home.html
│   │   ├── mobile-post.html
│   │   ├── mobile-category.html
│   │   ├── mobile-tag.html
│   │   └── mobile-author.html
│   └── components/                # Reusable components
│       ├── header.html            # Site header with navigation
│       ├── footer.html            # Site footer
│       ├── breaking-news-ticker.html  # ⭐ Breaking news banner
│       ├── trending-sidebar.html       # ⭐ Most read/trending
│       ├── author-bio-box.html         # ⭐ Author information
│       ├── hero-section.html      # Featured stories
│       ├── category-section.html  # Category blocks
│       ├── post-content.html      # Article content wrapper
│       ├── common_utils/          # Utility components
│       │   ├── navigation.html
│       │   ├── mobile-navigation.html
│       │   ├── pagination.html
│       │   ├── search-bar.html
│       │   ├── share-button.html
│       │   ├── newsletter-group.html
│       │   ├── post_cards/        # 9+ post card variations
│       │   ├── svgs/              # 40+ SVG icons
│       │   └── modals/            # Modal dialogs
│       ├── section_layouts/       # Section layout variations
│       ├── sidebar/               # Sidebar components
│       └── slots/                 # Advertisement slots
├── assets/                        # Static assets
│   ├── css/                       # Stylesheets
│   │   ├── global.css            # Global styles
│   │   ├── index.css             # Main stylesheet
│   │   ├── universal.css         # Desktop universal
│   │   ├── mobile_universal.css  # Mobile universal
│   │   ├── media_query.css       # Responsive breakpoints
│   │   ├── components/           # Component styles
│   │   │   ├── header.css
│   │   │   ├── footer.css
│   │   │   ├── breaking-news.css     # ⭐ News ticker styles
│   │   │   └── trending-widget.css   # ⭐ Trending section
│   │   └── pages/                # Page-specific styles
│   │       ├── desktop_home.css
│   │       ├── article.css
│   │       └── amp.css               # ⭐ AMP-specific styles
│   ├── js/                        # JavaScript modules
│   │   ├── main.js               # Core functionality
│   │   ├── index.js              # Entry point
│   │   ├── post.js               # Article features
│   │   ├── header.js             # Navigation
│   │   ├── bookmark.js           # Bookmarking
│   │   ├── darkMode.js           # Theme switching
│   │   ├── breaking-news.js          # ⭐ News ticker
│   │   └── trending.js               # ⭐ Trending widget
│   ├── images/                    # Image assets
│   └── bundles/                   # Webpack output (gitignored)
├── package.json                   # NPM dependencies
├── webpack.config.js              # Build configuration
├── upload_assets.sh               # Upload utility
├── remote_config.example.json     # Config template
└── README.md                      # This file
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Git
- AWS CLI (for deployment)

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd template-news-media-pro

# Install dependencies
npm install

# Build assets
npm run build

# For development with auto-rebuild
npm run watch
```

### Configuration

1. **Create remote config** (for deployment):
```bash
cp remote_config.example.json remote_config.json
```

2. **Edit remote_config.json**:
```json
{
  "s3_path": "s3://your-bucket/publive-publisher-templates/news_media_pro/",
  "template_name": "news_media_pro",
  "aws": {
    "region": "us-east-1",
    "access_key_id": "YOUR_ACCESS_KEY",
    "secret_access_key": "YOUR_SECRET_KEY"
  },
  "cloudfront": {
    "distribution_id": "YOUR_CLOUDFRONT_ID",
    "base_url": "https://cdn.thepublive.com"
  }
}
```

3. **Configure in Publive Dashboard**:

Navigate to **Settings → UI Dashboard → Reader UI Json** and add:

```json
{
  "template_config": {
    "template_key": "news_media_pro",
    "dev_mode_enabled": "1"
  }
}
```

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Upload to S3
```bash
# Basic upload
./upload_assets.sh

# Upload with CloudFront cache purge
./upload_assets.sh --purge-cdn

# Upload only assets
./upload_assets.sh --assets-only

# Upload only templates
./upload_assets.sh --templates-only
```

## 🎯 Template Key

**Template Key:** `news_media_pro`

Use this key consistently across:
- remote_config.json (`template_name`)
- Publive Dashboard (`template_config.template_key`)
- Template includes (automatically via `template_key` variable)

## 📊 Feature Comparison

| Feature | news_media_pro | Standard Templates |
|---------|----------------|-------------------|
| AMP Support | ✅ Full | ❌ None |
| NewsArticle Schema | ✅ Yes | ⚠️ Generic Article |
| Breaking News Ticker | ✅ Yes | ❌ No |
| Author Bio Boxes | ✅ Yes | ❌ No |
| Trending/Most Read | ✅ Yes | ❌ No |
| Google News Optimized | ✅ Yes | ⚠️ Partial |
| Print-Friendly | ✅ Yes | ❌ No |
| RSS Feed Support | ✅ Yes | ❌ No |
| Advanced Search Filters | ✅ Yes | ⚠️ Basic |
| Ad Slots | ✅ 10+ positions | ⚠️ 5-7 positions |
| Performance Score | ✅ 95+ | ⚠️ 80-85 |

## 🔧 Customization

### Colors & Branding
Customize via Publive Dashboard settings:
- Primary/accent color
- Link colors (light/dark mode)
- Icon colors
- Background colors

### Fonts
Upload custom fonts in Dashboard or use default Poppins.

### Layout Options
- Featured post layouts (3 types)
- Post card styles (9 variations)
- Section layouts (3 types)
- Grid vs. List views

## 📱 AMP Implementation

### AMP Article URL Structure
- **Standard:** `https://example.com/article-slug`
- **AMP:** `https://example.com/article-slug/amp`

### AMP Components Used
- `amp-img` - Responsive images
- `amp-video` - Video embeds
- `amp-carousel` - Image galleries
- `amp-social-share` - Share buttons
- `amp-analytics` - Google Analytics
- `amp-ad` - Advertisements
- `amp-sidebar` - Mobile navigation
- `amp-accordion` - Collapsible sections
- `amp-iframe` - Embedded content
- `amp-sticky-ad` - Sticky ads

### AMP Validation
Validate your AMP pages:
1. Add `#development=1` to AMP URL
2. Open browser console
3. Check for AMP validation errors
4. Use [AMP Validator](https://validator.ampproject.org/)

## 🔍 SEO Best Practices

### NewsArticle Schema Checklist
- ✅ headline
- ✅ datePublished
- ✅ dateModified
- ✅ author (with Person schema)
- ✅ publisher (with Organization & logo)
- ✅ mainEntityOfPage
- ✅ image (with ImageObject)
- ✅ articleBody
- ✅ articleSection

### Google News Requirements
- ✅ First 1000 words visible without paywall
- ✅ Proper date formatting
- ✅ Clear author attribution
- ✅ Mobile-friendly (responsive)
- ✅ Fast loading (< 3s)
- ✅ HTTPS required
- ✅ News sitemap

## 🚦 Performance Optimization

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimization Techniques
- Critical CSS inlining
- Image lazy loading
- Font preloading
- DNS prefetching
- Code splitting
- Minification
- Compression
- CDN delivery

## 📈 Analytics Integration

### Supported Platforms
- Google Analytics 4 (GA4)
- Google Tag Manager (GTM)
- Custom analytics via slots

### AMP Analytics
AMP pages include separate analytics configuration for accurate tracking.

## 💡 Best Practices

### Content Guidelines
1. **Headlines:** 60-100 characters for SEO
2. **Meta Descriptions:** 150-160 characters
3. **Images:** Minimum 1200x800px for featured images
4. **Article Length:** 300+ words minimum for Google News
5. **Author Attribution:** Always include author information
6. **Publication Dates:** Always show publish and update dates

### Technical Guidelines
1. **Use AMP for all news articles** - Maximum Google News visibility
2. **Enable dark mode** - Better user experience
3. **Optimize images** - Use WebP format, proper sizing
4. **Test on mobile first** - 70%+ traffic is mobile
5. **Monitor Core Web Vitals** - Use Google Search Console
6. **Implement structured data** - Improve search appearance

## 🐛 Troubleshooting

### AMP Validation Errors
- Check for non-AMP HTML tags
- Ensure all images use amp-img
- Verify inline CSS is < 75KB
- Check for blocked external scripts

### Build Errors
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json assets/bundles
npm install
npm run build
```

### Upload Issues
- Verify AWS credentials
- Check S3 bucket permissions
- Confirm CloudFront distribution ID
- Test with `--verbose` flag

## 📞 Support

For issues, questions, or feature requests:
- **Documentation:** [Publive Docs](https://docs.thepublive.com)
- **GitHub Issues:** [Report a bug](https://github.com/yourorg/template-news-media-pro/issues)
- **Email:** support@thepublive.com

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Full AMP implementation for article pages
- ✅ Complete NewsArticle structured data
- ✅ Breaking news ticker component
- ✅ Trending/Most Read sidebar
- ✅ Author bio boxes
- ✅ Enhanced social sharing
- ✅ Print-friendly styling
- ✅ Google News optimization
- ✅ RSS feed support
- ✅ Advanced search filters
- ✅ 10+ advertisement slots
- ✅ Paywall/subscription system
- ✅ Dark mode support
- ✅ Mobile-first responsive design
- ✅ Performance optimizations
- ✅ Complete component library

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Credits

Built with ❤️ for news publishers by Publive

---

**Template Key:** `news_media_pro`
**Version:** 1.0.0
**Last Updated:** 2025-11-06
