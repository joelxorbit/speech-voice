document.addEventListener('DOMContentLoaded', () => {
    // Highlight active link in navigation
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Check if the current location ends with the link path or if both represent the root
        if (currentLocation.endsWith(linkPath) || (currentLocation.endsWith('/') && linkPath === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Optional: Add some smooth reveal animations if elements come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.glass-panel').forEach(panel => {
        if (!panel.classList.contains('status-box') && !panel.classList.contains('command-guide')) {
            panel.style.opacity = 0;
            panel.style.transform = 'translateY(20px)';
            panel.style.transition = 'all 0.6s ease-out';
            observer.observe(panel);
        }
    });
});
