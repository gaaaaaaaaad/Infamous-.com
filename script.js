// Modern Enhanced JavaScript for Infamous Website

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Advanced Animation Controller
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => this.handleIntersection(entry));
        }, this.observerOptions);
        
        this.init();
    }
    
    init() {
        this.observeElements();
        this.addScrollAnimations();
        this.addHoverEffects();
    }
    
    observeElements() {
        const elements = $$('.feature-card, .stat-item, .contact-content, .stats, .hero-content, .section-title');
        elements.forEach(el => this.observer.observe(el));
    }
    
    handleIntersection(entry) {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Add appropriate animation class based on element type
            if (element.classList.contains('feature-card')) {
                element.classList.add('fade-in-up');
                element.style.animationDelay = `${Math.random() * 0.5}s`;
            } else if (element.classList.contains('stat-item')) {
                element.classList.add('scale-in');
                this.animateCounter(element);
            } else if (element.classList.contains('stats')) {
                this.animateAllCounters(element);
            } else {
                element.classList.add('fade-in-up');
            }
            
            // Unobserve after animation
            this.observer.unobserve(element);
        }
    }
    
    animateCounter(element) {
        const counter = element.querySelector('.stat-number');
        if (!counter) return;
        
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    animateAllCounters(statsSection) {
        const counters = statsSection.querySelectorAll('.stat-number');
        counters.forEach((counter, index) => {
            setTimeout(() => {
                const target = parseInt(counter.getAttribute('data-target'));
                this.animateCounterValue(counter, target);
            }, index * 200);
        });
    }
    
    animateCounterValue(counter, target) {
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOutCubic);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    addScrollAnimations() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
    }
    
    updateScrollAnimations() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Parallax effect for hero
        const hero = $('.hero');
        if (hero) {
            const heroHeight = hero.offsetHeight;
            const parallaxSpeed = 0.5;
            const yPos = -(scrollY * parallaxSpeed);
            hero.style.transform = `translateY(${yPos}px)`;
        }
        
        // Floating images in hero
        const floatingImages = $$('.floating-image');
        floatingImages.forEach((img, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrollY * speed);
            img.style.transform = `translateY(${yPos}px)`;
        });
        
        // Navbar blur effect
        const navbar = $('.navbar');
        if (navbar) {
            const blurAmount = Math.min(scrollY / 100, 1);
            navbar.style.backdropFilter = `blur(${8 + (blurAmount * 16)}px)`;
        }
    }
    
    addHoverEffects() {
        // Enhanced card hover effects
        const cards = $$('.feature-card, .stat-item, .social-link');
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addFloatingParticles(e.target);
                this.addGlowEffect(e.target);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.removeFloatingParticles(e.target);
                this.removeGlowEffect(e.target);
            });
        });
        
        // Button ripple effect
        const buttons = $$('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e, btn);
            });
        });
    }
    
    addFloatingParticles(element) {
        const particles = [];
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(99, 102, 241, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: floatUp 2s ease-out forwards;
            `;
            
            const rect = element.getBoundingClientRect();
            particle.style.left = `${rect.left + Math.random() * rect.width}px`;
            particle.style.top = `${rect.top + Math.random() * rect.height}px`;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
    }
    
    removeFloatingParticles(element) {
        const particles = $$('.hover-particle');
        particles.forEach(particle => {
            particle.style.animation = 'floatUp 0.5s ease-out forwards';
        });
    }
    
    addGlowEffect(element) {
        element.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.3)';
        element.style.transform = 'translateY(-8px) scale(1.02)';
    }
    
    removeGlowEffect(element) {
        element.style.boxShadow = '';
        element.style.transform = '';
    }
    
    createRippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}
// Navigation Controller
class NavigationController {
    constructor() {
        this.hamburger = $('.hamburger');
        this.navMenu = $('.nav-menu');
        this.navbar = $('.navbar');
        this.navLinks = $$('.nav-link');
        
        this.init();
    }
    
    init() {
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
    }
    
    setupMobileNavigation() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            
            // Close mobile menu when clicking on a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setupSmoothScrolling() {
        const anchorLinks = $$('a[href^="#"]');
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = $(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupScrollEffects() {
        const handleScroll = debounce(() => {
            const scrollY = window.scrollY;
            
            // Navbar scroll effect
            if (this.navbar) {
                if (scrollY > 50) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }
            
            // Active navigation link highlighting
            this.updateActiveNavLink();
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    updateActiveNavLink() {
        const sections = $$('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Form Controller
class FormController {
    constructor() {
        this.contactForm = $('.contact-form form');
        this.init();
    }
    
    init() {
        if (this.contactForm) {
            this.setupFormValidation();
            this.setupFormSubmission();
        }
    }
    
    setupFormValidation() {
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        
        // Basic validation
        if (field.required && !value) {
            this.showFieldError(field, 'This field is required');
            isValid = false;
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const error = document.createElement('div');
        error.className = 'field-error';
        error.textContent = message;
        error.style.cssText = `
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 4px;
            animation: fadeInUp 0.3s ease;
        `;
        
        field.style.borderColor = 'var(--error-color)';
        field.parentNode.appendChild(error);
    }
    
    clearFieldError(field) {
        const error = field.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
        field.style.borderColor = '';
    }
    
    setupFormSubmission() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate all fields
            const inputs = this.contactForm.querySelectorAll('input, textarea');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });
            
            if (isFormValid) {
                this.submitForm();
            }
        });
    }
    
    submitForm() {
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = '✓ Message Sent!';
            submitBtn.style.background = 'var(--success-color)';
            
            // Reset form after success
            setTimeout(() => {
                this.contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
                submitBtn.style.background = '';
            }, 2000);
        }, 1500);
    }
}

// Page Enhancement Controller
class PageEnhancementController {
    constructor() {
        this.init();
    }
    
    init() {
        this.addCustomCSSAnimations();
        this.setupPageTransitions();
        this.addLoadingAnimation();
        this.setupCursorEffects();
    }
    
    addCustomCSSAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                0% { transform: scale(0); opacity: 1; }
                100% { transform: scale(4); opacity: 0; }
            }
            
            @keyframes floatUp {
                0% { transform: translateY(0px); opacity: 1; }
                100% { transform: translateY(-50px); opacity: 0; }
            }
            
            @keyframes particle-float {
                0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
                50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
            }
            
            .hover-particle {
                animation: floatUp 2s ease-out forwards;
            }
            
            .page-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--gradient-primary);
                z-index: 10000;
                transform: translateX(-100%);
                transition: transform 0.5s ease-in-out;
            }
            
            .page-transition.active {
                transform: translateX(0);
            }
            
            .cursor-trail {
                position: fixed;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(99, 102, 241, 0.3);
                pointer-events: none;
                z-index: 9999;
                animation: cursor-fade 1s ease-out forwards;
            }
            
            @keyframes cursor-fade {
                0% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupPageTransitions() {
        const pageLinks = $$('a[href$=".html"]');
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.transitionToPage(link.getAttribute('href'));
            });
        });
    }
    
    transitionToPage(href) {
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
        
        setTimeout(() => {
            transition.classList.add('active');
        }, 50);
        
        setTimeout(() => {
            window.location.href = href;
        }, 600);
    }
    
    addLoadingAnimation() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading Infamous...</div>
            </div>
        `;
        
        const loaderStyle = document.createElement('style');
        loaderStyle.textContent = `
            .page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                transition: opacity 0.5s ease;
            }
            
            .loader-content {
                text-align: center;
            }
            
            .loader-spinner {
                width: 60px;
                height: 60px;
                border: 3px solid var(--border-color);
                border-top: 3px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            .loader-text {
                color: var(--text-primary);
                font-size: 1.2rem;
                font-weight: 600;
                opacity: 0;
                animation: fadeIn 0.5s ease 0.5s forwards;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes fadeIn {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
        `;
        
        document.head.appendChild(loaderStyle);
        document.body.appendChild(loader);
        
        // Remove loader after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.remove();
                    loaderStyle.remove();
                }, 500);
            }, 1000);
        });
    }
    
    setupCursorEffects() {
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Add cursor trail effect
        document.addEventListener('click', (e) => {
            this.createCursorTrail(e.clientX, e.clientY);
        });
    }
    
    createCursorTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${x - 10}px`;
        trail.style.top = `${y - 10}px`;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 1000);
    }
}

// Countdown Timer Controller
class CountdownController {
    constructor() {
        this.endTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
        this.init();
    }
    
    init() {
        this.updateTimer();
        setInterval(() => this.updateTimer(), 1000);
    }
    
    updateTimer() {
        const now = new Date().getTime();
        const distance = this.endTime - now;
        
        if (distance < 0) {
            this.endTime = new Date().getTime() + (24 * 60 * 60 * 1000); // Reset to 24 hours
            return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const hoursEl = $('#hours');
        const minutesEl = $('#minutes');
        const secondsEl = $('#seconds');
        
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
}

// Video Enhancement Controller
class VideoController {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupVideoObserver();
        this.addVideoControls();
    }
    
    setupVideoObserver() {
        const videos = $$('video');
        
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.3 });
        
        videos.forEach(video => {
            videoObserver.observe(video);
        });
    }
    
    addVideoControls() {
        const videos = $$('video');
        videos.forEach(video => {
            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
            
            video.addEventListener('mouseenter', () => {
                video.style.transform = 'scale(1.02)';
            });
            
            video.addEventListener('mouseleave', () => {
                video.style.transform = 'scale(1)';
            });
        });
    }
}

// Sales Enhancement Controller
class SalesController {
    constructor() {
        this.init();
    }
    
    init() {
        this.addUrgencyEffects();
        this.addPriceAnimations();
        this.addSocialProof();
    }
    
    addUrgencyEffects() {
        const offerSection = $('.offer-section');
        if (offerSection) {
            setInterval(() => {
                offerSection.style.animation = 'none';
                setTimeout(() => {
                    offerSection.style.animation = 'urgencyPulse 0.5s ease-in-out';
                }, 10);
            }, 10000);
        }
    }
    
    addPriceAnimations() {
        const prices = $$('.price');
        prices.forEach(price => {
            price.addEventListener('mouseenter', () => {
                price.style.animation = 'priceGlow 0.5s ease-in-out';
            });
            
            price.addEventListener('mouseleave', () => {
                price.style.animation = '';
            });
        });
    }
    
    addSocialProof() {
        const notifications = [
            'John from USA just purchased GTA V Domination!',
            'Sarah from UK just bought the Complete Bundle!',
            'Mike from Canada just got RDR2 Elite!',
            'Alex from Germany just purchased HWID Guardian!',
            'Emma from Australia just bought FiveM Master!'
        ];
        
        setInterval(() => {
            this.showNotification(notifications[Math.floor(Math.random() * notifications.length)]);
        }, 15000);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'social-proof-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🔥</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
}

// Enhanced Animation Controller with Red Theme
class RedThemeAnimationController extends AnimationController {
    constructor() {
        super();
        this.addRedThemeEffects();
    }
    
    addRedThemeEffects() {
        // Add red particle effects
        this.createRedParticles();
        
        // Add red glow to buttons
        const buttons = $$('.btn-primary');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.boxShadow = '0 0 30px rgba(220, 38, 38, 0.6)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.boxShadow = '';
            });
        });
    }
    
    createRedParticles() {
        const particlesContainer = $('.particles');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'red-particle';
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: rgba(220, 38, 38, 0.7);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: redParticleFloat ${4 + Math.random() * 6}s infinite ease-in-out;
                animation-delay: ${Math.random() * 3}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }
}

// Initialize all controllers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
    new NavigationController();
    new FormController();
    new PageEnhancementController();
    new CountdownController();
    new VideoController();
    new SalesController();
    
    // Add custom CSS for new features
    const customStyle = document.createElement('style');
    customStyle.textContent = `
        @keyframes redParticleFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
            50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
        }
        
        @keyframes urgencyPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }
        
        @keyframes priceGlow {
            0%, 100% { text-shadow: 0 0 10px rgba(220, 38, 38, 0.3); }
            50% { text-shadow: 0 0 20px rgba(220, 38, 38, 0.8); }
        }
        
        .social-proof-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--bg-card);
            backdrop-filter: var(--blur-lg);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 16px 20px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 350px;
        }
        
        .social-proof-notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
        
        .notification-text {
            color: var(--text-secondary);
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .hero-video {
            filter: brightness(0.7) contrast(1.2);
        }
        
        .demo-video video {
            border: 2px solid var(--border-color);
        }
        
        .demo-video:hover video {
            border-color: var(--primary-color);
        }
    `;
    document.head.appendChild(customStyle);
    
    // Add a small delay to ensure all elements are ready
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add loaded class to body for CSS animations
const style = document.createElement('style');
style.textContent = `
    .loaded .hero-content {
        animation: fadeInUp 1s ease-out;
    }
    
    .loaded .feature-card {
        animation: fadeInUp 0.8s ease-out;
    }
    
    .loaded .feature-card:nth-child(2) {
        animation-delay: 0.1s;
    }
    
    .loaded .feature-card:nth-child(3) {
        animation-delay: 0.2s;
    }
    
    .loaded .feature-card:nth-child(4) {
        animation-delay: 0.3s;
    }
`;
document.head.appendChild(style);
