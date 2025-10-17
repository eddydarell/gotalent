import { Html5QrcodeScanner } from 'html5-qrcode';

// Main application class
class QRScannerApp {
    constructor() {
        this.scanner = null;
        this.isScanning = false;
        this.hasPermission = false;
        this.audioContext = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initAudio();
        this.showInitialScreen();
    }

    initAudio() {
        // Initialize audio context for success sound
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.log('Audio context not supported:', error);
        }
    }

    playSuccessSound() {
        if (!this.audioContext) return;

        try {
            // Create a simple success beep
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Could not play success sound:', error);
        }
    }

    showInitialScreen() {
        this.hideAllSections();
        document.getElementById('permission-request')?.classList.remove('hidden');
    }

    bindEvents() {
        const startBtn = document.getElementById('start-scan-btn');
        const stopBtn = document.getElementById('stop-scan-btn');
        const scanAgainBtn = document.getElementById('scan-again-btn');
        const retryBtn = document.getElementById('retry-btn');
        
        // Manual input controls (in main section)
        const toggleManualInputBtn = document.getElementById('toggle-manual-input');
        const submitManualInputBtn = document.getElementById('submit-manual-input');
        const cancelManualInputBtn = document.getElementById('cancel-manual-input');
        const manualInput = document.getElementById('manual-input');
        
        // Standalone manual input controls
        const useManualInputBtn = document.getElementById('use-manual-input-btn');
        const submitStandaloneInputBtn = document.getElementById('submit-standalone-input');
        const backToOptionsBtn = document.getElementById('back-to-options');
        const standaloneManualInput = document.getElementById('standalone-manual-input');

        startBtn?.addEventListener('click', () => this.startScanning());
        stopBtn?.addEventListener('click', () => this.stopScanning());
        scanAgainBtn?.addEventListener('click', () => this.resetScanner());
        retryBtn?.addEventListener('click', () => this.resetScanner());
        
        // Manual input event listeners (main section)
        toggleManualInputBtn?.addEventListener('click', () => this.toggleManualInput());
        submitManualInputBtn?.addEventListener('click', () => this.submitManualInput());
        cancelManualInputBtn?.addEventListener('click', () => this.hideManualInput());
        
        // Standalone manual input event listeners
        useManualInputBtn?.addEventListener('click', () => this.showStandaloneManualInput());
        submitStandaloneInputBtn?.addEventListener('click', () => this.submitStandaloneInput());
        backToOptionsBtn?.addEventListener('click', () => this.showInitialScreen());
        
        // Enter key support for manual inputs
        manualInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitManualInput();
        });
        standaloneManualInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitStandaloneInput();
        });
    }
  
  async startScanning() {
    if (this.isScanning) return;

    const qrReader = document.getElementById('qr-reader');
    if (!qrReader) {
        console.error('QR reader element not found');
        this.showError('Élément lecteur QR introuvable. Veuillez vérifier votre HTML.');
        return;
    }

    try {
        this.showLoading(true, 'Initialisation du scanner...');
        this.hideSection('error-section');
        this.hideSection('result-section');

        const startBtn = document.getElementById('start-scan-btn');
        const stopBtn = document.getElementById('stop-scan-btn');
        const scanningTips = document.getElementById('scanning-tips');
        const welcomeSection = document.getElementById('welcome-section');

        // Hide welcome section and show QR reader
        welcomeSection?.classList.add('hidden');
        qrReader.classList.remove('hidden');
        startBtn?.classList.add('hidden');
        stopBtn?.classList.remove('hidden');
        scanningTips?.classList.remove('hidden');

        // Clear any existing scanner first
        if (this.scanner) {
            this.scanner.clear();
            this.scanner = null;
        }

        // Try to get cameras and auto-select rear camera
        await this.initializeScannerWithCamera();

    } catch (error) {
        console.error('Error starting scanner:', error);
        this.showError('Échec du démarrage de la caméra : ' + error.message);
        this.showLoading(false);
        this.resetScannerUI();
    }
}

    async initializeScannerWithCamera() {
        try {
            // Import Html5Qrcode dynamically
            const { Html5Qrcode } = await import('html5-qrcode');
            
            // Get available cameras
            const cameras = await Html5Qrcode.getCameras();
            console.log('Available cameras:', cameras);

            if (cameras && cameras.length) {
                // Try to find the back/environment camera
                const backCamera = cameras.find(camera => 
                    /back|environment|rear/i.test(camera.label)
                ) || cameras[cameras.length - 1]; // fallback to the last camera (often the back camera)

                console.log('Selected camera:', backCamera);

                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    disableFlip: false,
                    rememberLastUsedCamera: true,
                    showTorchButtonIfSupported: true,
                    showZoomSliderIfSupported: true,
                    defaultZoomValueIfSupported: 2
                };

                // Create Html5Qrcode instance and start with selected camera
                const html5QrCode = new Html5Qrcode("qr-reader");
                this.scanner = html5QrCode;

                await html5QrCode.start(
                    backCamera.id,
                    config,
                    (decodedText) => this.onScanSuccess(decodedText),
                    (error) => this.onScanFailure(error)
                );

                this.isScanning = true;
                this.showLoading(false);
                console.log('Camera started successfully with rear camera');

            } else {
                // No cameras found, fall back to the original scanner
                console.log('No cameras found, falling back to Html5QrcodeScanner');
                await this.fallbackToOriginalScanner();
            }

        } catch (error) {
            console.error('Error with camera selection, falling back to original scanner:', error);
            // Fall back to the original scanner if camera selection fails
            await this.fallbackToOriginalScanner();
        }
    }

    async fallbackToOriginalScanner() {
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            disableFlip: false,
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
            defaultZoomValueIfSupported: 2,
            videoConstraints: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        console.log('Starting fallback scanner with config:', config);
        this.scanner = new Html5QrcodeScanner("qr-reader", config, false);
        
        this.scanner.render(
            (decodedText) => this.onScanSuccess(decodedText),
            (error) => this.onScanFailure(error)
        );

        this.isScanning = true;
        this.showLoading(false);

        // Auto-click the camera permission button if it appears
        setTimeout(() => {
            this.autoClickCameraButton();
        }, 500);
    }

    autoClickCameraButton() {
        // Look for the "Request Camera Permissions" button and click it automatically
        const observer = new MutationObserver(() => {
            const permissionButton = document.querySelector('#qr-reader button');
            if (permissionButton && permissionButton.textContent.includes('Request Camera Permissions')) {
                console.log('Auto-clicking camera permission button');
                permissionButton.click();
                observer.disconnect();
            }
        });

        observer.observe(document.getElementById('qr-reader'), {
            childList: true,
            subtree: true
        });

        // Also try immediate click in case the button is already there
        setTimeout(() => {
            const permissionButton = document.querySelector('#qr-reader button');
            if (permissionButton && permissionButton.textContent.includes('Request Camera Permissions')) {
                console.log('Auto-clicking camera permission button (immediate)');
                permissionButton.click();
            }
        }, 100);

        // Stop observing after 3 seconds
        setTimeout(() => {
            observer.disconnect();
        }, 3000);
    }

    stopScanning() {
        if (this.scanner && this.isScanning) {
            try {
                // Check if it's an Html5Qrcode instance (has stop method) or Html5QrcodeScanner (has clear method)
                if (typeof this.scanner.stop === 'function') {
                    // Html5Qrcode instance
                    this.scanner.stop().then(() => {
                        console.log('Scanner stopped successfully');
                    }).catch((error) => {
                        console.error('Error stopping scanner:', error);
                    });
                } else if (typeof this.scanner.clear === 'function') {
                    // Html5QrcodeScanner instance
                    this.scanner.clear();
                }
            } catch (error) {
                console.error('Error during scanner cleanup:', error);
            }
            
            this.scanner = null;
            this.isScanning = false;
            this.resetScannerUI();
        }
    }

    resetScannerUI() {
        const qrReader = document.getElementById('qr-reader');
        const startBtn = document.getElementById('start-scan-btn');
        const stopBtn = document.getElementById('stop-scan-btn');
        const scanningTips = document.getElementById('scanning-tips');
        const welcomeSection = document.getElementById('welcome-section');

        // Hide QR reader and show welcome section
        qrReader?.classList.add('hidden');
        welcomeSection?.classList.remove('hidden');
        startBtn?.classList.remove('hidden');
        stopBtn?.classList.add('hidden');
        scanningTips?.classList.add('hidden');
    }

    toggleManualInput() {
        const manualInputForm = document.getElementById('manual-input-form');
        
        if (manualInputForm?.classList.contains('hidden')) {
            this.showManualInput();
        } else {
            this.hideManualInput();
        }
    }

    showManualInput() {
        const manualInputForm = document.getElementById('manual-input-form');
        const toggleBtn = document.getElementById('toggle-manual-input');
        
        manualInputForm?.classList.remove('hidden');
        toggleBtn.innerHTML = `
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            Annuler la saisie
        `;
        
        // Focus on input field
        document.getElementById('manual-input')?.focus();
    }

    hideManualInput() {
        const manualInputForm = document.getElementById('manual-input-form');
        const toggleBtn = document.getElementById('toggle-manual-input');
        const manualInput = document.getElementById('manual-input');
        
        manualInputForm?.classList.add('hidden');
        toggleBtn.innerHTML = `
            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Saisir les détails
        `;
        
        // Clear input
        if (manualInput) manualInput.value = '';
    }

    async submitManualInput() {
        const manualInput = document.getElementById('manual-input');
        
        const input = manualInput?.value.trim() || '';
        
        // Validation
        if (!input) {
            this.showError('Veuillez entrer soit une adresse email soit un numéro de téléphone.');
            return;
        }
        
        // Determine input type using regex
        const inputType = this.detectInputType(input);
        
        if (inputType === 'invalid') {
            this.showError('Veuillez entrer une adresse email ou un numéro de téléphone valide (ex: utilisateur@exemple.com ou +243123456789).');
            return;
        }

        // Hide manual input and show loading
        this.hideManualInput();
        this.hideSection('scanner-section');
        this.showLoading(true, 'Vérification de l\'inscription...');

        try {
            // Create vCard-like data object
            const vCardData = {
                name: '', // No name from manual input
                email: inputType === 'email' ? input : '',
                phone: inputType === 'phone' ? input : ''
            };

            // Check registration
            const registrationResult = await this.checkRegistration(vCardData);
            
            // Play success sound for manual input too
            this.playSuccessSound();
            
            this.showResult(registrationResult, vCardData);

        } catch (error) {
            console.error('Error processing manual input:', error);
            this.showError('Erreur lors de la vérification de l\'inscription : ' + error.message);
        }

        this.showLoading(false);
    }

    detectInputType(input) {
        // Email regex pattern
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        // Phone regex patterns for DR Congo
        const phonePatterns = [
            /^(\+243|00243|00\s?243)\s?[1-9]\d{1}\s?\d{3}\s?\d{2}\s?\d{2}$/, // international formats with optional spaces
            /^0\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/ // local format with or without spaces
        ];
        
        // Check if it's an email
        if (emailRegex.test(input)) {
            return 'email';
        }
        
        // Remove all non-digits for phone number checking
        const digitsOnly = input.replace(/\D/g, '');
        
        // Check phone patterns
        for (const pattern of phonePatterns) {
            if (pattern.test(input) || 
                (input.startsWith('+243') && digitsOnly.length === 12) ||
                (input.startsWith('0') && digitsOnly.length === 10) ||
                (digitsOnly.length === 9 && !input.startsWith('0') && !input.startsWith('+'))) {
                return 'phone';
            }
        }
        
        return 'invalid';
    }

    showStandaloneManualInput() {
        this.hideAllSections();
        document.getElementById('standalone-manual-input')?.classList.remove('hidden');
        // Focus on input field
        document.getElementById('standalone-manual-input')?.focus();
    }

    async submitStandaloneInput() {
        const standaloneInput = document.getElementById('standalone-manual-input');
        
        const input = standaloneInput?.value.trim() || '';
        
        // Validation
        if (!input) {
            this.showError('Veuillez entrer soit une adresse email soit un numéro de téléphone.');
            return;
        }
        
        // Determine input type using regex
        const inputType = this.detectInputType(input);
        
        if (inputType === 'invalid') {
            this.showError('Veuillez entrer une adresse email ou un numéro de téléphone valide (ex: utilisateur@exemple.com ou +243123456789).');
            return;
        }

        // Hide standalone input and show loading
        this.hideAllSections();
        this.showLoading(true, 'Vérification de l\'inscription...');

        try {
            // Create vCard-like data object
            const vCardData = {
                name: '', // No name from manual input
                email: inputType === 'email' ? input : '',
                phone: inputType === 'phone' ? input : ''
            };

            // Check registration
            const registrationResult = await this.checkRegistration(vCardData);
            
            // Play success sound for manual input too
            this.playSuccessSound();
            
            this.showResult(registrationResult, vCardData);

        } catch (error) {
            console.error('Error processing standalone input:', error);
            this.showError('Erreur lors de la vérification de l\'inscription : ' + error.message);
        }

        this.showLoading(false);
    }

    async onScanSuccess(decodedText) {
        console.log('QR Code scanned:', decodedText);
        
        // Play success sound
        this.playSuccessSound();
        
        // Stop the scanner
        this.stopScanning();

        this.hideSection('scanner-section');
        this.showLoading(true, 'Vérification de l\'inscription...');

        try {
            // Parse vCard data
            const vCardData = this.parseVCard(decodedText);
            
            if (!vCardData.email && !vCardData.phone) {
                throw new Error('Aucun email ou numéro de téléphone trouvé dans le code QR');
            }

            // Check registration
            const registrationResult = await this.checkRegistration(vCardData);
            this.showResult(registrationResult, vCardData);

        } catch (error) {
            console.error('Error processing QR code:', error);
            this.showError('Erreur lors du traitement du code QR : ' + error.message);
        }

        this.showLoading(false);
    }

    onScanFailure(_error) {
        // Ignore scan failures - they're frequent during scanning
        // console.log('Scan failed:', error);
    }

    parseVCard(vCardText) {
        const vCardData = {
            name: '',
            email: '',
            phone: ''
        };

        const lines = vCardText.split('\n');
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.startsWith('FN:')) {
                vCardData.name = trimmedLine.substring(3);
            } else if (trimmedLine.startsWith('EMAIL:') || trimmedLine.includes('EMAIL')) {
                const emailMatch = trimmedLine.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
                if (emailMatch) {
                    vCardData.email = emailMatch[1];
                }
            } else if (trimmedLine.startsWith('TEL:') || trimmedLine.includes('TEL')) {
                const phoneMatch = trimmedLine.match(/[+]?[0-9]+/);
                if (phoneMatch) {
                    vCardData.phone = phoneMatch[0];
                }
            }
        }

        return vCardData;
    }

    async checkRegistration(vCardData) {
        try {
            // API endpoint for checking registration (uses Vite proxy in development)
            const apiUrl = '/api/check-registration';
            
            // Prepare query parameters
            const params = new URLSearchParams();
            if (vCardData.email) {
                params.append('email', vCardData.email);
            }
            if (vCardData.phone) {
                // Normalize phone number for consistent lookup
                params.append('phone', this.normalizePhoneNumber(vCardData.phone));
            }

          const response = await fetch(`${apiUrl}?${params}`);
          console.log('API request URL:', `${apiUrl}?${params}`);
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            return {
                isRegistered: result.isRegistered,
                participantName: result.participant?.name || result.participant?.full_name || '',
                matchedBy: result.matchedBy,
                participantData: result.participant // Include full participant data
            };

        } catch (error) {
            console.error('Error checking registration:', error);
            
            // Check if it's a network error (server not running)
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                throw new Error('Impossible de se connecter à la base de données d\'inscription. Veuillez vous assurer que le serveur fonctionne.');
            }
            
            throw new Error('Échec de la vérification du statut d\'inscription : ' + error.message);
        }
    }

    normalizePhoneNumber(phone) {
        if (!phone) return '';
        
        // Remove all non-digits
        let normalized = phone.replace(/\D/g, '');
        
        // Handle DR Congo phone numbers - convert to local format (0XXXXXXXX)
        if (normalized.startsWith('243') && normalized.length === 12) {
            // 12 digits with country code (243XXXXXXXXX) -> convert to 0XXXXXXXX
            return '0' + normalized.substring(3);
        } else if (normalized.startsWith('243') && normalized.length === 11) {
            // 11 digits with country code (243XXXXXXXX) -> convert to 0XXXXXXXX
            return '0' + normalized.substring(3);
        } else if (normalized.startsWith('0') && normalized.length === 10) {
            // Local format starting with 0 (0XXXXXXXX) - keep as is
            return normalized;
        } else if (normalized.length === 9) {
            // 9 digits without country code or leading 0 -> add 0 prefix
            return '0' + normalized;
        }
        
        // For other formats, try to extract 9 digits and add 0 prefix
        if (normalized.length >= 9) {
            const lastNineDigits = normalized.slice(-9);
            return '0' + lastNineDigits;
        }
        
        return '';
    }

    showResult(result, vCardData) {
        const resultContent = document.getElementById('result-content');

        let content = '';
        
        if (result.isRegistered) {
            content = `
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <svg class="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-green-800">Inscription Confirmée!</h3>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-4 border border-green-200">
                        <p class="text-green-800 text-lg font-semibold">Participant: ${result.participantName}</p>
                        <p class="text-green-600 text-sm mt-1">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Identifié par ${result.matchedBy}
                            </span>
                        </p>
                        
                        <!-- Participant Details -->
                        ${result.participantData ? `
                            <div class="mt-4 pt-4 border-t border-green-100">
                                <div class="grid grid-cols-1 gap-2">
                                    ${result.participantData.email ? `
                                        <div class=" p-0 pb-2">
                                            <div class="flex items-center mb-2">
                                                <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                                <span class="text-green-700 font-semibold text-sm">Email</span>
                                            </div>
                                            <p class=" font-medium">${result.participantData.email}</p>
                                        </div>
                                    ` : ''}
                                    ${result.participantData.contact_number ? `
                                        <div class=" p-0 pb-2">
                                            <div class="flex items-center mb-2">
                                                <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                                </svg>
                                                <span class="text-green-700 font-semibold text-sm">Téléphone</span>
                                            </div>
                                            <p class=" font-medium">${result.participantData.contact_number}</p>
                                        </div>
                                    ` : ''}
                                    ${result.participantData.expertise_domain ? `
                                        <div class=" p-0 pb-2">
                                            <div class="flex items-center mb-2">
                                                <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H10a2 2 0 00-2-2V6m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2"></path>
                                                </svg>
                                                <span class="text-green-700 font-semibold text-sm">Domaine d'Expertise</span>
                                            </div>
                                            <p class=" font-medium">${result.participantData.expertise_domain}</p>
                                        </div>
                                    ` : ''}
                                    ${result.participantData.gender ? `
                                        <div class=" p-0 pb-2">
                                            <div class="flex items-center mb-2">
                                                <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                </svg>
                                                <span class="text-green-700 font-semibold text-sm">Genre</span>
                                            </div>
                                            <p class=" font-medium">${result.participantData.gender}</p>
                                        </div>
                                    ` : ''}
                                    ${result.participantData.objectives ? `
                                        <div class=" p-0 pb-2">
                                            <div class="flex items-center mb-2">
                                                <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span class="text-green-700 font-semibold text-sm">Objectifs</span>
                                            </div>
                                            <p class="text-sm leading-relaxed">${result.participantData.objectives}</p>
                                        </div>
                                    ` : ''}
                                    ${result.participantData.expectations ? `
                                        <div class=" p-0 pb-2">
                                            <div class="flex items-center mb-2">
                                                <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span class="text-green-700 font-semibold text-sm">Attentes</span>
                                            </div>
                                            <p class="text-sm leading-relaxed">${result.participantData.expectations}</p>
                                        </div>
                                    ` : ''}
                                    ${result.participantData.drink_preference ? `
                                        <div class=" p-0 pb-2">
                                            <div class="flex items-center mb-2">
                                                <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                                                </svg>
                                                <span class="text-green-700 font-semibold text-sm">Préférence de Boisson</span>
                                            </div>
                                            <p class=" font-medium">${result.participantData.drink_preference}</p>
                                        </div>
                                    ` : ''}
                                    ${result.participantData.timestamp ? `
                                        <div class=" p-0 pb-2">
                                            <div class="flex items-center mb-2">
                                                <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span class="text-green-700 font-semibold text-sm">Date d'Inscription</span>
                                            </div>
                                            <p class=" font-medium">${result.participantData.timestamp}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        } else {
            content = `
                <div class="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                            <svg class="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-red-800">Non Inscrit</h3>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg p-4 border border-red-200">
                        <p class="text-red-700">L'inscription à l'événement n'a pas été trouvée.</p>
                        <p class="text-red-600 text-sm mt-2">Veuillez contacter les organisateurs de l'événement pour obtenir de l'aide ou essayez de vérifier l'inscription avec une autre méthode.</p>
                    </div>
                </div>
            `;
        }

        // Show scanned data
        content += `
            <div class="mt-4 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                <h4 class="font-bold text-gray-800 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    ${vCardData.name ? 'Informations Scannées' : 'Informations Saisies'}
                </h4>
                <div class="grid grid-cols-1 gap-2">
                    ${vCardData.name ? `
                        <div class="bg-white border border-gray-200 rounded-lg p-2">
                            <div class="flex items-center mb-2">
                                <svg class="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                <span class="text-gray-600 font-semibold text-sm">Nom</span>
                            </div>
                            <p class="text-gray-800 font-medium">${vCardData.name}</p>
                        </div>
                    ` : ''}
                    ${vCardData.email ? `
                        <div class="bg-white border border-gray-200 rounded-lg p-2">
                            <div class="flex items-center mb-2">
                                <svg class="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-gray-600 font-semibold text-sm">Email</span>
                            </div>
                            <p class="text-gray-800 font-medium">${vCardData.email}</p>
                        </div>
                    ` : ''}
                    ${vCardData.phone ? `
                        <div class="bg-white border border-gray-200 rounded-lg p-2">
                            <div class="flex items-center mb-2">
                                <svg class="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <span class="text-gray-600 font-semibold text-sm">Téléphone</span>
                            </div>
                            <p class="text-gray-800 font-medium">${vCardData.phone}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        resultContent.innerHTML = content;
        this.showSection('result-section');
    }

    showError(message) {
        const errorMessage = document.getElementById('error-message');
        
        errorMessage.textContent = message;
        this.showSection('error-section');
    }

    showLoading(show, message = 'Initialisation de la caméra...') {
        const loading = document.getElementById('loading');
        const loadingText = loading.querySelector('p');
        
        if (show) {
            loadingText.textContent = message;
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    showSection(sectionId) {
        this.hideAllSections();
        document.getElementById(sectionId)?.classList.remove('hidden');
    }

    hideSection(sectionId) {
        document.getElementById(sectionId)?.classList.add('hidden');
    }

    hideAllSections() {
        const sections = ['permission-request', 'standalone-manual-input', 'result-section', 'error-section'];
        sections.forEach(sectionId => this.hideSection(sectionId));
    }

    resetScanner() {
        this.stopScanning();
        this.hideManualInput(); // Hide manual input form
        this.hideAllSections();
        
        // Clear standalone input
        const standaloneInput = document.getElementById('standalone-manual-input');
        if (standaloneInput) standaloneInput.value = '';
        
        // Always show the main screen
        this.showInitialScreen();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QRScannerApp();
});

// Register service worker if supported
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('SW registered: ', registration);
        } catch (registrationError) {
            console.log('SW registration failed: ', registrationError);
        }
    });
}
