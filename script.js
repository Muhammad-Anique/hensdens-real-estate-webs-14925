/**
 * Hensdens Real Estate Website JavaScript
 * Handles form validation, mobile navigation, and user interactions
 */

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

// Form validation patterns
const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    name: /^[a-zA-Z\s]{2,50}$/
};

// Form error messages
const errorMessages = {
    firstName: 'First name must be 2-50 characters and contain only letters',
    lastName: 'Last name must be 2-50 characters and contain only letters',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    message: 'Message must be at least 10 characters long'
};

/**
 * Initialize the website functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFormValidation();
    initializeSmoothScrolling();
    initializeAnimations();
    
    console.log('Hensdens Real Estate Website loaded successfully');
});

/**
 * Mobile Navigation Handler
 */
function initializeNavigation() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        
        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    try {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    } catch (error) {
        console.error('Error toggling mobile menu:', error);
    }
}

/**
 * Close mobile navigation menu
 */
function closeMobileMenu() {
    try {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    } catch (error) {
        console.error('Error closing mobile menu:', error);
    }
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Account for fixed navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

/**
 * Initialize form validation and submission
 */
function initializeFormValidation() {
    if (!contactForm) return;
    
    // Add real-time validation to form inputs
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', handleFormSubmission);
}

/**
 * Validate individual form field
 * @param {Event} e - The blur event
 */
function validateField(e) {
    const field = e.target;
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    
    clearError(e);
    
    try {
        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!fieldValue) {
                    showError(field, `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`);
                    return false;
                }
                if (!validationPatterns.name.test(fieldValue)) {
                    showError(field, errorMessages[fieldName]);
                    return false;
                }
                break;
                
            case 'email':
                if (!fieldValue) {
                    showError(field, 'Email address is required');
                    return false;
                }
                if (!validationPatterns.email.test(fieldValue)) {
                    showError(field, errorMessages.email);
                    return false;
                }
                break;
                
            case 'phone':
                if (fieldValue && !validationPatterns.phone.test(fieldValue.replace(/[\s\-\(\)]/g, ''))) {
                    showError(field, errorMessages.phone);
                    return false;
                }
                break;
                
            case 'message':
                if (!fieldValue) {
                    showError(field, 'Message is required');
                    return false;
                }
                if (fieldValue.length < 10) {
                    showError(field, errorMessages.message);
                    return false;
                }
                break;
        }
        
        return true;
    } catch (error) {
        console.error('Error validating field:', error);
        return false;
    }
}

/**
 * Show error message for a field
 * @param {HTMLElement} field - The input field
 * @param {string} message - The error message
 */
function showError(field, message) {
    try {
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        field.style.borderColor = 'var(--error-red)';
        field.setAttribute('aria-invalid', 'true');
    } catch (error) {
        console.error('Error showing field error:', error);
    }
}

/**
 * Clear error message for a field
 * @param {Event} e - The input event
 */
function clearError(e) {
    try {
        const field = e.target;
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        field.style.borderColor = 'var(--border-gray)';
        field.removeAttribute('aria-invalid');
    } catch (error) {
        console.error('Error clearing field error:', error);
    }
}

/**
 * Validate entire form
 * @returns {boolean} - True if form is valid
 */
function validateForm() {
    const requiredFields = ['firstName', 'lastName', 'email', 'message'];
    let isValid = true;
    
    try {
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                const event = { target: field };
                if (!validateField(event)) {
                    isValid = false;
                }
            }
        });
        
        // Validate optional phone field if filled
        const phoneField = document.getElementById('phone');
        if (phoneField && phoneField.value.trim()) {
            const event = { target: phoneField };
            if (!validateField(event)) {
                isValid = false;
            }
        }
        
        return isValid;
    } catch (error) {
        console.error('Error validating form:', error);
        return false;
    }
}

/**
 * Handle form submission
 * @param {Event} e - The submit event
 */
async function handleFormSubmission(e) {
    e.preventDefault();
    
    try {
        // Validate form before submission
        if (!validateForm()) {
            showNotification('Please fix the errors above before submitting.', 'error');
            return;
        }
        
        // Show loading state
        setSubmitButtonState(true);
        
        // Prepare form data
        const formData = new FormData(contactForm);
        
        // Submit to Netlify (for Vercel deployment, this will be handled by Vercel Forms)
        const response = await fetch(contactForm.action || '/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        });
        
        if (response.ok) {
            // Show success message
            showSuccessMessage();
            resetForm();
            
            // Track form submission (for analytics)
            trackFormSubmission();
        } else {
            throw new Error('Form submission failed');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
    } finally {
        setSubmitButtonState(false);
    }
}

/**
 * Set submit button loading state
 * @param {boolean} isLoading - Whether the form is submitting
 */
function setSubmitButtonState(isLoading) {
    try {
        if (!submitBtn) return;
        
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error setting submit button state:', error);
    }
}

/**
 * Show success message and hide form
 */
function showSuccessMessage() {
    try {
        if (contactForm && formSuccess) {
            contactForm.style.display = 'none';
            formSuccess.classList.remove('hidden');
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } catch (error) {
        console.error('Error showing success message:', error);
    }
}

/**
 * Reset the contact form
 */
function resetForm() {
    try {
        if (contactForm) {
            contactForm.reset();
            
            // Clear any error messages
            const errorElements = contactForm.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
            });
            
            // Reset field styles
            const inputs = contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.style.borderColor = 'var(--border-gray)';
                input.removeAttribute('aria-invalid');
            });
        }
    } catch (error) {
        console.error('Error resetting form:', error);
    }
}

/**
 * Show notification message
 * @param {string} message - The notification message
 * @param {string} type - The notification type ('success' or 'error')
 */
function showNotification(message, type = 'info') {
    try {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backgroundColor: type === 'error' ? 'var(--error-red)' : 'var(--success-green)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

/**
 * Track form submission for analytics
 */
function trackFormSubmission() {
    try {
        // Google Analytics tracking (if available)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Contact',
                event_label: 'Contact Form'
            });
        }
        
        // Facebook Pixel tracking (if available)
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Contact');
        }
        
        console.log('Form submission tracked successfully');
    } catch (error) {
        console.error('Error tracking form submission:', error);
    }
}

/**
 * Initialize scroll-based animations
 */
function initializeAnimations() {
    try {
        // Intersection Observer for animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.property-card, .service-card, .contact-item');
        animatedElements.forEach(element => observer.observe(element));
        
    } catch (error) {
        console.error('Error initializing animations:', error);
    }
}

/**
 * Handle intersection observer callback
 * @param {IntersectionObserverEntry[]} entries - The observed entries
 */
function handleIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    try {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    } catch (error) {
        console.error('Error initializing lazy loading:', error);
    }
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', function() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

/**
 * Handle page scroll events
 */
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(function() {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

/**
 * Handle scroll-based functionality
 */
function handleScroll() {
    try {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'var(--white)';
                navbar.style.backdropFilter = 'none';
            }
        }
    } catch (error) {
        console.error('Error handling scroll:', error);
    }
}

/**
 * Error boundary for uncaught errors
 */
window.addEventListener('error', function(e) {
    console.error('Uncaught error:', e.error);
    // Could send error reports to a logging service here
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send error reports to a logging service here
});

// Export functions for testing (if in a module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        showNotification,
        resetForm
    };
}