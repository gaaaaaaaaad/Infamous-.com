// Store-specific JavaScript functionality

// Modern Notification Popup Management
function initNotificationPopup() {
    const popup = document.getElementById('notification-popup');
    const closeBtn = document.getElementById('popup-close');
    const remindBtn = document.getElementById('popup-remind');
    
    console.log('Popup element:', popup);
    console.log('Close button:', closeBtn);
    console.log('Remind button:', remindBtn);
    
    if (!popup || !closeBtn || !remindBtn) {
        console.error('Popup elements not found');
        return;
    }
    
    // Clear any previous dismissal for testing - REMOVE THIS LINE AFTER TESTING
    localStorage.removeItem('notification-dismissed');
    localStorage.removeItem('notification-remind-time');
    
    // Force show popup immediately for testing
    console.log('Force showing popup for testing...');
    popup.style.display = 'block';
    popup.style.opacity = '1';
    popup.style.visibility = 'visible';
    popup.style.zIndex = '9999';
    popup.classList.add('show');
    startPopupCountdown();
    
    // Check if popup was dismissed today or reminder is set
    const today = new Date().toDateString();
    const dismissed = localStorage.getItem('notification-dismissed');
    const remindTime = localStorage.getItem('notification-remind-time');
    
    console.log('Today:', today);
    console.log('Dismissed:', dismissed);
    console.log('Remind time:', remindTime);
    
    if (dismissed === today) {
        console.log('Notification was dismissed today, not showing');
        return;
    }
    
    if (remindTime && Date.now() < parseInt(remindTime)) {
        console.log('Reminder time not reached yet, not showing');
        return;
    }
    
    console.log('Showing notification popup after 3 seconds...');
    
    // Show popup after 3 seconds
    setTimeout(() => {
        console.log('Attempting to show popup');
        popup.style.display = 'block';
        popup.classList.add('show');
        
        // Start countdown timer
        startPopupCountdown();
        
        // Auto-hide after 30 seconds if no interaction
        setTimeout(() => {
            if (popup.classList.contains('show')) {
                console.log('Auto-hiding popup');
                hidePopup();
            }
        }, 30000);
    }, 3000);
    
    // Close popup functionality
    closeBtn.addEventListener('click', () => {
        console.log('Close button clicked');
        dismissPopup();
    });
    
    // Remind me later functionality
    remindBtn.addEventListener('click', () => {
        console.log('Remind later button clicked');
        // Set reminder for 1 hour later
        const remindTime = Date.now() + (60 * 60 * 1000);
        localStorage.setItem('notification-remind-time', remindTime.toString());
        hidePopup();
    });
    
    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            console.log('Clicked outside popup, closing');
            hidePopup();
        }
    });
    
    // Hide popup when clicking the action button
    const actionBtn = popup.querySelector('.popup-btn.primary');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            console.log('Action button clicked');
            dismissPopup();
        });
    }
}

function hidePopup() {
    const popup = document.getElementById('notification-popup');
    if (popup) {
        popup.classList.add('hide');
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
            popup.classList.remove('hide');
        }, 300);
    }
}

function dismissPopup() {
    const today = new Date().toDateString();
    localStorage.setItem('notification-dismissed', today);
    hidePopup();
}

function startPopupCountdown() {
    const hoursEl = document.getElementById('popup-hours');
    const minutesEl = document.getElementById('popup-minutes');
    const secondsEl = document.getElementById('popup-seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;
    
    // Set target time (48 hours from now)
    let targetTime = localStorage.getItem('popup-target-time');
    if (!targetTime) {
        targetTime = Date.now() + (48 * 60 * 60 * 1000);
        localStorage.setItem('popup-target-time', targetTime);
    }
    
    function updateTimer() {
        const now = Date.now();
        const remaining = targetTime - now;
        
        if (remaining <= 0) {
            // Reset timer for next 48 hours
            targetTime = Date.now() + (48 * 60 * 60 * 1000);
            localStorage.setItem('popup-target-time', targetTime);
            return;
        }
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    // Store timer ID to clear it when popup is closed
    window.popupTimer = timer;
}

// Countdown Timer with Toast Integration
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    const toastTimerElement = document.getElementById('toast-timer');
    
    // For main countdown
    if (countdownElement) {
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        let totalSeconds = 47 * 3600 + 59 * 60 + 59; // 47h 59m 59s
        
        const timer = setInterval(() => {
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            if (totalSeconds <= 0) {
                clearInterval(timer);
                // Reset or handle countdown end
                totalSeconds = 47 * 3600 + 59 * 60 + 59;
            }
            
            totalSeconds--;
        }, 1000);
    }
    
    // For toast timer
    if (toastTimerElement) {
        // Set target time (48 hours from now)
        let targetTime = localStorage.getItem('deal-target-time');
        if (!targetTime) {
            targetTime = Date.now() + (48 * 60 * 60 * 1000);
            localStorage.setItem('deal-target-time', targetTime);
        }
        
        function updateToastTimer() {
            const now = Date.now();
            const remaining = targetTime - now;
            
            if (remaining <= 0) {
                // Reset timer for next 48 hours
                targetTime = Date.now() + (48 * 60 * 60 * 1000);
                localStorage.setItem('deal-target-time', targetTime);
                return;
            }
            
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
            
            toastTimerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        updateToastTimer();
        setInterval(updateToastTimer, 1000);
    }
}

// Real-time Purchase Notifications
function showPurchaseNotifications() {
    const notifications = [
        { name: "Alex M.", product: "Master Package", time: "2 minutes ago" },
        { name: "Jordan K.", product: "GTA 5 Enhanced", time: "5 minutes ago" },
        { name: "Sarah L.", product: "RDR2 Full", time: "8 minutes ago" },
        { name: "Mike T.", product: "FiveM Full", time: "12 minutes ago" },
        { name: "Emma R.", product: "Master Package", time: "15 minutes ago" },
        { name: "Chris D.", product: "HWID Spoofer", time: "18 minutes ago" }
    ];
    
    const purchaseElement = document.querySelector('.recent-purchases .purchase-text');
    if (!purchaseElement) return;
    
    let currentIndex = 0;
    
    setInterval(() => {
        const notification = notifications[currentIndex];
        purchaseElement.textContent = `${notification.name} just bought ${notification.product} ${notification.time}`;
        
        currentIndex = (currentIndex + 1) % notifications.length;
    }, 4000);
}

// Animate stats on scroll
function animateStats() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(statNumber => {
                    const finalValue = statNumber.textContent;
                    const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
                    
                    if (numericValue > 0) {
                        animateNumber(statNumber, numericValue, finalValue);
                    }
                });
            }
        });
    }, observerOptions);
    
    const statSections = document.querySelectorAll('.urgency-stats, .testimonials-stats');
    statSections.forEach(section => observer.observe(section));
}

function animateNumber(element, targetValue, originalText) {
    let currentValue = 0;
    const increment = targetValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(currentValue);
        if (originalText.includes('K')) {
            displayValue = (displayValue / 1000).toFixed(1) + 'K';
        } else if (originalText.includes('.')) {
            displayValue = (displayValue / 10).toFixed(1);
        }
        
        element.textContent = displayValue + originalText.replace(/[0-9.K]/g, '');
    }, 50);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing store...');
    initNotificationPopup();
    startCountdown();
    showPurchaseNotifications();
    animateStats();
    initFloatingActionButton();
    console.log('Store initialization complete');
});

// Backup initialization in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing store...');
        initNotificationPopup();
        startCountdown();
        showPurchaseNotifications();
        animateStats();
        initFloatingActionButton();
        console.log('Store initialization complete');
    });
} else {
    console.log('DOM already loaded, initializing store immediately...');
    initNotificationPopup();
    startCountdown();
    showPurchaseNotifications();
    animateStats();
    initFloatingActionButton();
    console.log('Store initialization complete');
}
}

// Floating Action Button
function initFloatingActionButton() {
    const floatingBtn = document.getElementById('floatingBtn');
    if (!floatingBtn) return;
    
    // Hide initially
    floatingBtn.style.display = 'none';
    
    // Show after user scrolls down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            floatingBtn.style.display = 'block';
        } else {
            floatingBtn.style.display = 'none';
        }
    });
    
    // Click handler
    floatingBtn.addEventListener('click', () => {
        // Scroll to Master Package or open purchase link
        const masterPackage = document.querySelector('[data-category="all"]');
        if (masterPackage) {
            masterPackage.scrollIntoView({ behavior: 'smooth' });
            // Add highlight effect
            masterPackage.style.animation = 'none';
            masterPackage.offsetHeight; // Trigger reflow
            masterPackage.style.animation = 'highlight 2s ease-in-out';
        }
    });
}

// Add highlight animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes highlight {
        0%, 100% { transform: scale(1); box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1); }
        50% { transform: scale(1.02); box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3); }
    }
`;
document.head.appendChild(style);

// Category filtering - Initialize immediately and also on window load
function initCategoryFiltering() {
    console.log('Initializing category filtering...');
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    if (categoryTabs.length === 0) {
        console.warn('No category tabs found');
        return false;
    }
    
    console.log('Found', categoryTabs.length, 'category tabs');
    
    categoryTabs.forEach(tab => {
        // Remove any existing event listeners
        tab.removeEventListener('click', handleCategoryClick);
        // Add new event listener
        tab.addEventListener('click', handleCategoryClick);
    });
    
    return true;
}

function handleCategoryClick(event) {
    const tab = event.currentTarget;
    const category = tab.getAttribute('data-category');
    console.log('Category clicked:', category);
    
    // Update active tab
    const allTabs = document.querySelectorAll('.category-tab');
    allTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Filter products
    filterProducts(category);
}

// Try to initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategoryFiltering);
} else {
    initCategoryFiltering();
}

// Also try on window load as backup
window.addEventListener('load', function() {
    if (!initCategoryFiltering()) {
        // If still failing, try again after a short delay
        setTimeout(initCategoryFiltering, 1000);
    }
});

function filterProducts(category) {
    const productsGrid = document.querySelector('.products-grid');
    const productCards = document.querySelectorAll('.product-card'); // Query dynamically
    
    if (!productsGrid || productCards.length === 0) {
        console.warn('Products grid or cards not found');
        return;
    }
    
    console.log('Filtering products for category:', category);
    console.log('Found', productCards.length, 'product cards');
    
    // Add loading state
    productsGrid.style.opacity = '0.5';
    
    setTimeout(() => {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            console.log('Card category:', cardCategory, 'Target category:', category);
            
            if (category === 'all' || cardCategory === category || cardCategory.includes(category)) {
                card.style.display = 'block';
                card.classList.remove('filtered');
                // Trigger animation
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = 'fadeInUp 0.5s ease-in-out';
            } else {
                card.style.display = 'none';
                card.classList.add('filtered');
            }
        });
        
        // Remove loading state
        productsGrid.style.opacity = '1';
        
        // Check if no products found
        checkEmptyState(category);
    }, 300);
}

function checkEmptyState(category) {
    const productCards = document.querySelectorAll('.product-card');
    const productsGrid = document.querySelector('.products-grid');
    
    // Count visible products (not hidden)
    let visibleCount = 0;
    productCards.forEach(card => {
        if (card.style.display !== 'none') {
            visibleCount++;
        }
    });
    
    console.log('Visible products count:', visibleCount);
    
    // Remove existing empty state
    const existingEmptyState = document.querySelector('.products-empty');
    if (existingEmptyState) {
        existingEmptyState.remove();
    }
    
    if (visibleCount === 0 && category !== 'all') {
        const emptyState = document.createElement('div');
        emptyState.className = 'products-empty';
        emptyState.innerHTML = `
            <h3>No products found</h3>
            <p>Sorry, we couldn't find any products in this category.</p>
        `;
        productsGrid.parentNode.insertBefore(emptyState, productsGrid.nextSibling);
    }
}

// Product purchase handling - Direct link redirect (no modals)
const productButtons = document.querySelectorAll('.product-btn:not([disabled])');

productButtons.forEach(button => {
    // Remove the click event listener that prevents default behavior
    // Let the natural link behavior work (target="_blank" will open in new tab)
    button.addEventListener('click', (e) => {
        // Add a small loading animation
        const originalText = button.innerHTML;
        button.innerHTML = '<span>Loading...</span>';
        
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 1000);
        
        // Let the natural link behavior continue (don't prevent default)
    });
});

// Search functionality
const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.placeholder = 'Search products...';
searchInput.className = 'product-search';

// Add search input to categories section
const categoriesSection = document.querySelector('.categories .container');
const searchContainer = document.createElement('div');
searchContainer.className = 'search-container';
searchContainer.appendChild(searchInput);
categoriesSection.appendChild(searchContainer);

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const description = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.classList.remove('filtered');
        } else {
            card.style.display = 'none';
            card.classList.add('filtered');
        }
    });
    
    // Reset category filter if searching
    if (searchTerm) {
        categoryTabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector('.category-tab[data-category="all"]').classList.add('active');
    }
});

// Add search styles
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-container {
        text-align: center;
        margin-top: 2rem;
    }
    
    .product-search {
        width: 100%;
        max-width: 400px;
        padding: 1rem 1.5rem;
        border: 2px solid var(--border-color);
        border-radius: 50px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        font-size: 1rem;
        transition: all 0.3s ease;
    }
    
    .product-search:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
    }
    
    .product-search::placeholder {
        color: var(--text-muted);
    }
    
    @media (max-width: 768px) {
        .product-search {
            width: 90%;
        }
    }
`;

document.head.appendChild(searchStyles);

// Product card hover effects
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animations
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Initialize category filtering
    filterProducts('all');
});

// Add smooth scrolling to store sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation when switching categories
function addLoadingAnimation() {
    const grid = document.querySelector('.products-grid');
    grid.style.transition = 'opacity 0.3s ease';
}

addLoadingAnimation();

// Manual function to force show popup (for testing)
function forceShowPopup() {
    const popup = document.getElementById('notification-popup');
    if (popup) {
        localStorage.removeItem('notification-dismissed');
        localStorage.removeItem('notification-remind-time');
        popup.style.display = 'block';
        popup.style.opacity = '1';
        popup.style.visibility = 'visible';
        popup.style.zIndex = '9999';
        popup.classList.add('show');
        startPopupCountdown();
        console.log('Popup forced to show');
    } else {
        console.error('Popup element not found!');
    }
}

// Make function available globally for testing
window.forceShowPopup = forceShowPopup;

// Fallback function to ensure popup shows
function ensurePopupShows() {
    setTimeout(() => {
        const popup = document.getElementById('notification-popup');
        if (popup) {
            console.log('Fallback: Ensuring popup shows');
            popup.style.display = 'flex';
            popup.style.opacity = '1';
            popup.style.visibility = 'visible';
            startPopupCountdown();
        }
    }, 5000);
}

// Call the fallback and force show for testing
ensurePopupShows();
// forceShowPopup(); // Uncomment to force show immediately

// Countdown Timer for Offer Banner
function startCountdown() {
    let timeLeft = 72 * 60 * 60; // 72 hours in seconds
    const countdownElement = document.getElementById('countdown');
    
    if (!countdownElement) return;
    
    function updateCountdown() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        countdownElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft > 0) {
            timeLeft--;
        } else {
            timeLeft = 72 * 60 * 60; // Reset to 72 hours
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Debug function to test category filtering manually
window.testCategoryFilter = function() {
    console.log('=== Testing Category Filter ===');
    
    const tabs = document.querySelectorAll('.category-tab');
    const cards = document.querySelectorAll('.product-card');
    
    console.log('Category tabs found:', tabs.length);
    console.log('Product cards found:', cards.length);
    
    tabs.forEach((tab, index) => {
        console.log(`Tab ${index}:`, tab.getAttribute('data-category'), tab.textContent.trim());
    });
    
    cards.forEach((card, index) => {
        console.log(`Card ${index}:`, card.getAttribute('data-category'), card.querySelector('.product-title')?.textContent.trim());
    });
    
    // Test clicking GTA V tab
    const gtaTab = document.querySelector('[data-category="gta5"]');
    if (gtaTab) {
        console.log('Simulating click on GTA V tab...');
        gtaTab.click();
    }
};

// Auto-run test after a delay
setTimeout(() => {
    console.log('Auto-running category filter test...');
    if (window.testCategoryFilter) {
        window.testCategoryFilter();
    }
}, 2000);
