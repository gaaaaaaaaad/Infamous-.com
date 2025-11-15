// Optimized JavaScript for Infamous Website
// Removed heavy animations, particle effects, and unnecessary features

// Utility Functions
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Throttle function for performance
const throttle = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        if (!timeout) {
            func(...args);
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
        }
    };
};

// Lightweight Animation Controller
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => this.handleIntersection(entry));
        }, this.observerOptions);

        this.init();
    }

    init() {
        this.observeElements();
    }

    observeElements() {
        const elements = $$('.feature-card, .stat-item, .stats, .hero-content, .section-title');
        elements.forEach(el => this.observer.observe(el));
    }

    handleIntersection(entry) {
        if (entry.isIntersecting) {
            const element = entry.target;

            if (element.classList.contains('stat-item')) {
                this.animateCounter(element);
            } else if (element.classList.contains('stats')) {
                this.animateAllCounters(element);
            } else {
                element.classList.add('fade-in-up');
            }

            this.observer.unobserve(element);
        }
    }

    animateCounter(element) {
        const counter = element.querySelector('.stat-number');
        if (!counter) return;

        const targetText = counter.getAttribute('data-target');
        const hasPlus = targetText.includes('+');
        const target = parseInt(targetText);
        const duration = 1500;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);

            counter.textContent = current + (hasPlus ? '+' : '');

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
                const targetText = counter.getAttribute('data-target');
                const hasPlus = targetText.includes('+');
                const target = parseInt(targetText);
                this.animateCounterValue(counter, target, hasPlus);
            }, index * 150);
        });
    }

    animateCounterValue(counter, target, hasPlus = false) {
        const duration = 1500;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * easeOut);

            counter.textContent = current + (hasPlus ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
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

            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });

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
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = $(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollEffects() {
        const handleScroll = throttle(() => {
            const scrollY = window.scrollY;

            if (this.navbar) {
                if (scrollY > 50) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            }

            this.updateActiveNavLink();
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
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

// Countdown Timer Controller
class CountdownController {
    constructor() {
        this.endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
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
            this.endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
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

// Initialize all controllers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
    new NavigationController();

    // Only initialize countdown if timer elements exist
    if ($('#hours')) {
        new CountdownController();
    }

    // Mark page as loaded
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});
