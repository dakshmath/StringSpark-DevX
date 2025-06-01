document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation Menu Toggle
    setupMobileNav();

    // Add animation classes to elements as they come into view
    setupScrollAnimations();

    // Add form validation for forms on the site
    setupFormValidation();

    // Setup specific page functionality
    setupPageSpecificFunctionality();
});

/**
 * Sets up mobile navigation menu toggle functionality
 */
function setupMobileNav() {
    const navContainer = document.querySelector('.nav-container');
    let hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // If hamburger doesn't exist, create it
    if (!hamburger && navContainer) {
        hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        navContainer.appendChild(hamburger);
    }

    // Add event listener to hamburger menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function (e) {
            e.preventDefault();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when a nav link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Adjust nav on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

/**
 * Sets up scroll animations for elements
 */
function setupScrollAnimations() {
    // Add fadeIn animation classes to section titles and content
    const animateElements = document.querySelectorAll('.section-title, .reason-card, .service-card, .testimonial-card');

    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add animation classes with staggered delays
                entry.target.classList.add('fadeIn');
                // Add different delay for each element
                entry.target.classList.add(`delay-${(index % 5 + 1) * 100}`);
                // Unobserve after animation is added
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe each element
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Sets up form validation for all forms on the site
 */
function setupFormValidation() {
    // Teacher Application Form Validation
    const teacherForm = document.getElementById('teacherApplicationForm');
    if (teacherForm) {
        teacherForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateTeacherForm()) {
                // Submit the form or show success message
                showFormSubmissionMessage(teacherForm, 'Thank you for your application! We will contact you soon.');
            }
        });
    }

    // Student Registration Form Validation
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateRegistrationForm()) {
                // Submit the form or show success message
                showFormSubmissionMessage(registrationForm, 'Registration successful! You will receive a confirmation email shortly.');
            }
        });
    }
}

/**
 * Validates the teacher application form
 * @returns {boolean} True if the form is valid, false otherwise
 */
function validateTeacherForm() {
    const form = document.getElementById('teacherApplicationForm');
    let isValid = true;

    // Reset all error messages
    resetFormErrors(form);

    // Required fields validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    // Email validation
    const emailField = document.getElementById('teacherEmail');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    // Checkbox groups validation (at least one must be selected)
    const checkboxGroups = form.querySelectorAll('.checkbox-group');
    checkboxGroups.forEach(group => {
        const groupName = group.querySelector('input[type="checkbox"]').name;
        const checkedBoxes = group.querySelectorAll(`input[name="${groupName}"]:checked`);

        if (checkedBoxes.length === 0 && group.querySelector('input[required]')) {
            const errorElem = group.closest('.form-group').querySelector('.error-message');
            if (errorElem) {
                errorElem.textContent = 'Please select at least one option';
            }
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Validates the student registration form
 * @returns {boolean} True if the form is valid, false otherwise
 */
function validateRegistrationForm() {
    const form = document.getElementById('registrationForm');
    if (!form) return true; // Form doesn't exist

    let isValid = true;

    // Reset all error messages
    resetFormErrors(form);

    // Required fields validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });

    // Email validation
    const emailField = document.getElementById('parentEmail');
    if (emailField && emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    // Check if a lesson option is selected
    const lessonOptionSelected = form.querySelector('input[name="lessonType"]:checked');
    if (!lessonOptionSelected) {
        const lessonError = document.getElementById('lessonTypeError');
        if (lessonError) {
            lessonError.textContent = 'Please select a lesson type';
        }
        isValid = false;
    }

    // Check if a time slot is selected when applicable
    const groupLessonSelected = form.querySelector('input[name="lessonType"][value="group"]:checked');
    if (groupLessonSelected) {
        const timeSlotSelected = form.querySelector('.time-slot.selected');
        if (!timeSlotSelected) {
            const timeSlotError = document.getElementById('timeSlotError');
            if (timeSlotError) {
                timeSlotError.textContent = 'Please select a time slot';
            }
            isValid = false;
        }
    }

    return isValid;
}

/**
 * Shows form submission success message and resets the form
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - The success message to display
 */
function showFormSubmissionMessage(form, message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-message';
    successDiv.style.cssText = `
        background-color: #4BB543;
        color: white;
        padding: 15px;
        border-radius: 5px;
        margin: 20px 0;
        text-align: center;
        font-weight: 500;
    `;
    successDiv.textContent = message;

    // Add success message before the form
    form.parentNode.insertBefore(successDiv, form);

    // Hide the form
    form.style.display = 'none';

    // Scroll to the success message
    successDiv.scrollIntoView({ behavior: 'smooth' });

    // Remove success message and show form after 5 seconds
    setTimeout(() => {
        successDiv.remove();
        form.reset();
        form.style.display = 'block';
    }, 5000);
}

/**
 * Resets all error messages in a form
 * @param {HTMLFormElement} form - The form element
 */
function resetFormErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
    });
}

/**
 * Shows an error message for a form field
 * @param {HTMLElement} field - The form field
 * @param {string} message - The error message
 */
function showFieldError(field, message) {
    const errorElem = field.closest('.form-group').querySelector('.error-message');
    if (errorElem) {
        errorElem.textContent = message;
    }
    field.focus();
}

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email is valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Sets up page-specific functionality based on the current page
 */
function setupPageSpecificFunctionality() {
    // Teacher Application Page
    if (document.querySelector('.teacher-application-section')) {
        setupTeacherApplicationPage();
    }

    // Registration Page
    if (document.querySelector('.registration-section')) {
        setupRegistrationPage();
    }

    // Home Page
    if (document.querySelector('.hero')) {
        setupHomePage();
    }
}

/**
 * Sets up functionality specific to the Teacher Application page
 */
function setupTeacherApplicationPage() {
    // Custom checkbox behavior for "required" checkbox groups
    const checkboxGroups = document.querySelectorAll('.checkbox-group');
    checkboxGroups.forEach(group => {
        const checkboxes = group.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function () {
                // If at least one checkbox is checked, remove required attribute from all
                const groupName = this.name;
                const checkedBoxes = group.querySelectorAll(`input[name="${groupName}"]:checked`);

                checkboxes.forEach(cb => {
                    if (checkedBoxes.length > 0) {
                        cb.removeAttribute('required');
                    } else {
                        cb.setAttribute('required', '');
                    }
                });
            });
        });
    });
}

/**
 * Sets up functionality specific to the Registration page
 */
function setupRegistrationPage() {
    // Lesson Type Toggle
    const lessonTypeRadios = document.querySelectorAll('input[name="lessonType"]');
    if (lessonTypeRadios.length) {
        lessonTypeRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                // Find all lesson options
                const lessonOptions = document.querySelectorAll('.lesson-option');
                lessonOptions.forEach(option => {
                    option.classList.remove('selected');
                });

                // Add selected class to the parent option
                this.closest('.lesson-option').classList.add('selected');

                // Show/hide time slots based on selected lesson type
                const timeSlotSection = document.getElementById('timeSlotSection');
                if (timeSlotSection) {
                    if (this.value === 'group') {
                        timeSlotSection.style.display = 'block';
                    } else {
                        timeSlotSection.style.display = 'none';
                    }
                }
            });
        });
    }

    // Time Slot Selection
    const timeSlots = document.querySelectorAll('.time-slot');
    if (timeSlots.length) {
        timeSlots.forEach(slot => {
            slot.addEventListener('click', function () {
                timeSlots.forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');

                // Update hidden input with selected time
                const timeSlotInput = document.getElementById('selectedTimeSlot');
                if (timeSlotInput) {
                    timeSlotInput.value = this.dataset.time;
                }
            });
        });
    }

    // Registration Type Toggle
    const registrationToggle = document.querySelectorAll('.registration-toggle input[type="radio"]');
    if (registrationToggle.length) {
        registrationToggle.forEach(radio => {
            radio.addEventListener('change', function () {
                const formSections = document.querySelectorAll('.form-section');
                formSections.forEach(section => {
                    if (section.dataset.type === this.value || !section.dataset.type) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Sets up functionality specific to the Home page
 */
function setupHomePage() {
    // Animated background elements can be enhanced with JavaScript
    animateBackgroundElements();
}

/**
 * Enhances the animation of background elements
 */
function animateBackgroundElements() {
    const notes = document.querySelectorAll('.floating-note');
    const instruments = document.querySelectorAll('.floating-instrument');

    // Add random start positions to background elements
    [...notes, ...instruments].forEach(elem => {
        const randomX = Math.floor(Math.random() * 80) + 10; // 10% to 90% of viewport
        const randomY = Math.floor(Math.random() * 80) + 10; // 10% to 90% of viewport

        elem.style.top = `${randomY}%`;
        elem.style.left = `${randomX}%`;
        elem.style.animationDelay = `${Math.random() * 20}s`; // Random delay up to 20s
    });
}