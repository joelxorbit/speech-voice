/**
 * ============================================================================
 * Petition Acquisition Portal - AI Voice Command & Navigation Assistant
 * ============================================================================
 * Implements Web Speech API (SpeechRecognition & SpeechSynthesis) to control
 * pages, navigate portals, fill forms, and provide voice dictation without
 * altering any backend database operations or existing UI layouts.
 *
 * AUTO-LISTENING & PAGE LOADER EDITION:
 * Automatically activates microphone on page load and keeps it listening continuously.
 */

(function () {
    'use strict';

    // State Variables
    let recognition = null;
    let isListening = false;
    let autoListenEnabled = true; // Automatically restart listening without clicking buttons
    let speechEnabled = true;
    let targetDictationField = null;
    let isNavigating = false;

    // Complete Page URL Mapping for Voice Navigation across All Portals & Pages
    const PAGE_ROUTES = [
        // Citizen / Public Pages
        { keywords: ['home', 'home page', 'go home', 'main page'], url: 'index.php', label: 'Home Page' },
        { keywords: ['login', 'login page', 'user login', 'citizen login'], url: 'index.php', label: 'Login Page' },
        { keywords: ['register', 'sign up', 'registration', 'new user', 'create account'], url: 'register.php', label: 'Registration Page' },
        { keywords: ['user dashboard', 'user home', 'my account', 'user portal', 'user page'], url: 'user_page.php', label: 'User Dashboard' },
        { keywords: ['apply', 'apply petition', 'new petition', 'file petition', 'submit petition'], url: 'apply.php', label: 'Apply Petition Page' },
        { keywords: ['status', 'petition status', 'check status', 'track petition', 'my petitions'], url: 'status.php', label: 'Petition Status Page' },
        { keywords: ['feedback', 'add feedback', 'give feedback', 'submit feedback'], url: 'add_feed.php', label: 'Feedback Page' },

        // Officer Portal Pages
        { keywords: ['officer', 'officer login', 'employee login', 'staff login'], url: 'index_emp.php', label: 'Officer Login Page' },
        { keywords: ['officer home', 'officer dashboard', 'officer portal', 'officer page'], url: 'off_home.php', label: 'Officer Dashboard' },

        // Admin Portal Pages
        { keywords: ['admin', 'admin login', 'administrator login'], url: 'index_admin.php', label: 'Admin Login Page' },
        { keywords: ['admin home', 'admin dashboard', 'admin portal', 'admin page'], url: 'admin.php', label: 'Admin Dashboard' },
        { keywords: ['approved petitions', 'all petitions', 'admin petitions', 'petition list', 'view petitions'], url: 'approved.php', label: 'Approved Petitions Page' },
        { keywords: ['view feedback', 'admin feedback', 'citizen feedback', 'all feedback'], url: 'view_feed.php', label: 'View Feedback Page' },
        { keywords: ['survey', 'survey chart', 'analytics', 'statistics', 'chart'], url: 'survey.php', label: 'Survey Analytics Page' },

        // Global Actions
        { keywords: ['logout', 'sign out', 'log out'], url: 'logout.php', label: 'Logout' }
    ];

    // Field Aliases for Smart Form Matching across All Pages
    const FIELD_ALIASES = {
        'user id': ['uname', 'username', 'userid'],
        'userid': ['uname', 'username', 'userid'],
        'user': ['uname', 'username', 'userid'],
        'username': ['uname', 'username', 'userid'],
        'mobile': ['mobile', 'contact', 'phone'],
        'mobile number': ['mobile', 'contact', 'phone'],
        'contact': ['mobile', 'contact', 'phone'],
        'phone': ['mobile', 'contact', 'phone'],
        'password': ['pwd', 'pass', 'password'],
        'pass': ['pwd', 'pass', 'password'],
        'name': ['name', 'fullname', 'citizen_name'],
        'gender': ['gender'],
        'date of birth': ['dob'],
        'dob': ['dob'],
        'address': ['address'],
        'panchayat': ['area'],
        'area': ['area'],
        'taluk': ['taluk'],
        'district': ['district'],
        'state': ['state'],
        'pincode': ['pincode', 'pin'],
        'pin': ['pincode', 'pin'],
        'aadhar': ['aa1', 'aa2', 'aa3', 'aadhar'],
        'aadhar number': ['aa1', 'aa2', 'aa3', 'aadhar'],
        'email': ['email', 'mail'],
        'email id': ['email', 'mail'],
        'complaint': ['complaint', 'description', 'details'],
        'description': ['complaint', 'description', 'details'],
        'petition type': ['ptype', 'type'],
        'department': ['dept'],
        'otp': ['key', 'otp'],
        'key': ['key', 'otp'],
        'feedback': ['comment', 'feedback'],
        'comment': ['comment', 'feedback']
    };

    /**
     * Speak audio response back to the user
     */
    function speakResponse(message) {
        if (!speechEnabled || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }

    /**
     * Update Transcript UI Bubble
     */
    function updateTranscriptUI(text, statusText = 'Heard Command:') {
        const panel = document.getElementById('va-transcript-panel');
        const statusEl = document.getElementById('va-status-text');
        const textEl = document.getElementById('va-transcript-text');

        if (!panel || !statusEl || !textEl) return;

        statusEl.textContent = statusText;
        textEl.textContent = text;
        panel.classList.add('va-show');

        clearTimeout(window._vaTranscriptTimeout);
        window._vaTranscriptTimeout = setTimeout(() => {
            if (!isListening) {
                panel.classList.remove('va-show');
            }
        }, 4500);
    }

    /**
     * Set UI Active Listening State
     */
    function setListeningState(active) {
        isListening = active;
        const micBtn = document.getElementById('va-mic-btn');

        if (micBtn) {
            if (active) {
                micBtn.classList.add('va-listening');
                micBtn.innerHTML = '🎙️';
                micBtn.title = 'Voice Assistant Auto-Listening... (Click to pause)';
                updateTranscriptUI('Auto-Listening... Speak any command or field name', 'Voice Assistant Active');
            } else {
                micBtn.classList.remove('va-listening');
                micBtn.title = 'Resume Auto-Listening';
            }
        }
    }

    /**
     * Process & Execute Spoken Command
     */
    function processVoiceCommand(rawTranscript) {
        const transcript = rawTranscript.trim();
        if (!transcript) return;
        const lowerText = transcript.toLowerCase();

        updateTranscriptUI(`"${transcript}"`, 'Recognized Speech');

        // 1. Check if in Target Field Dictation Mode (Inline Mic clicked or Active Target set)
        if (targetDictationField && document.body.contains(targetDictationField)) {
            targetDictationField.value = transcript;
            targetDictationField.dispatchEvent(new Event('input', { bubbles: true }));
            targetDictationField.dispatchEvent(new Event('change', { bubbles: true }));
            speakResponse(`Filled with ${transcript}`);
            const inlineBtn = targetDictationField._vaInlineBtn;
            if (inlineBtn) inlineBtn.classList.remove('va-dictating');
            targetDictationField = null;
            return;
        }

        // 2. Next Field Command ("ok", "okay", "speech ok", "next", "next field", "tab", "move next") checked early!
        const isNextCommand = /^(?:speech\s+)?(?:go\s+to\s+)?(?:ok|okay|next|next field|move next|tab|go next)$/i.test(lowerText) || lowerText === 'ok' || lowerText === 'okay' || lowerText === 'next';
        if (isNextCommand) {
            const activeEl = document.activeElement || window._vaLastTouchedField;
            if (activeEl && (activeEl.type === 'submit' || activeEl.type === 'button')) {
                speakResponse('Submitting');
                activeEl.click();
            } else {
                moveToNextField();
            }
            return;
        }

        // 3. Submit & Login Action Commands ("login", "speech login", "click login", "submit", etc.) checked FIRST!
        const isLoginCommand = /^(?:speech\s+)?(?:click\s+)?(?:login|sign in|login button)$/i.test(lowerText) || lowerText.includes('login button') || lowerText.includes('click login') || lowerText.includes('speech login') || lowerText === 'login';
        const isSubmitCommand = /^(?:click\s+)?(?:submit|submit button|register|sign up|click register|apply|click apply|start process)$/i.test(lowerText) || lowerText === 'submit' || lowerText === 'register' || lowerText === 'apply';

        if (isLoginCommand || isSubmitCommand) {
            let actionBtn = null;
            if (isLoginCommand) {
                // Look for login button on current page
                actionBtn = document.querySelector('input[type="submit"][value*="Login" i], button[type="submit"][value*="Login" i], input[name="login"], button[name="login"], input[value*="Login" i], button[value*="Login" i]');
                if (!actionBtn) {
                    // Fallback to any submit button if we are on index/login pages
                    actionBtn = document.querySelector('input[type="submit"], button[type="submit"]');
                }
            } else if (lowerText.includes('register') || lowerText.includes('sign up')) {
                actionBtn = document.querySelector('input[name="reg"], input[value*="Register" i], button[value*="Register" i], input[value*="Sign Up" i], input[type="submit"]');
            } else {
                actionBtn = document.querySelector('input[type="submit"], button[type="submit"], button[type="button"][value*="Submit" i], input[type="button"][value*="Submit" i], input[name="btn"], input[name="btn1"]');
            }

            if (actionBtn) {
                isNavigating = true;
                speakResponse(isLoginCommand ? 'Logging in' : 'Submitting form');
                actionBtn.click();
                return;
            } else if (isLoginCommand) {
                // If on a page without a login button and they said "login", navigate to login page
                for (const route of PAGE_ROUTES) {
                    if (route.url === 'index.php') {
                        isNavigating = true;
                        speakResponse(`Opening ${route.label}`);
                        setTimeout(() => window.location.href = route.url, 600);
                        return;
                    }
                }
            } else {
                speakResponse('No submit button found on this page');
                return;
            }
        }

        // 3. Navigation Commands ("open [page]", "go to [page]")
        for (const route of PAGE_ROUTES) {
            for (const kw of route.keywords) {
                const navRegex = new RegExp(`^(open|go to|show|navigate to)?\\s*${kw}$`, 'i');
                if (navRegex.test(lowerText) || lowerText === `open ${kw}`) {
                    isNavigating = true;
                    speakResponse(`Opening ${route.label}`);
                    setTimeout(() => {
                        window.location.href = route.url;
                    }, 600);
                    return;
                }
            }
        }

        // 4. Scrolling Commands
        if (lowerText.includes('scroll down')) {
            window.scrollBy({ top: 400, behavior: 'smooth' });
            speakResponse('Scrolling down');
            return;
        }
        if (lowerText.includes('scroll up')) {
            window.scrollBy({ top: -400, behavior: 'smooth' });
            speakResponse('Scrolling up');
            return;
        }
        if (lowerText.includes('scroll to top') || lowerText.includes('go to top')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            speakResponse('Scrolled to top');
            return;
        }
        if (lowerText.includes('scroll to bottom')) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            speakResponse('Scrolled to bottom');
            return;
        }

        // 5. Clear Form Commands
        if (lowerText.includes('clear form') || lowerText.includes('reset form')) {
            const form = document.querySelector('form');
            if (form) {
                form.reset();
                speakResponse('Form cleared');
            }
            return;
        }

        // 6. Smart Form Filling by Field Name ("enter [field] [value]" or "[field] [value]")
        let fieldQuery = '';
        let valueText = '';

        const fillPatterns = [
            /^(?:enter|fill|type|set)\s+(.+?)\s+(?:with|as|to)?\s*(.+)$/i,
            /^(user id|userid|user|username|mobile number|mobile|contact|phone|password|pass|name|dob|date of birth|address|panchayat|area|taluk|district|state|pincode|pin|aadhar number|aadhar|email id|email|complaint|description|petition type|department|otp|key|feedback|comment)\s+(.+)$/i
        ];

        let matchedFill = false;
        for (const pattern of fillPatterns) {
            const match = rawTranscript.match(pattern);
            if (match && match[1] && match[2]) {
                fieldQuery = match[1].trim().toLowerCase();
                valueText = match[2].trim();
                matchedFill = true;
                break;
            }
        }

        if (matchedFill) {
            const filled = fillFormField(fieldQuery, valueText);
            if (filled) {
                speakResponse(`Filled ${fieldQuery} with ${valueText}`);
                return;
            }
        }

        // 7. Active Focused Field Dictation (When focused on ANY input field without clicking any mic icon!)
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
            const type = (activeEl.getAttribute('type') || '').toLowerCase();
            if (type !== 'submit' && type !== 'button' && type !== 'hidden' && type !== 'radio' && type !== 'checkbox') {
                if (lowerText === 'clear' || lowerText === 'clear field' || lowerText === 'reset field') {
                    if (activeEl.tagName !== 'SELECT') activeEl.value = '';
                    speakResponse('Field cleared');
                    return;
                }

                let dictationValue = transcript;
                const prefixMatch = transcript.match(/^(?:enter|type|dictate|fill)\s+(.+)$/i);
                if (prefixMatch && prefixMatch[1]) {
                    dictationValue = prefixMatch[1].trim();
                }

                setFieldValue(activeEl, dictationValue);
                speakResponse(`Entered ${dictationValue}`);
                return;
            }
        }

        // 8. Direct command fallback
        speakResponse('Command heard: ' + transcript + '. Say help to see available commands.');
    }

    /**
     * Move focus to the next form field when user says "ok" / "next"
     */
    function moveToNextField() {
        const focusableSelectors = 'input:not([type="hidden"]):not([disabled]):not([readonly]), select:not([disabled]), textarea:not([disabled])';
        const allFields = Array.from(document.querySelectorAll(focusableSelectors)).filter(el => {
            return !el.closest('#voice-assistant-dock') && !el.closest('#va-help-modal-backdrop') && el.offsetParent !== null && el.style.display !== 'none';
        });

        if (allFields.length === 0) {
            speakResponse('No form fields found on this page');
            return;
        }

        let currentEl = document.activeElement;
        if (!currentEl || !allFields.includes(currentEl)) {
            currentEl = window._vaLastTouchedField || null;
        }

        let nextIndex = 0;
        if (currentEl && allFields.includes(currentEl)) {
            const currentIndex = allFields.indexOf(currentEl);
            nextIndex = (currentIndex + 1) % allFields.length;
        }

        const nextEl = allFields[nextIndex];
        if (nextEl) {
            nextEl.focus();
            window._vaLastTouchedField = nextEl;

            let fieldLabel = '';
            if (nextEl.getAttribute('placeholder')) {
                fieldLabel = nextEl.getAttribute('placeholder');
            } else if (nextEl.getAttribute('name')) {
                fieldLabel = nextEl.getAttribute('name').toUpperCase();
            } else {
                const tr = nextEl.closest('tr');
                if (tr && tr.querySelector('th, td')) {
                    fieldLabel = tr.querySelector('th, td').textContent.trim();
                }
            }

            if (nextEl.tagName === 'SELECT') {
                speakResponse(fieldLabel ? `Moved to ${fieldLabel} dropdown` : 'Moved to next dropdown');
            } else if (nextEl.type === 'submit' || nextEl.type === 'button') {
                speakResponse(fieldLabel ? `Moved to ${fieldLabel} button` : 'Moved to submit button');
            } else {
                speakResponse(fieldLabel ? `Moved to ${fieldLabel}` : 'Moved to next field');
            }
        }
    }

    /**
     * Smart Field Matcher & Populator across All Pages
     */
    function fillFormField(fieldName, value) {
        if (fieldName.includes('aadhar')) {
            const digitsOnly = value.replace(/\D/g, '');
            const aa1 = document.querySelector('input[name="aa1"]');
            const aa2 = document.querySelector('input[name="aa2"]');
            const aa3 = document.querySelector('input[name="aa3"]');
            if (aa1 && aa2 && aa3 && digitsOnly.length >= 12) {
                aa1.value = digitsOnly.substring(0, 4);
                aa2.value = digitsOnly.substring(4, 8);
                aa3.value = digitsOnly.substring(8, 12);
                return true;
            }
        }

        let candidateNames = [fieldName];
        for (const key in FIELD_ALIASES) {
            if (fieldName.includes(key)) {
                candidateNames = candidateNames.concat(FIELD_ALIASES[key]);
            }
        }

        for (const cname of candidateNames) {
            const target = document.querySelector(`input[name="${cname}"], textarea[name="${cname}"], select[name="${cname}"]`);
            if (target) {
                setFieldValue(target, value);
                return true;
            }
        }

        // Check placeholders
        for (const cname of candidateNames) {
            const target = document.querySelector(`input[placeholder*="${cname}" i], textarea[placeholder*="${cname}" i]`);
            if (target) {
                setFieldValue(target, value);
                return true;
            }
        }

        // Check table cell headers (th & td labels)
        const cellList = document.querySelectorAll('th, td');
        for (const cell of cellList) {
            const cellText = cell.textContent.trim().toLowerCase();
            if (cellText && (cellText === fieldName || candidateNames.some(c => cellText.includes(c)))) {
                const tr = cell.closest('tr');
                if (tr) {
                    const input = tr.querySelector('input[type="text"], input[type="password"], input:not([type]), textarea, select');
                    if (input && input !== cell.querySelector('input, select, textarea')) {
                        setFieldValue(input, value);
                        return true;
                    }
                    const tdInput = cell.querySelector('input[type="text"], input[type="password"], input:not([type]), textarea, select');
                    if (tdInput) {
                        setFieldValue(tdInput, value);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Helper to populate form field correctly and trigger all change events
     */
    function setFieldValue(element, val) {
        if (element.tagName === 'SELECT') {
            for (let i = 0; i < element.options.length; i++) {
                if (element.options[i].text.toLowerCase().includes(val.toLowerCase()) ||
                    element.options[i].value.toLowerCase().includes(val.toLowerCase())) {
                    element.selectedIndex = i;
                    element.dispatchEvent(new Event('change', { bubbles: true }));
                    break;
                }
            }
        } else if (element.type === 'radio' || element.type === 'checkbox') {
            const radios = document.querySelectorAll(`input[name="${element.name}"]`);
            radios.forEach((r) => {
                if (r.value.toLowerCase().includes(val.toLowerCase()) || val.toLowerCase().includes(r.value.toLowerCase())) {
                    r.checked = true;
                    r.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        } else {
            element.value = val;
            element.focus();
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
        window._vaLastTouchedField = element;
    }

    /**
     * Initialize SpeechRecognition API
     */
    function initSpeechEngine() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            console.warn('Web Speech API Recognition not supported in this browser.');
            return false;
        }

        recognition = new SpeechRec();
        recognition.continuous = true; // Continuous recognition
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function () {
            setListeningState(true);
        };

        recognition.onresult = function (event) {
            const lastIdx = event.results.length - 1;
            const transcript = event.results[lastIdx][0].transcript;
            processVoiceCommand(transcript);
        };

        recognition.onerror = function (event) {
            console.warn('Voice Assistant Info/Error:', event.error);
            if (event.error === 'not-allowed') {
                updateTranscriptUI('Please allow microphone permission to auto-enable voice control.', 'Permission Needed');
            }
        };

        recognition.onend = function () {
            setListeningState(false);
            // Automatically restart if autoListenEnabled and not navigating away
            if (autoListenEnabled && !isNavigating) {
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) {
                        // Suppress start errors if already started
                    }
                }, 350);
            }
        };

        return true;
    }

    /**
     * Start Automatic Listening
     */
    function startAutoListening() {
        if (!recognition && !initSpeechEngine()) return;

        autoListenEnabled = true;
        try {
            recognition.start();
        } catch (e) {
            // If browser requires user interaction first, listen for first interaction
            const resumeOnInteraction = () => {
                if (autoListenEnabled && !isListening) {
                    try { recognition.start(); } catch (err) {}
                }
                document.removeEventListener('click', resumeOnInteraction);
                document.removeEventListener('keydown', resumeOnInteraction);
            };
            document.addEventListener('click', resumeOnInteraction);
            document.addEventListener('keydown', resumeOnInteraction);
        }
    }

    /**
     * Toggle Voice Assistant Recognition
     */
    function toggleVoiceAssistant() {
        if (!recognition && !initSpeechEngine()) {
            alert('Speech Recognition is not supported by your browser. Please try Google Chrome or Edge.');
            return;
        }

        if (isListening) {
            autoListenEnabled = false;
            recognition.stop();
            setListeningState(false);
        } else {
            autoListenEnabled = true;
            try {
                recognition.start();
            } catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * Inject Page Loader Overlay, Floating UI Dock & Help Modal into DOM
     */
    function renderVoiceAssistantUI() {
        // Create Page Loader Overlay
        const loader = document.createElement('div');
        loader.id = 'va-page-loader';
        loader.className = 'va-loader-show';
        loader.innerHTML = `
            <div class="va-loader-icon">🎙️</div>
            <div>
                <div>Voice Command Assistant Activated</div>
                <div style="font-size:11px; color:#38bdf8; font-weight:normal;">Auto-listening enabled • Speak any command</div>
            </div>
        `;
        document.body.appendChild(loader);

        // Auto hide page loader banner after 3.5 seconds
        setTimeout(() => {
            loader.classList.remove('va-loader-show');
        }, 3500);

        // Create Floating Dock
        const dock = document.createElement('div');
        dock.id = 'voice-assistant-dock';
        dock.innerHTML = `
            <div id="va-transcript-panel">
                <span class="va-status-label"><span class="va-status-dot"></span><span id="va-status-text">Voice Assistant Active</span></span>
                <span id="va-transcript-text" class="va-transcript-text">Auto-Listening... Speak any command</span>
            </div>
            <div class="va-controls-group">
                <button type="button" class="va-icon-btn" id="va-help-btn" title="View Voice Commands">❓</button>
                <button type="button" class="va-icon-btn" id="va-audio-toggle-btn" title="Toggle AI Speech Response">🔊</button>
            </div>
            <button type="button" id="va-mic-btn" title="Toggle Auto-Listening">🎙️</button>
        `;
        document.body.appendChild(dock);

        // Create Help Modal
        const modal = document.createElement('div');
        modal.id = 'va-help-modal-backdrop';
        modal.innerHTML = `
            <div id="va-help-card">
                <div class="va-help-header">
                    <h3>🎙️ Voice Command & Navigation Assistant</h3>
                    <button type="button" class="va-close-modal-btn" id="va-close-modal">&times;</button>
                </div>
                <div class="va-help-body">
                    <div class="va-help-section">
                        <h4>Page Navigation Commands (All Portals)</h4>
                        <div class="va-command-item"><span class="va-command-badge">"open home"</span><span class="va-command-desc">Go to Home / Login Page</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"open register"</span><span class="va-command-desc">Go to Registration / Sign Up</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"open user dashboard"</span><span class="va-command-desc">Go to Citizen Dashboard</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"open apply"</span><span class="va-command-desc">Go to Apply Petition Form</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"open status"</span><span class="va-command-desc">Check Petition Status Page</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"open feedback"</span><span class="va-command-desc">Go to Citizen Feedback Page</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"open officer dashboard"</span><span class="va-command-desc">Go to Officer Staff Portal</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"open admin dashboard"</span><span class="va-command-desc">Go to Admin Control Portal</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"open approved petitions"</span><span class="va-command-desc">Admin View Approved Petitions</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"open survey"</span><span class="va-command-desc">View Analytics & Survey Charts</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"logout"</span><span class="va-command-desc">Sign out of active account</span></div>
                    </div>
                    <div class="va-help-section">
                        <h4>Form Filling & Dictation</h4>
                        <div class="va-command-item"><span class="va-command-badge">"enter user id admin"</span><span class="va-command-desc">Fills User ID with 'admin'</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"enter mobile 9876543210"</span><span class="va-command-desc">Fills Mobile No. field</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"enter name John Doe"</span><span class="va-command-desc">Fills Name field</span></div>
                        <div class="va-command-item"><span class="va-command-badge">Focus any field & speak</span><span class="va-command-desc">Dictate directly without clicking mic</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"ok" / "next"</span><span class="va-command-desc">Move focus to next input box</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"login" / "click login"</span><span class="va-command-desc">Triggers Login button on page</span></div>
                        <div class="va-command-item"><span class="va-command-badge">"submit" / "click submit"</span><span class="va-command-desc">Submits the active form</span></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind Events
        document.getElementById('va-mic-btn').addEventListener('click', toggleVoiceAssistant);

        document.getElementById('va-help-btn').addEventListener('click', () => {
            modal.classList.add('va-modal-open');
        });

        document.getElementById('va-close-modal').addEventListener('click', () => {
            modal.classList.remove('va-modal-open');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('va-modal-open');
        });

        document.getElementById('va-audio-toggle-btn').addEventListener('click', function () {
            speechEnabled = !speechEnabled;
            this.textContent = speechEnabled ? '🔊' : '🔇';
            this.title = speechEnabled ? 'AI Speech Response ON' : 'AI Speech Response MUTED';
            speakResponse(speechEnabled ? 'Voice response enabled' : '');
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.code === 'Space') {
                e.preventDefault();
                toggleVoiceAssistant();
            }
        });
    }

    /**
     * No Inline Microphone Buttons - Kept empty to remove individual mic icons next to input fields
     */
    function attachInlineDictationButtons() {
        // Disabled per user request: No individual mic icons inside/next to form input fields.
        // Data can be entered via voice commands directly while focused or by speaking the field name.
    }

    // Initialize & Automatically Start Mic on Page Load
    function bootVoiceAssistant() {
        renderVoiceAssistantUI();
        document.addEventListener('focusin', (e) => {
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
                window._vaLastTouchedField = e.target;
            }
        });
        // Immediately start automatic continuous listening on page load across all pages!
        startAutoListening();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootVoiceAssistant);
    } else {
        bootVoiceAssistant();
    }

})();
