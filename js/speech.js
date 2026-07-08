document.addEventListener('DOMContentLoaded', () => {
    const micBtn = document.getElementById('micBtn');
    const micTranscript = document.getElementById('micTranscript');
    const voiceStatusText = document.getElementById('voiceStatusText');
    const voiceStatusPill = document.getElementById('voiceStatusPill');
    const visualizer = document.getElementById('visualizer');

    // Audio Context for subtle UI sound effects (beeps on recognized command)
    let audioCtx = null;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playSound(type) {
        try {
            initAudio();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            const now = audioCtx.currentTime;
            if (type === 'start') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === 'success') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(587.33, now);
                osc.frequency.setValueAtTime(880, now + 0.1);
                gainNode.gain.setValueAtTime(0.25, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === 'error') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(280, now);
                osc.frequency.linearRampToValueAtTime(180, now + 0.25);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'navigate') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(659.25, now);
                osc.frequency.linearRampToValueAtTime(987.77, now + 0.25);
                gainNode.gain.setValueAtTime(0.25, now);
                gainNode.gain.linearRampToValueAtTime(0, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            }
        } catch (e) {
            // Ignore if Web Audio blocked
        }
    }

    // Check Speech Recognition Support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        updateStatus('Error', 'Voice control unsupported in this browser.', true);
        if (micBtn) {
            micBtn.style.opacity = 0.4;
            micBtn.style.cursor = 'not-allowed';
        }
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let isListening = false;
    let autoRestartEnabled = true;

    function updateStatus(stateText, transcriptText, isError = false) {
        if (voiceStatusText) voiceStatusText.textContent = stateText;
        if (micTranscript) micTranscript.textContent = transcriptText;
        if (voiceStatusPill) {
            if (isError) {
                voiceStatusPill.classList.add('error');
            } else {
                voiceStatusPill.classList.remove('error');
            }
        }
    }

    function startListening() {
        if (isListening) return;
        try {
            autoRestartEnabled = true;
            recognition.start();
        } catch (e) {
            console.warn('Recognition start issue or already running:', e);
        }
    }

    function stopListening() {
        autoRestartEnabled = false;
        if (isListening) {
            recognition.stop();
        }
        isListening = false;
        if (micBtn) {
            micBtn.classList.remove('listening');
            micBtn.classList.add('stopped');
        }
        if (visualizer) visualizer.classList.remove('listening');
        updateStatus('Muted', 'Voice recognition paused. Click mic to resume.');
    }

    if (micBtn) {
        micBtn.addEventListener('click', () => {
            if (isListening) {
                stopListening();
            } else {
                startListening();
            }
        });
    }

    recognition.onstart = () => {
        isListening = true;
        if (micBtn) {
            micBtn.classList.add('listening');
            micBtn.classList.remove('stopped');
        }
        if (visualizer) visualizer.classList.add('listening');
        playSound('start');
        updateStatus('Listening', 'Speak a command or field value...');
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        if (interimTranscript) {
            updateStatus('Listening', `"${interimTranscript}"`);
        }

        if (finalTranscript) {
            const cleanedText = finalTranscript.trim().toLowerCase();
            updateStatus('Recognized', `"${finalTranscript.trim()}"`);
            processVoiceCommand(cleanedText);
        }
    };

    recognition.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            updateStatus('Mic Required', 'Please allow microphone access.', true);
            autoRestartEnabled = false;
        } else if (event.error === 'no-speech') {
            // Silent ignore
        } else {
            updateStatus('Listening', `Waiting for voice command...`);
        }
    };

    recognition.onend = () => {
        isListening = false;
        if (micBtn) micBtn.classList.remove('listening');
        if (visualizer) visualizer.classList.remove('listening');

        if (autoRestartEnabled) {
            setTimeout(() => {
                if (autoRestartEnabled && !isListening) {
                    try {
                        recognition.start();
                    } catch (e) {}
                }
            }, 300);
        } else {
            updateStatus('Muted', 'Microphone paused.');
        }
    };

    function flashInput(element, value) {
        if (!element) return;
        element.value = value;
        element.classList.add('voice-filled');
        setTimeout(() => element.classList.remove('voice-filled'), 1500);
        playSound('success');
    }

    function cleanVoiceValue(raw, prefixList) {
        let val = raw;
        for (let p of prefixList) {
            const regex = new RegExp(`^${p}\\s*`, 'i');
            val = val.replace(regex, '');
        }
        val = val.replace(/at the rate/g, '@').replace(/at/g, '@').replace(/dot/g, '.').replace(/\s+/g, '');
        return val;
    }

    // Process Voice Commands (No Bot Speech output)
    function processVoiceCommand(text) {
        // 1. Navigation Commands
        if (/\b(login|sign in|go to login|open login)\b/i.test(text) && !/\b(submit|button)\b/i.test(text)) {
            playSound('navigate');
            updateStatus('Voice Nav', 'Navigating to Login Page...');
            setTimeout(() => window.location.href = 'login.html', 800);
            return;
        }
        if (/\b(signup|sign up|register|create account|go to signup|open signup)\b/i.test(text) && !/\b(submit|button)\b/i.test(text)) {
            playSound('navigate');
            updateStatus('Voice Nav', 'Navigating to Signup Page...');
            setTimeout(() => window.location.href = 'signup.html', 800);
            return;
        }

        // 2. Clear / Reset
        if (/\b(clear|reset|erase form)\b/i.test(text)) {
            const forms = document.querySelectorAll('form');
            forms.forEach(f => f.reset());
            playSound('success');
            updateStatus('Cleared', 'All input fields cleared.');
            return;
        }

        // 3. Page specific form fills
        const currentPage = window.location.pathname.toLowerCase();
        const isSignup = currentPage.includes('signup.html');
        const isLogin = currentPage.includes('login.html') || (!isSignup && document.getElementById('loginForm'));

        // ============================
        // LOGIN PAGE COMMANDS
        // ============================
        if (isLogin) {
            // Email input
            if (/\b(email|my email is|user email|patient id|id)\b/i.test(text)) {
                let emailVal = cleanVoiceValue(text, ['my email is', 'email is', 'email', 'patient id is', 'patient id', 'id']);
                const emailInput = document.getElementById('email');
                if (emailInput && emailVal.length > 1) {
                    flashInput(emailInput, emailVal);
                    updateStatus('Voice Input', `Email -> ${emailVal}`);
                    return;
                }
            }

            // Password input
            if (/\b(password|my password is|pass)\b/i.test(text)) {
                let passVal = text.replace(/^(my password is|password is|password|pass)\s*/i, '').trim();
                const passInput = document.getElementById('password');
                if (passInput && passVal.length > 0) {
                    flashInput(passInput, passVal);
                    updateStatus('Voice Input', 'Password filled.');
                    return;
                }
            }

            // Submit login
            if (/\b(submit|log in now|sign in now|login now|login)\b/i.test(text)) {
                const loginForm = document.getElementById('loginForm');
                playSound('success');
                updateStatus('Success', 'Authenticating...');
                if (loginForm) {
                    setTimeout(() => loginForm.dispatchEvent(new Event('submit')), 600);
                }
                return;
            }
        }

        // ============================
        // SIGNUP PAGE COMMANDS
        // ============================
        if (isSignup) {
            // Full Name input
            if (/\b(name|full name|my name is)\b/i.test(text)) {
                let nameVal = text.replace(/^(my full name is|my name is|full name is|full name|name is|name)\s*/i, '').trim();
                const nameInput = document.getElementById('fullname');
                if (nameInput && nameVal.length > 1) {
                    nameVal = nameVal.replace(/\b\w/g, c => c.toUpperCase());
                    flashInput(nameInput, nameVal);
                    updateStatus('Voice Input', `Full Name -> ${nameVal}`);
                    return;
                }
            }

            // Email input
            if (/\b(email|my email is|user email)\b/i.test(text)) {
                let emailVal = cleanVoiceValue(text, ['my email is', 'email is', 'email']);
                const emailInput = document.getElementById('email');
                if (emailInput && emailVal.length > 1) {
                    flashInput(emailInput, emailVal);
                    updateStatus('Voice Input', `Email -> ${emailVal}`);
                    return;
                }
            }

            // Phone input
            if (/\b(phone|mobile|contact number)\b/i.test(text)) {
                let phoneVal = text.replace(/^(my phone is|phone number is|phone is|phone|mobile)\s*/i, '').replace(/\D/g, '');
                const phoneInput = document.getElementById('phone');
                if (phoneInput && phoneVal.length > 3) {
                    flashInput(phoneInput, phoneVal);
                    updateStatus('Voice Input', `Phone -> ${phoneVal}`);
                    return;
                }
            }

            // Password & Confirm Password
            if (/\b(password|my password is|pass)\b/i.test(text)) {
                let passVal = text.replace(/^(my password is|password is|password|pass)\s*/i, '').trim();
                const passInput = document.getElementById('password');
                const confirmInput = document.getElementById('confirmPassword');
                if (passInput && passVal.length > 0) {
                    flashInput(passInput, passVal);
                    if (confirmInput) confirmInput.value = passVal;
                    updateStatus('Voice Input', 'Password filled.');
                    return;
                }
            }

            // Submit registration
            if (/\b(submit|sign up now|register now|sign up|register)\b/i.test(text)) {
                const signupForm = document.getElementById('signupForm');
                playSound('success');
                updateStatus('Success', 'Creating Account...');
                if (signupForm) {
                    setTimeout(() => signupForm.dispatchEvent(new Event('submit')), 600);
                }
                return;
            }
        }

        playSound('error');
        updateStatus('Unrecognized', `Command "${text}" not matched.`);
    }

    // Automatically start speech recognition on window load (silent, no bot voice output)
    window.addEventListener('load', () => {
        try {
            startListening();
        } catch (err) {
            console.log('Auto start issue:', err);
        }
    });

    // Also auto-start on any first document click/keypress if not listening
    const unlockAutoStart = () => {
        if (!isListening) {
            startListening();
        }
        document.removeEventListener('click', unlockAutoStart);
        document.removeEventListener('keydown', unlockAutoStart);
    };
    document.addEventListener('click', unlockAutoStart);
    document.addEventListener('keydown', unlockAutoStart);
});
