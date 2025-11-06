// Dark Mode Toggle Functionality
(function() {
    'use strict';

    const DARK_MODE_KEY = 'darkMode';
    const THEME_ATTR = 'data-theme';

    // Get saved theme or system preference
    function getSavedTheme() {
        const saved = localStorage.getItem(DARK_MODE_KEY);
        if (saved) {
            return saved;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    // Apply theme
    function applyTheme(theme) {
        document.documentElement.setAttribute(THEME_ATTR, theme);
        localStorage.setItem(DARK_MODE_KEY, theme);

        // Update toggle button state
        updateToggleButton(theme);
    }

    // Update toggle button
    function updateToggleButton(theme) {
        const toggleBtn = document.getElementById('darkModeToggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('data-theme', theme);
            toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute(THEME_ATTR) || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // Initialize dark mode
    function initDarkMode() {
        const theme = getSavedTheme();
        applyTheme(theme);

        // Add click listener to toggle button
        const toggleBtn = document.getElementById('darkModeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(DARK_MODE_KEY)) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDarkMode);
    } else {
        initDarkMode();
    }

    // Export for external use
    window.darkMode = {
        toggle: toggleTheme,
        setTheme: applyTheme,
        getTheme: () => document.documentElement.getAttribute(THEME_ATTR) || 'light'
    };

})();
