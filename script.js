// Timeline animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Animate timeline items on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // Form handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const accessCodeGroup = document.getElementById('accessCodeGroup');
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        // Handle form submission
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const verificationType = document.querySelector('input[name="verificationType"]:checked').value;
            
            // Validation
            if (!fullName || !email) {
                showError('Please fill in all required fields.');
                return;
            }

            if (!validateEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }

            // Check verification
            const accessCode = document.getElementById('accessCode').value.trim();
            if (!accessCode) {
                showError('Please enter your access code.');
                return;
            }

            // Success - In production, this would submit to a backend
            showSuccess('Registration successful! We look forward to seeing you on March 18th. Check your email for confirmation details.');
            signupForm.reset();
        });

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function showSuccess(message) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});
