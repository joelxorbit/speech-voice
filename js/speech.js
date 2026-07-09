document.addEventListener('DOMContentLoaded', () => {
    const micBtn = document.getElementById('micBtn');
    const micTranscript = document.getElementById('micTranscript');
    const voiceStatusText = document.getElementById('voiceStatusText');
    const voiceStatusPill = document.getElementById('voiceStatusPill');
    const visualizer = document.getElementById('visualizer');

    // Currently targeted field for direct voice dictation
    let activeVoiceField = null;

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
        clearActiveFieldMic();
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

    // Field-level mic buttons
    function clearActiveFieldMic() {
        document.querySelectorAll('.field-mic-btn').forEach(btn => {
            btn.classList.remove('listening-field');
        });
        activeVoiceField = null;
    }

    document.querySelectorAll('.field-mic-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const fieldId = btn.getAttribute('data-field');
            const targetInput = document.getElementById(fieldId);

            if (activeVoiceField === fieldId) {
                clearActiveFieldMic();
                updateStatus('Listening', 'Speak a command or field value...');
            } else {
                clearActiveFieldMic();
                activeVoiceField = fieldId;
                btn.classList.add('listening-field');
                if (targetInput) targetInput.focus();
                startListening();
                playSound('start');
                updateStatus('Dictating', `Speak value for ${fieldId.toUpperCase()}...`);
            }
        });
    });

    // Voice chips (sample commands guide)
    document.querySelectorAll('.voice-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-voice-cmd');
            if (cmd) {
                updateStatus('Simulating Command', `"${cmd}"`);
                processVoiceCommand(cmd);
            }
        });
    });

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
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(() => element.classList.remove('voice-filled'), 1500);
        playSound('success');
    }

    // Cleaners for specific fields
    function cleanEmailValue(raw) {
        let val = raw;
        const prefixes = [
            'enter email address', 'enter email', 'type email address', 'type email',
            'set email to', 'my email address is', 'my email is', 'user email is',
            'user email', 'patient email address', 'patient email', 'email address is',
            'email address', 'email is', 'email', 'patient id is', 'patient id',
            'id is', 'id'
        ];
        for (let p of prefixes) {
            const regex = new RegExp(`^${p}\\s*`, 'i');
            val = val.replace(regex, '');
        }
        val = val.replace(/at the rate/g, '@').replace(/at/g, '@').replace(/dot/g, '.').replace(/\s+/g, '');
        return val;
    }

    function cleanTextValue(raw, prefixes) {
        let val = raw;
        for (let p of prefixes) {
            const regex = new RegExp(`^${p}\\s*`, 'i');
            val = val.replace(regex, '');
        }
        return val.trim();
    }

    function cleanPhoneValue(raw) {
        let val = raw;
        const prefixes = [
            'enter phone number', 'enter phone', 'type phone number', 'type phone',
            'set phone to', 'my phone number is', 'my phone is', 'phone number is',
            'phone number', 'phone is', 'phone', 'mobile number', 'mobile is', 'mobile'
        ];
        for (let p of prefixes) {
            const regex = new RegExp(`^${p}\\s*`, 'i');
            val = val.replace(regex, '');
        }
        return val.replace(/\D/g, '');
    }

    // Helper: Focus input and activate its field mic
    function focusAndActivateField(inputEl) {
        if (!inputEl) return;
        inputEl.focus();
        clearActiveFieldMic();
        activeVoiceField = inputEl.id;
        const micBtnEl = document.querySelector(`.field-mic-btn[data-field="${inputEl.id}"]`);
        if (micBtnEl) micBtnEl.classList.add('listening-field');
        playSound('navigate');
        updateStatus('Focus Nav', `Focused ${inputEl.id.toUpperCase()}`);
    }

    // Process Voice Commands
    function processVoiceCommand(text) {
        // Check which page / form is active
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const isLogin = loginForm !== null || window.location.pathname.toLowerCase().includes('login');
        const isSignup = signupForm !== null || window.location.pathname.toLowerCase().includes('signup');

        // 1. Page-to-Page Navigation Commands
        if (/\b(go to login|open login|login page|switch to login|navigate to login|show login|patient login page)\b/i.test(text) || (!isLogin && /\b(login|sign in|patient login)\b/i.test(text))) {
            playSound('navigate');
            updateStatus('Voice Nav', 'Navigating to Login Page...');
            setTimeout(() => window.location.href = 'login.html', 600);
            return;
        }
        if (/\b(go to signup|open signup|signup page|register page|switch to signup|navigate to signup|show signup|new patient page|create account page)\b/i.test(text) || (!isSignup && /\b(signup|sign up|register|new patient)\b/i.test(text))) {
            playSound('navigate');
            updateStatus('Voice Nav', 'Navigating to Signup Page...');
            setTimeout(() => window.location.href = 'signup.html', 600);
            return;
        }
        if (/\b(go to home|home page|welcome page|welcome|go home)\b/i.test(text)) {
            playSound('navigate');
            updateStatus('Voice Nav', 'Navigating to Welcome Page...');
            setTimeout(() => window.location.href = 'index.html', 600);
            return;
        }

        // 2. Field-to-Field Speech Navigation (Next / Previous / Focus specific field)
        if (/\b(next field|next input|go to next|next)\b/i.test(text)) {
            const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]), select'));
            if (inputs.length > 0) {
                const currentIdx = inputs.indexOf(document.activeElement);
                const nextIdx = (currentIdx + 1) % inputs.length;
                focusAndActivateField(inputs[nextIdx]);
            }
            return;
        }
        if (/\b(previous field|previous input|go back field|last field|previous)\b/i.test(text)) {
            const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]), select'));
            if (inputs.length > 0) {
                const currentIdx = inputs.indexOf(document.activeElement);
                const prevIdx = (currentIdx - 1 + inputs.length) % inputs.length;
                focusAndActivateField(inputs[prevIdx]);
            }
            return;
        }

        // Focus Specific Field by Name
        if (/\b(focus email|go to email|email field)\b/i.test(text)) {
            focusAndActivateField(document.getElementById('email'));
            return;
        }
        if (/\b(focus password|go to password|password field)\b/i.test(text)) {
            focusAndActivateField(document.getElementById('password'));
            return;
        }
        if (/\b(focus name|go to name|name field|focus full name)\b/i.test(text)) {
            focusAndActivateField(document.getElementById('fullname'));
            return;
        }
        if (/\b(focus phone|go to phone|phone field|mobile field)\b/i.test(text)) {
            focusAndActivateField(document.getElementById('phone'));
            return;
        }
        if (/\b(focus confirm|go to confirm|confirm password field)\b/i.test(text)) {
            focusAndActivateField(document.getElementById('confirmPassword'));
            return;
        }

        // 3. Page Scrolling Commands
        if (/\b(scroll down|page down|go down|bottom)\b/i.test(text)) {
            window.scrollBy({ top: 350, behavior: 'smooth' });
            playSound('navigate');
            updateStatus('Voice Nav', 'Scrolled down.');
            return;
        }
        if (/\b(scroll up|page up|go up|top)\b/i.test(text)) {
            window.scrollBy({ top: -350, behavior: 'smooth' });
            playSound('navigate');
            updateStatus('Voice Nav', 'Scrolled up.');
            return;
        }

        // 4. Clear / Reset Form
        if (/\b(clear|reset|erase form|clear form|clear all)\b/i.test(text)) {
            const forms = document.querySelectorAll('form');
            forms.forEach(f => f.reset());
            clearActiveFieldMic();
            playSound('success');
            updateStatus('Cleared', 'All input fields cleared.');
            return;
        }

        // 3. Demo / Auto Fill Command
        if (/\b(fill demo details|fill demo|demo details|auto fill|fill all fields|fill details)\b/i.test(text)) {
            if (isLogin) {
                const emailInput = document.getElementById('email');
                const passInput = document.getElementById('password');
                if (emailInput) flashInput(emailInput, 'patient@voicecare.com');
                setTimeout(() => {
                    if (passInput) flashInput(passInput, 'SecureVoice123!');
                }, 300);
                updateStatus('Demo Filled', 'Login demo details populated.');
                return;
            } else if (isSignup) {
                const nameInput = document.getElementById('fullname');
                const emailInput = document.getElementById('email');
                const phoneInput = document.getElementById('phone');
                const passInput = document.getElementById('password');
                const confirmInput = document.getElementById('confirmPassword');
                const termsCheck = document.getElementById('terms');

                if (nameInput) flashInput(nameInput, 'Joel Roys');
                setTimeout(() => { if (emailInput) flashInput(emailInput, 'joel@voicecare.com'); }, 200);
                setTimeout(() => { if (phoneInput) flashInput(phoneInput, '5550192834'); }, 400);
                setTimeout(() => {
                    if (passInput) flashInput(passInput, 'VoicePass123!');
                    if (confirmInput) flashInput(confirmInput, 'VoicePass123!');
                    if (termsCheck) termsCheck.checked = true;
                }, 600);
                updateStatus('Demo Filled', 'Signup demo details populated.');
                return;
            }
        }

        // 4. Check Direct Active / Focused Field Dictation
        if (activeVoiceField) {
            const targetEl = document.getElementById(activeVoiceField);
            if (targetEl) {
                let formattedVal = text;
                if (activeVoiceField === 'email') {
                    formattedVal = cleanEmailValue(text);
                } else if (activeVoiceField === 'phone') {
                    formattedVal = cleanPhoneValue(text);
                } else if (activeVoiceField === 'fullname') {
                    formattedVal = text.replace(/\b\w/g, c => c.toUpperCase());
                }
                flashInput(targetEl, formattedVal);
                updateStatus('Field Filled', `${activeVoiceField} filled via voice.`);
                clearActiveFieldMic();
                return;
            }
        }

        // Also check if an input field is currently focused by cursor
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') && !/^(email|password|confirm|phone|name|submit|clear)/i.test(text)) {
            let val = text;
            if (activeElement.type === 'email') val = cleanEmailValue(text);
            else if (activeElement.type === 'tel') val = cleanPhoneValue(text);
            else if (activeElement.id === 'fullname') val = text.replace(/\b\w/g, c => c.toUpperCase());
            flashInput(activeElement, val);
            updateStatus('Active Field Input', `${activeElement.id || 'input'} filled.`);
            return;
        }

        // ============================
        // LOGIN PAGE COMMANDS
        // ============================
        if (isLogin) {
            // Email input
            if (/\b(email|patient email|patient id|user email)\b/i.test(text)) {
                let emailVal = cleanEmailValue(text);
                const emailInput = document.getElementById('email');
                if (emailInput && emailVal.length > 1) {
                    flashInput(emailInput, emailVal);
                    updateStatus('Voice Input', `Email -> ${emailVal}`);
                    return;
                }
            }

            // Password input
            if (/\b(password|my password is|pass)\b/i.test(text)) {
                let passVal = cleanTextValue(text, [
                    'enter password', 'type password', 'set password to',
                    'my password is', 'password is', 'user password', 'password', 'pass is', 'pass'
                ]);
                const passInput = document.getElementById('password');
                if (passInput && passVal.length > 0) {
                    flashInput(passInput, passVal);
                    updateStatus('Voice Input', 'Password filled.');
                    return;
                }
            }

            // Remember me checkbox
            if (/\b(remember me|check remember|keep me logged in)\b/i.test(text)) {
                const rememberBox = document.getElementById('remember');
                if (rememberBox) {
                    rememberBox.checked = true;
                    playSound('success');
                    updateStatus('Checkbox', 'Remember this device checked.');
                    return;
                }
            }
            if (/\b(uncheck remember|do not remember|dont remember)\b/i.test(text)) {
                const rememberBox = document.getElementById('remember');
                if (rememberBox) {
                    rememberBox.checked = false;
                    playSound('success');
                    updateStatus('Checkbox', 'Remember this device unchecked.');
                    return;
                }
            }

            // Submit login
            if (/\b(submit|log in now|sign in now|login now|login|sign in)\b/i.test(text)) {
                const loginFormEl = document.getElementById('loginForm');
                playSound('success');
                updateStatus('Success', 'Authenticating...');
                if (loginFormEl) {
                    setTimeout(() => loginFormEl.dispatchEvent(new Event('submit')), 600);
                }
                return;
            }
        }

        // ============================
        // SIGNUP PAGE COMMANDS
        // ============================
        if (isSignup) {
            // Full Name input
            if (/\b(name|full name|my name is|legal name)\b/i.test(text)) {
                let nameVal = cleanTextValue(text, [
                    'enter full name', 'enter name', 'type full name', 'type name',
                    'set name to', 'my full name is', 'my name is', 'full name is',
                    'full name', 'name is', 'name', 'legal name is', 'legal name'
                ]);
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
                let emailVal = cleanEmailValue(text);
                const emailInput = document.getElementById('email');
                if (emailInput && emailVal.length > 1) {
                    flashInput(emailInput, emailVal);
                    updateStatus('Voice Input', `Email -> ${emailVal}`);
                    return;
                }
            }

            // Phone input
            if (/\b(phone|mobile|contact number)\b/i.test(text)) {
                let phoneVal = cleanPhoneValue(text);
                const phoneInput = document.getElementById('phone');
                if (phoneInput && phoneVal.length > 2) {
                    flashInput(phoneInput, phoneVal);
                    updateStatus('Voice Input', `Phone -> ${phoneVal}`);
                    return;
                }
            }

            // Confirm Password input explicitly
            if (/\b(confirm password|reenter password|verify password)\b/i.test(text)) {
                let passVal = cleanTextValue(text, [
                    'enter confirm password', 'confirm password is', 'confirm password',
                    'reenter password is', 'reenter password', 'verify password'
                ]);
                const confirmInput = document.getElementById('confirmPassword');
                if (confirmInput && passVal.length > 0) {
                    flashInput(confirmInput, passVal);
                    updateStatus('Voice Input', 'Confirm Password filled.');
                    return;
                }
            }

            // Password input
            if (/\b(password|create password|my password is|pass)\b/i.test(text)) {
                let passVal = cleanTextValue(text, [
                    'enter create password', 'create password is', 'create password',
                    'enter password', 'type password', 'set password to',
                    'my password is', 'password is', 'password', 'pass is', 'pass'
                ]);
                const passInput = document.getElementById('password');
                const confirmInput = document.getElementById('confirmPassword');
                if (passInput && passVal.length > 0) {
                    flashInput(passInput, passVal);
                    if (confirmInput && !confirmInput.value) {
                        confirmInput.value = passVal;
                    }
                    updateStatus('Voice Input', 'Password filled.');
                    return;
                }
            }

            // Terms checkbox
            if (/\b(agree|accept terms|check terms|terms)\b/i.test(text)) {
                const termsBox = document.getElementById('terms');
                if (termsBox) {
                    termsBox.checked = true;
                    playSound('success');
                    updateStatus('Checkbox', 'Terms & Privacy Policy accepted.');
                    return;
                }
            }

            // Submit registration
            if (/\b(submit|create account|register now|sign up now|register|sign up)\b/i.test(text)) {
                const signupFormEl = document.getElementById('signupForm');
                playSound('success');
                updateStatus('Success', 'Creating Account...');
                if (signupFormEl) {
                    setTimeout(() => signupFormEl.dispatchEvent(new Event('submit')), 600);
                }
                return;
            }
        }

        playSound('error');
        updateStatus('Unrecognized', `Command "${text}" not matched.`);
    }

    // Automatically start speech recognition on window load
    window.addEventListener('load', () => {
        try {
            startListening();
        } catch (err) {
            console.log('Auto start issue:', err);
        }
    });

    // Unlock speech recognition on any first document interaction
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

