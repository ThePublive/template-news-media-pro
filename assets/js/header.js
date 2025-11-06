// Header Functionality
(function() {
    'use strict';

    let header;
    let lastScrollTop = 0;
    let scrollThreshold = 100;

    // Initialize header
    function init() {
        header = document.querySelector('.site-header');
        if (!header) return;

        initStickyHeader();
        initMobileMenu();
        initSearchToggle();
        initDropdownMenus();
    }

    // Sticky header on scroll
    function initStickyHeader() {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add sticky class when scrolled
            if (scrollTop > scrollThreshold) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }

            // Hide/show header on scroll direction
            if (scrollTop > lastScrollTop && scrollTop > scrollThreshold * 2) {
                // Scrolling down - hide header
                header.classList.add('header-hidden');
            } else {
                // Scrolling up - show header
                header.classList.remove('header-hidden');
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, { passive: true });
    }

    // Mobile menu toggle
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', openMobileMenu);
        }

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        // Close on outside click
        if (mobileMenu) {
            const overlay = mobileMenu.querySelector('.mobile-menu-overlay');
            if (overlay) {
                overlay.addEventListener('click', closeMobileMenu);
            }
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Also trigger mobile sidebar if exists
        if (typeof openMobileSidebar === 'function') {
            openMobileSidebar();
        }
    }

    // Close mobile menu
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Also close mobile sidebar if exists
        if (typeof closeMobileSidebar === 'function') {
            closeMobileSidebar();
        }
    }

    // Search toggle
    function initSearchToggle() {
        const searchBtn = document.querySelector('.search-toggle-btn');

        if (searchBtn) {
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();

                // Open search modal if it exists
                if (typeof openSearchModal === 'function') {
                    openSearchModal();
                } else {
                    // Fallback: redirect to search page
                    window.location.href = '/search';
                }
            });
        }
    }

    // Dropdown menus
    function initDropdownMenus() {
        const dropdownToggles = document.querySelectorAll('.has-dropdown');

        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('mouseenter', function() {
                this.classList.add('dropdown-open');
            });

            toggle.addEventListener('mouseleave', function() {
                this.classList.remove('dropdown-open');
            });

            // Mobile touch support
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    this.classList.toggle('dropdown-open');
                }
            });
        });
    }

    // Dark mode toggle in header
    function initDarkModeToggle() {
        const darkModeBtn = document.getElementById('darkModeToggle');

        if (darkModeBtn) {
            darkModeBtn.addEventListener('click', function() {
                if (typeof window.darkMode !== 'undefined') {
                    window.darkMode.toggle();
                }
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use
    window.headerModule = {
        openMobileMenu,
        closeMobileMenu
    };

})();
