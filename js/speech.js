document.addEventListener('DOMContentLoaded', () => {
    const micBtn = document.getElementById('micBtn');
    const micContainer = document.querySelector('.mic-container');
    const statusBox = document.getElementById('statusBox');
    const statusText = document.getElementById('statusText');
    const recognizedText = document.getElementById('recognizedText');

    if (!micBtn) return; // Not all pages might have the mic button if we exclude it, but we'll include it everywhere.

    // Audio Context for sound effects
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playSound(type) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        if (type === 'start') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554, now + 0.1); // C#
            osc.frequency.setValueAtTime(659, now + 0.2); // E
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(200, now + 0.3);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'navigate') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.linearRampToValueAtTime(440, now + 0.2);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        }
    }

    // Check Support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showStatus('Error', 'Speech Recognition is not supported in your browser.');
        micBtn.style.opacity = 0.5;
        micBtn.style.cursor = 'not-allowed';
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Auto stop after recognition
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let isListening = false;

    // Command Map
    const commands = [
        { regex: /\b(home|index)\b/i, url: 'index.html', name: 'Home' },
        { regex: /\b(login|sign in|log in)\b/i, url: 'login.html', name: 'Login' },
        { regex: /\b(signup|sign up|register|create account)\b/i, url: 'signup.html', name: 'Signup' },
        { regex: /\b(about)\b/i, url: 'about.html', name: 'About' },
        { regex: /\b(services)\b/i, url: 'services.html', name: 'Services' },
        { regex: /\b(contact)\b/i, url: 'contact.html', name: 'Contact' }
    ];

    function showStatus(status, text) {
        statusBox.classList.add('visible');
        statusText.textContent = status;
        recognizedText.textContent = text;
        
        if (status === 'Error') {
            recognizedText.style.color = 'var(--error-color)';
        } else {
            recognizedText.style.color = 'var(--accent-hover)';
        }
    }

    micBtn.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch (e) {
                console.error(e);
            }
        }
    });

    recognition.onstart = () => {
        isListening = true;
        micContainer.classList.add('listening');
        playSound('start');
        showStatus('🎤 Listening...', 'Speak now...');
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
            showStatus('Processing...', interimTranscript);
        }

        if (finalTranscript) {
            showStatus('You said:', finalTranscript);
            processCommand(finalTranscript);
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error detected: ' + event.error);
        if (event.error === 'no-speech') {
            showStatus('Error', 'No speech was detected. Please try again.');
        } else {
            showStatus('Error', `Error: ${event.error}`);
        }
        playSound('error');
    };

    recognition.onend = () => {
        isListening = false;
        micContainer.classList.remove('listening');
        if (statusText.textContent === '🎤 Listening...' || statusText.textContent === 'Processing...') {
            // Reset if ended without result
            showStatus('Stopped', 'Microphone turned off.');
        }
    };

    function processCommand(text) {
        let matched = false;
        for (let cmd of commands) {
            if (cmd.regex.test(text)) {
                matched = true;
                playSound('success');
                showStatus('Voice Recognized', `Navigating to ${cmd.name}...`);
                
                setTimeout(() => {
                    playSound('navigate');
                    window.location.href = cmd.url;
                }, 1500);
                break;
            }
        }

        if (!matched) {
            playSound('error');
            showStatus('Error', 'Command not recognized. Please try again.');
        }
    }
});
