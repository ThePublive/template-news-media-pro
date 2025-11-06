// Custom Page Functionality
(function() {
    'use strict';

    // Form handling for custom pages
    function initCustomForms() {
        const customForms = document.querySelectorAll('.custom-page-form');

        customForms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
        });
    }

    // Handle form submission
    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validate form
        if (!validateForm(form)) {
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Submit form
        fetch(form.action, {
            method: form.method || 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showSuccessMessage(form, data.message || 'Form submitted successfully!');
                form.reset();
            } else {
                showErrorMessage(form, data.message || 'Form submission failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showErrorMessage(form, 'An error occurred. Please try again later.');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // Validate form
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }

            // Email validation
            if (field.type === 'email' && field.value) {
                if (!isValidEmail(field.value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Show field error
    function showFieldError(field, message) {
        clearFieldError(field);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #dc3545; font-size: 14px; margin-top: 4px;';

        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#dc3545';
    }

    // Clear field error
    function clearFieldError(field) {
        const error = field.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
        field.style.borderColor = '';
    }

    // Show success message
    function showSuccessMessage(form, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-success-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        `;

        form.insertBefore(messageDiv, form.firstChild);

        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Show error message
    function showErrorMessage(form, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-error-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        `;

        form.insertBefore(messageDiv, form.firstChild);

        // Remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Email validation
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Initialize tabs (if present on custom page)
    function initTabs() {
        const tabContainers = document.querySelectorAll('.custom-page-tabs');

        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll('.tab-link');
            const panels = container.querySelectorAll('.tab-panel');

            tabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);

                    // Remove active class from all tabs and panels
                    tabs.forEach(t => t.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));

                    // Add active class to clicked tab and corresponding panel
                    this.classList.add('active');
                    document.getElementById(targetId).classList.add('active');
                });
            });
        });
    }

    // Initialize accordions (if present on custom page)
    function initAccordions() {
        const accordions = document.querySelectorAll('.custom-page-accordion');

        accordions.forEach(accordion => {
            const items = accordion.querySelectorAll('.accordion-item');

            items.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');

                header.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');

                    // Close all other items
                    items.forEach(i => {
                        i.classList.remove('active');
                        i.querySelector('.accordion-content').style.maxHeight = null;
                    });

                    // Toggle current item
                    if (!isActive) {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            });
        });
    }

    // Initialize
    function init() {
        initCustomForms();
        initTabs();
        initAccordions();
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use
    window.customPage = {
        initForms: initCustomForms,
        initTabs,
        initAccordions
    };

})();
