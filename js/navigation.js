document.addEventListener('DOMContentLoaded', () => {
    // Highlight active link in navigation
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.endsWith(linkPath) || (currentLocation.endsWith('/') && linkPath === 'login.html')) {
            link.classList.add('active');
        }
    });

    // Handle Form Submissions cleanly without bot speech
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email')?.value || 'User';
            
            const statusPill = document.getElementById('voiceStatusPill');
            const transcript = document.getElementById('micTranscript');
            if (transcript) transcript.textContent = `Welcome back, ${email}! Accessing portal...`;
            if (statusPill) statusPill.innerHTML = `✅ Authenticated`;
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fullname')?.value || 'New User';
            
            const statusPill = document.getElementById('voiceStatusPill');
            const transcript = document.getElementById('micTranscript');
            if (transcript) transcript.textContent = `Registration complete for ${name}! Redirecting...`;
            if (statusPill) statusPill.innerHTML = `✅ Account Created`;

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1800);
        });
    }
});
