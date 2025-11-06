// News Media Pro - Core Functionality
(function() {
    'use strict';

    // Scroll to top functionality
    const scrollTopBtn = document.querySelector('.gh-scroll-top-btn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Latest articles function
    window.latest_articles = function(excludeId) {
        // Placeholder for latest articles functionality
        console.log('Loading latest articles, excluding:', excludeId);
    };

    // Related articles function
    window.related_articles = function(categorySlug) {
        // Placeholder for related articles functionality
        console.log('Loading related articles for category:', categorySlug);
    };

})();
