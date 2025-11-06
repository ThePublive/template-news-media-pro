// Widget Functionality for News Template
(function() {
    'use strict';

    // Sticky Sidebar Widget
    function initStickySidebar() {
        const sidebar = document.querySelector('.desktop-sidebar');
        if (!sidebar) return;

        let sidebarTop = sidebar.offsetTop;
        let sidebarHeight = sidebar.offsetHeight;
        let windowHeight = window.innerHeight;

        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > sidebarTop && sidebarHeight < windowHeight) {
                sidebar.style.position = 'sticky';
                sidebar.style.top = '20px';
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Trending Widget - Animated Numbers
    function initTrendingWidget() {
        const trendingItems = document.querySelectorAll('.trending-item');

        trendingItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
        });
    }

    // Latest Stories Widget - Auto Refresh
    function initLatestStoriesWidget() {
        const latestWidget = document.querySelector('.latest-stories');
        if (!latestWidget) return;

        // Optional: Auto-refresh latest stories every 5 minutes
        const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

        function refreshLatestStories() {
            // This would be implemented with an API call
            console.log('Refreshing latest stories...');
        }

        // Uncomment to enable auto-refresh
        // setInterval(refreshLatestStories, AUTO_REFRESH_INTERVAL);
    }

    // Newsletter Widget - Form Validation
    function initNewsletterWidget() {
        const newsletterForms = document.querySelectorAll('.newsletter-form-single, .newsletter-form-grouped');

        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const emailInput = form.querySelector('input[name="email"]');
                const email = emailInput ? emailInput.value : '';

                if (!isValidEmail(email)) {
                    alert('Please enter a valid email address');
                    return;
                }

                // Submit form
                submitNewsletterForm(form, email);
            });
        });
    }

    // Email validation
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Submit newsletter form
    function submitNewsletterForm(form, email) {
        const formData = new FormData(form);

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        // Simulate API call
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Successfully subscribed!');
                form.reset();
            } else {
                alert('Subscription failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Newsletter subscription error:', error);
            alert('An error occurred. Please try again later.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // Social Share Widget
    function initSocialShareWidget() {
        const shareButtons = document.querySelectorAll('.social-share-btn');

        shareButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.dataset.platform;
                const url = this.dataset.url || window.location.href;
                const title = this.dataset.title || document.title;

                shareOnPlatform(platform, url, title);
            });
        });
    }

    // Share on social platform
    function shareOnPlatform(platform, url, title) {
        let shareUrl = '';

        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
    }

    // Initialize all widgets
    function init() {
        initStickySidebar();
        initTrendingWidget();
        initLatestStoriesWidget();
        initNewsletterWidget();
        initSocialShareWidget();
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export widget functions
    window.widgets = {
        initStickySidebar,
        initTrendingWidget,
        initLatestStoriesWidget,
        initNewsletterWidget,
        initSocialShareWidget
    };

})();
