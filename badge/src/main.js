import './main.css'
import QRCode from 'qrcode'
import { animate, stagger } from 'animejs'

// GoTalentApp Class
class GoTalentApp {
    constructor() {
        this.participants = [];
        this.currentParticipant = null;
        this.apiBaseUrl = window.location.origin; // Use current domain for API calls
        this.ribbonWords = [
            "MULTI-GENERATION", "TRANSMISSION", "INSPIRATION", "TRÉSOR", "MENTOR",
            "COACHING", "LEADERSHIP", "POTENTIEL", "COMPÉTENCES",
            "COMMUNICATION", "TRANSFORMATION", "TRAVAIL ACHARNÉ", "TRAVAIL", "BIBLIOTHÈQUE",
            "MINE", "HUMAIN", "HOMME", "ORIENTATION", "FEMME",
            "RH", "RESSOURCES", "RESSOURCES HUMAINES", "CONSTRUCTION", "MOTIVATION",
            "NUMÉRIQUE", "OPTIMISATION", "EXPLORATION", "PRODUCTION", "SYSTÈMES",
            "TECHNOLOGIE", "INFORMATION", "DONNÉES", "INDUSTRIELS", "EXPERTS",
            "EXPERTISE", "SPÉCIALISTE", "INNOVATION", "COLLABORATION", "RÉSEAUTAGE",
            "SUCCÈS", "GO", "TALENT", "ÉQUIPE", "STRATÉGIE",
            "DÉVELOPPEMENT", "OBJECTIFS", "PERFORMANCE", "EFFICACITÉ", "GO-TALENT",
            "MULTI-GÉNÉRATIONNEL", "SAVOIR-FAIRE", "EXPERTISE", "INNOVATION", "COLLABORATION",
            "RÉSEAUTAGE", "SUCCÈS", "GO", "TALENT", "ÉQUIPE",
            "STRATÉGIE", "DÉVELOPPEMENT", "OBJECTIFS", "PERFORMANCE", "EFFICACITÉ",
            "INSPIRATION",
        ]

        this.init();
    }

    async init() {
        try {
            this.updateDebugInfo('Initializing GoTalent App...');
            
            await this.loadParticipantCount();
            this.setupEventListeners();
            this.createTextRibbons();
            this.startHighlighting();
            
            // Ensure login form is shown initially
            this.showLoginForm();
            
            this.updateDebugInfo('GoTalent App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.updateDebugInfo(`Initialization error: ${error.message}`);
        }
    }

    async loadParticipantCount() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/participants/stats/count`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            this.participantCount = data.count;
            this.updateDebugInfo(`Database contains ${this.participantCount} participants`);
        } catch (error) {
            console.error('Error loading participant count:', error);
            this.updateDebugInfo(`Error loading participant count: ${error.message}`);
            this.participantCount = 0;
        }
    }

    async findParticipantByEmail(email) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/participants/email/${encodeURIComponent(email)}`);
            if (!response.ok) {
                if (response.status === 404) {
                    return null; // Participant not found
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const participant = await response.json();
            this.updateDebugInfo(`Found participant: ${participant.name}`);
            return participant;
        } catch (error) {
            console.error('Error finding participant:', error);
            this.updateDebugInfo(`Error finding participant: ${error.message}`);
            return null;
        }
    }

    setupEventListeners() {
        // Wait for next tick to ensure DOM is fully ready
        setTimeout(() => {
            // Login form
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => this.handleLogin(e));
                this.updateDebugInfo('Login form event listener added');
            } else {
                console.warn('Login form not found');
            }

            // Logout button
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.handleLogout());
                this.updateDebugInfo('Logout button event listener added');
            }

            // Card scroll buttons (replacing flip buttons)
            const scrollDownBtn = document.getElementById('scrollDownBtn');
            if (scrollDownBtn) {
                scrollDownBtn.addEventListener('click', () => this.scrollToDetails());
                this.updateDebugInfo('Scroll down button event listener added');
            }

            const scrollUpBtn = document.getElementById('scrollUpBtn');
            if (scrollUpBtn) {
                scrollUpBtn.addEventListener('click', () => this.scrollToTop());
                this.updateDebugInfo('Scroll up button event listener added');
            }

            // Set up scroll listener for sticky header animation
            this.setupScrollListener();

            // Brightness control button
            const brightnessBtnFront = document.getElementById('brightnessBtnFront');
            if (brightnessBtnFront) {
                brightnessBtnFront.addEventListener('click', () => this.maximizeBrightness());
                this.updateDebugInfo('Brightness button event listener added');
            }
        }, 50);
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        
        this.updateDebugInfo(`Attempting login for: ${email}`);
        
        try {
            const participant = await this.findParticipantByEmail(email);

            if (participant) {
                this.currentParticipant = participant;
                this.showIDCard();
                this.displayParticipantInfo();
                this.updateDebugInfo(`Login successful for: ${participant.name}`);
            } else {
                this.showError('Email non trouvé. Veuillez vérifier votre adresse email.');
                this.updateDebugInfo(`Login failed for: ${email}`);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Erreur de connexion. Veuillez réessayer.');
            this.updateDebugInfo(`Login error for ${email}: ${error.message}`);
        }
    }

    handleLogout() {
        this.currentParticipant = null;
        this.showLoginForm();
        this.clearError();
        document.getElementById('email').value = '';
        this.updateDebugInfo('User logged out');
    }

    showLoginForm() {
        const unifiedCard = document.getElementById('unifiedCard');
        const cardLogin = unifiedCard?.querySelector('.card-login');
        const cardFront = unifiedCard?.querySelector('.card-front');
        
        // Animate login card back into view
        if (cardLogin) {
            animate(cardLogin, {
                rotateY: 0,
                opacity: 1,
                duration: 800,
                easing: 'easeInOutExpo'
            });
        }
        
        // Animate ID card out of view
        if (cardFront) {
            animate(cardFront, {
                rotateY: 180,
                opacity: 0,
                duration: 800,
                easing: 'easeInOutExpo'
            });
        }
        
        unifiedCard?.classList.remove('flipped', 'show-back');
    }

    showIDCard() {
        const unifiedCard = document.getElementById('unifiedCard');
        const cardLogin = unifiedCard?.querySelector('.card-login');
        const cardFront = unifiedCard?.querySelector('.card-front');
        
        // Animate login card out of view
        if (cardLogin) {
            animate(cardLogin, {
                rotateY: -180,
                opacity: 0,
                duration: 800,
                easing: 'easeInOutExpo'
            });
        }
        
        // Animate ID card into view
        if (cardFront) {
            animate(cardFront, {
                rotateY: 0,
                opacity: 1,
                duration: 800,
                easing: 'easeInOutExpo',
                delay: 200
            });
        }
        
        unifiedCard?.classList.remove('show-back');
        unifiedCard?.classList.add('flipped');
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    clearError() {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.classList.add('hidden');
    }

    async displayParticipantInfo() {
        if (!this.currentParticipant) return;

        const participant = this.currentParticipant;
        
        // Basic info
        // document.getElementById('participantName').textContent = participant.name;
        document.getElementById('participantEmail').textContent = participant.email;
        document.getElementById('participantContact').textContent = participant.phone || 'N/A';
        
        // Add entrance animations for ID card elements
        const qrSection = document.getElementById('qrSection');
        const contactSection = document.getElementById('contactSection');
        
        if (qrSection) {
            animate(qrSection, {
                scale: [0.5, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutElastic(1, 0.8)',
                delay: 100
            });
        }
        
        if (contactSection) {
            animate(contactSection, {
                translateY: [30, 0],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad',
                delay: 100
            });
        }
        // document.getElementById('participantTimestamp').textContent = 
        //     `Généré le ${new Date(participant.timestamp).toLocaleDateString('fr-FR')}`;

        // Generate QR code
        await this.generateQRCode(participant);

        // Detailed info
        this.displayDetailedInfo(participant);
    }

    async generateQRCode(participant) {
        try {
            // Create properly formatted vCard 3.0
            const vCardData = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:${participant.name}`,
                `N:${participant.name};;;`,
                `EMAIL:${participant.email}`,
                participant.phone ? `TEL:${participant.phone}` : '',
                participant.company ? `ORG:${participant.company}` : '',
                participant.position ? `TITLE:${participant.position}` : '',
                'END:VCARD'
            ].filter(line => line !== '').join('\r\n');

            const qrContainer = document.getElementById('qrcode');
            qrContainer.innerHTML = '';

            const canvas = document.createElement('canvas');
            await QRCode.toCanvas(canvas, vCardData, {
                width: 220,
                margin: 0,
                color: {
                    dark: '#2C1810',
                    light: '#FFF'
                },
                errorCorrectionLevel: 'M'
            });

            qrContainer.appendChild(canvas);
        } catch (error) {
            console.error('Error generating QR code:', error);
            document.getElementById('qrcode').innerHTML = 
                '<div class="text-red-500 text-sm">Erreur QR code</div>';
        }
    }

    displayDetailedInfo(participant) {
        console.log('Displaying detailed info for participant:', participant);
        const detailsContainer = document.getElementById('participantDetails');
        detailsContainer.innerHTML = `
            <div class="space-y-4 text-sm">
                
                <!-- Contact Information Section 
                <div class="space-y-2">
                    <h4 class="font-bold text-base mb-3" style="color: #DAA520;">Informations de Contact</h4>
                    
                    <div class="contact-info">
                        <svg class="contact-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                        </svg>
                        <span style="color: #F3E5AB;">${participant.email}</span>
                    </div>
                    
                    <div class="contact-info">
                        <svg class="contact-icon" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 15.5C18.85 15.5 17.72 15.3 16.65 14.93C16.4 14.82 16.12 14.93 15.97 15.18L14.4 17.35C12.07 16.5 9.5 13.93 8.65 11.6L10.82 10.03C11.07 9.88 11.18 9.6 11.07 9.35C10.7 8.28 10.5 7.15 10.5 6C10.5 5.45 10.05 5 9.5 5H6C5.45 5 5 5.45 5 6C5 13.18 10.82 19 18 19C18.55 19 19 18.55 19 18V14.5C19 13.95 18.55 13.5 18 13.5H20Z"/>
                        </svg>
                        <span style="color: #F3E5AB;">${participant.phone || 'Non spécifié'}</span>
                    </div>
                </div> -->

                <!-- Professional Information Section -->
                <div class="space-y-2 pt-3 border-t border-amber-600">
                    <h4 class="font-bold text-base mb-3" style="color: #DAA520;">Informations Professionnelles</h4>
                    
                    <div class="detail-item">
                        <div class="font-semibold mb-1" style="color: #DAA520;">Domaine d'expertise</div>
                        <div style="color: #F3E5AB;">${participant.company || 'Non spécifié'}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="font-semibold mb-1" style="color: #DAA520;">Position</div>
                        <div style="color: #F3E5AB;">${participant.position || 'Non spécifié'}</div>
                    </div>
                </div>

                <!-- Personal Information Section -->
                <div class="space-y-2 pt-3 border-t border-amber-600">
                    <h4 class="font-bold text-base mb-3" style="color: #DAA520;">Informations Personnelles</h4>
                    
                    <div class="detail-item">
                        <div class="font-semibold mb-1" style="color: #DAA520;">Genre</div>
                        <div style="color: #F3E5AB;">${participant.gender || 'Non spécifié'}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="font-semibold mb-1" style="color: #DAA520;">Comment avez-vous entendu parler de l'événement ?</div>
                        <div style="color: #F3E5AB;">${participant.howHeard || 'Non spécifié'}</div>
                    </div>
                </div>

                <!-- Participation Details Section -->
                <div class="space-y-2 pt-3 border-t border-amber-600">
                    <h4 class="font-bold text-base mb-3" style="color: #DAA520;">Détails de Participation</h4>
                    
                    <div class="detail-item">
                        <div class="font-semibold mb-1" style="color: #DAA520;">Objectifs de participation</div>
                        <div style="color: #F3E5AB; line-height: 1.4;">${participant.objectives || 'Non spécifié'}</div>
                    </div>
                    
                    <div class="detail-item">
                        <div class="font-semibold mb-1" style="color: #DAA520;">Attentes de la conférence</div>
                        <div style="color: #F3E5AB; line-height: 1.4;">${participant.expectations || 'Non spécifié'}</div>
                    </div>
                </div>
                
                <!-- System Information Section -->
                <div class="mt-4 pt-3 border-t border-amber-600">
                    <div class="space-y-1">
                        <div class="text-xs" style="color: #DAA520;">
                            Date d'inscription: ${new Date(participant.registrationDate).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        <div class="text-xs" style="color: #DAA520;">
                            Statut: Participantion confirmé
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    scrollToDetails() {
        const scrollContainer = document.getElementById('cardScrollContainer');
        const detailsSection = document.getElementById('participantDetails');
        
        if (scrollContainer && detailsSection) {
            // Use Anime.js for smooth scroll animation
            animate(scrollContainer, {
                scrollTop: detailsSection.offsetTop - 100,
                duration: 800,
                easing: 'easeInOutQuad'
            });
        }
    }

    scrollToTop() {
        const scrollContainer = document.getElementById('cardScrollContainer');
        
        if (scrollContainer) {
            // Use Anime.js for smooth scroll animation
            animate(scrollContainer, {
                scrollTop: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }

    setupScrollListener() {
        const scrollContainer = document.getElementById('cardScrollContainer');
        const qrSection = document.getElementById('qrSection');
        const contactSection = document.getElementById('contactSection');
        const stickyHeader = scrollContainer?.querySelector('.sticky-header');
        
        if (scrollContainer && qrSection && contactSection && stickyHeader) {
            scrollContainer.addEventListener('scroll', () => {
                const scrollTop = scrollContainer.scrollTop;
                const threshold = 50;
                
                if (scrollTop > threshold) {
                    // Animate QR code out of view
                    animate(qrSection, {
                        scale: 0.1,
                        translateY: -215,
                        opacity: 0,
                        duration: 300,
                        easing: 'easeOutExpo'
                    });
                    
                    // Animate contact section to sticky position
                    animate(contactSection, {
                        translateY: -255,
                        fontSize: '2rem',
                        duration: 200,
                        easing: 'easeOutBounce'
                    });
                    
                    // Animate sticky header compression
                    animate(stickyHeader, {
                        padding: '0.75rem',
                        duration: 300,
                        easing: 'easeOutExpo'
                    });
                    
                    // Add class for additional CSS-based positioning
                    scrollContainer.classList.add('scrolled');
                } else {
                    // Animate QR code back into view
                    animate(qrSection, {
                        scale: 1,
                        translateY: 0,
                        opacity: 1,
                        duration: 300,
                        easing: 'easeOutExpo'
                    });
                    
                    // Animate contact section back to original position
                    animate(contactSection, {
                        translateY: 0,
                        fontSize: '1rem',
                        duration: 300,
                        easing: 'easeOutExpo'
                    });
                    
                    // Animate sticky header back to normal
                    animate(stickyHeader, {
                        padding: '1.5rem',
                        duration: 300,
                        easing: 'easeOutExpo'
                    });
                    
                    // Remove class
                    scrollContainer.classList.remove('scrolled');
                }
            });
        }
    }

    async maximizeBrightness() {
        try {
            // Check if the Screen Wake Lock API is supported
            if ('wakeLock' in navigator) {
                // Request a screen wake lock
                const wakeLock = await navigator.wakeLock.request('screen');
                console.log('Screen wake lock is active');
                
                // Update button text to show it's active
                const brightnessBtn = document.getElementById('brightnessBtnFront');
                const originalText = brightnessBtn.textContent;
                brightnessBtn.textContent = '✅ Wake Lock actif';
                
                // Reset button text after 3 seconds
                setTimeout(() => {
                    brightnessBtn.textContent = originalText;
                }, 3000);
                
                // Listen for when the wake lock is released
                wakeLock.addEventListener('release', () => {
                    console.log('Screen wake lock has been released');
                });
                
                this.updateDebugInfo('Screen wake lock activated');
            } else {
                throw new Error('Wake Lock API not supported');
            }
        } catch (error) {
            console.error('Could not activate screen wake lock:', error);
            
            // Fallback: Try to use older screen brightness API (deprecated)
            try {
                if ('screen' in navigator && 'brightness' in navigator.screen) {
                    await navigator.screen.brightness.request(1.0);
                    this.updateDebugInfo('Screen brightness set to maximum');
                } else {
                    throw new Error('Screen brightness API not supported');
                }
            } catch (brightnessError) {
                console.error('Could not set screen brightness:', brightnessError);
                
                // Final fallback: Show instruction message
                alert('Veuillez augmenter manuellement la luminosité de votre écran dans les paramètres de votre appareil pour une meilleure lecture du QR code.');
                this.updateDebugInfo('Manual brightness adjustment requested');
            }
        }
    }

    createTextRibbons() {
        const container = document.getElementById('textRibbonContainer');
        
        // Calculate the number of ribbons needed to cover the viewport height
        // Since the container is rotated -12deg and has 200vh height, we need more ribbons
        const ribbonHeight = 60;
        const containerHeight = window.innerHeight * 3; // Ensure full coverage even when rotated
        const numRibbons = Math.ceil(containerHeight / ribbonHeight) + 100;

        for (let i = 0; i < numRibbons; i++) {
            const ribbon = document.createElement('div');
            ribbon.className = `text-ribbon color-${(i % 5) + 1}`;
            ribbon.style.top = `${i * ribbonHeight}px`;
            ribbon.style.fontSize = `${1.2 + Math.random() * 0.4}rem`;
            ribbon.style.animationDuration = `${1000 + Math.random() * 40}s`;
            ribbon.style.animationDelay = `${Math.random() * -500}s`;

            const shuffledWords = [...this.ribbonWords].sort(() => Math.random() - 0.5);
            
            ribbon.innerHTML = shuffledWords.map(word => 
                `<span class="ribbon-word">${word}</span>`
            ).join(' • ');

            container.appendChild(ribbon);
        }
    }

    startHighlighting() {
        setInterval(() => {
            const allWords = document.querySelectorAll('.ribbon-word');
            
            // Remove previous highlights with Anime.js animation
            const previousHighlights = document.querySelectorAll('.ribbon-word.highlighted');
            if (previousHighlights.length > 0) {
                animate(previousHighlights, {
                    scale: 1,
                    color: '#8B7355',
                    duration: 300,
                    easing: 'easeOutQuad',
                    complete: () => {
                        previousHighlights.forEach(word => word.classList.remove('highlighted'));
                    }
                });
            }
            
            // Add new highlights with staggered animation
            const numHighlights = 3 + Math.floor(Math.random() * 3);
            const shuffled = Array.from(allWords).sort(() => Math.random() - 0.5);
            const newHighlights = shuffled.slice(0, numHighlights);
            
            if (newHighlights.length > 0) {
                setTimeout(() => {
                    newHighlights.forEach(word => word.classList.add('highlighted'));
                    
                    animate(newHighlights, {
                        scale: [1, 1.3],
                        color: ['#8B7355', '#DAA520'],
                        duration: 500,
                        easing: 'easeOutElastic(1, 0.6)',
                        delay: stagger(100)
                    });
                }, 200);
            }
        }, 2000); // Slower interval for better visual impact
    }

    updateDebugInfo(message = '') {
        const debugInfo = document.getElementById('debugInfo');
        if (debugInfo) {
            const timestamp = new Date().toLocaleTimeString();
            const currentInfo = debugInfo.innerHTML;
            debugInfo.innerHTML = `[${timestamp}] ${message}<br>${currentInfo}`;
            
            // Keep only last 10 lines
            const lines = debugInfo.innerHTML.split('<br>');
            if (lines.length > 10) {
                debugInfo.innerHTML = lines.slice(0, 10).join('<br>');
            }
        } else {
            // Fallback to console if debug element not found
            console.log(`[DEBUG] ${message}`);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit more to ensure all DOM elements are fully rendered
    setTimeout(() => {
        // Check if required DOM elements exist before initializing
        const requiredElements = [
            'unifiedCard',
            'loginForm',
            'textRibbonContainer',
            'debugInfo'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.warn('Missing required DOM elements:', missingElements);
            // Try again after a short delay
            setTimeout(() => {
                new GoTalentApp();
            }, 500);
        } else {
            new GoTalentApp();
        }
    }, 100);
});

// Service worker disabled to avoid caching issues
// PWA functionality removed to ensure fresh content on every load
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
*/
