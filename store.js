// Store-specific JavaScript functionality

// Urgency Toast Management
function initUrgencyToast() {
    const toast = document.getElementById('urgency-toast');
    const closeBtn = document.getElementById('toast-close');
    
    if (!toast || !closeBtn) return;
    
    // Check if toast was dismissed today
    const today = new Date().toDateString();
    const dismissed = localStorage.getItem('urgency-toast-dismissed');
    
    if (dismissed === today) {
        return; // Don't show if dismissed today
    }
    
    // Show toast after 3 seconds
    setTimeout(() => {
        toast.style.display = 'block';
        
        // Auto-hide after 12 seconds
        setTimeout(() => {
            hideToast();
        }, 12000);
    }, 3000);
    
    // Close toast functionality
    closeBtn.addEventListener('click', () => {
        dismissToast();
    });
    
    // Hide toast when clicking the action button
    const actionBtn = toast.querySelector('.toast-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            dismissToast();
        });
    }
}

function hideToast() {
    const toast = document.getElementById('urgency-toast');
    if (toast) {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }
}

function dismissToast() {
    const today = new Date().toDateString();
    localStorage.setItem('urgency-toast-dismissed', today);
    hideToast();
}
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
    initUrgencyToast();
    startCountdown();
    showPurchaseNotifications();
    animateStats();
    initFloatingActionButton();
});

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

// Category filtering
const categoryTabs = document.querySelectorAll('.category-tab');
const productCards = document.querySelectorAll('.product-card');

categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const category = tab.getAttribute('data-category');
        
        // Update active tab
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Filter products
        filterProducts(category);
    });
});

function filterProducts(category) {
    const productsGrid = document.querySelector('.products-grid');
    
    // Add loading state
    productsGrid.style.opacity = '0.5';
    
    setTimeout(() => {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.classList.remove('filtered');
                // Trigger animation
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = 'fadeIn 0.5s ease-in-out';
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
    const visibleProducts = document.querySelectorAll('.product-card:not(.filtered)');
    const productsGrid = document.querySelector('.products-grid');
    
    // Remove existing empty state
    const existingEmptyState = document.querySelector('.products-empty');
    if (existingEmptyState) {
        existingEmptyState.remove();
    }
    
    if (visibleProducts.length === 0) {
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
