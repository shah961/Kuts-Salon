/**
 * Main Application Script for Kuts & More Unisex Salon
 * Handles navigation, mobile menu accessibility, header scroll states,
 * and contact form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNavigation();
    initAppointmentForm();
});

/**
 * Header Background Toggle on Scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    const onScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial check
}

/**
 * Mobile Navigation Control
 * STRICT REQUIREMENT: Mobile menu MUST NOT respond to swipe gestures or sit outside viewport.
 * Controlled ONLY via click/tap on hamburger button or close button.
 */
function initMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!mobileMenuBtn || !mobileNav) return;

    function openMenu() {
        mobileNav.classList.add('is-open');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeMenu() {
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileNav.classList.contains('is-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking any mobile link
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
            closeMenu();
        }
    });
}

/**
 * Appointment Form Validation & Submission Handling
 */
function initAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const feedback = document.getElementById('formFeedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.error-text').forEach(el => el.textContent = '');

        const fullName = form.fullName.value.trim();
        const phoneNumber = form.phoneNumber.value.trim();
        const service = form.preferredService.value;
        const date = form.preferredDate.value;
        const time = form.preferredTime.value;

        let isValid = true;

        if (!fullName) {
            setError('fullName', 'Please enter your full name.');
            isValid = false;
        }

        if (!phoneNumber || phoneNumber.length < 8) {
            setError('phoneNumber', 'Please enter a valid phone number.');
            isValid = false;
        }

        if (!service) {
            setError('preferredService', 'Please select a service category.');
            isValid = false;
        }

        if (!date) {
            setError('preferredDate', 'Please select a date.');
            isValid = false;
        }

        if (!time) {
            setError('preferredTime', 'Please select a time slot.');
            isValid = false;
        }

        if (isValid) {
            // Frontend-only confirmation message (No fake backend response claimed)
            if (feedback) {
                feedback.hidden = false;
                feedback.innerHTML = `
                    <strong>Thank you, ${escapeHtml(fullName)}.</strong><br>
                    Your appointment request details have been prepared. Please call us directly at 
                    <a href="tel:+912223070281" style="color:var(--accent-gold);text-decoration:underline;">022 2307 0281</a> 
                    to finalize your slot availability with the salon desk.
                `;
            }
            form.reset();
        }
    });

    function setError(fieldId, message) {
        const errEl = document.getElementById(`err-${fieldId}`);
        if (errEl) errEl.textContent = message;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}
