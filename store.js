// Store-specific JavaScript functionality

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

// Product purchase handling
const productButtons = document.querySelectorAll('.product-btn:not([disabled])');

productButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productCard = button.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.price-current').textContent;
        
        // Show purchase modal or redirect
        showPurchaseModal(productTitle, productPrice);
    });
});

function showPurchaseModal(title, price) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Purchase ${title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="product-summary">
                    <h3>${title}</h3>
                    <p class="modal-price">Price: ${price}/month</p>
                </div>
                <div class="purchase-form">
                    <h4>Contact Information</h4>
                    <form>
                        <div class="form-group">
                            <label>Discord Username</label>
                            <input type="text" placeholder="YourUsername#1234" required>
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" placeholder="your@email.com" required>
                        </div>
                        <div class="form-group">
                            <label>Payment Method</label>
                            <select required>
                                <option value="">Select payment method</option>
                                <option value="paypal">PayPal</option>
                                <option value="crypto">Cryptocurrency</option>
                                <option value="card">Credit Card</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            <span>Proceed to Payment</span>
                            <i class="arrow">→</i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .purchase-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: var(--bg-tertiary);
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid var(--border-color);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h2 {
            color: var(--text-primary);
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--text-secondary);
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .modal-close:hover {
            color: var(--primary-color);
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .product-summary {
            margin-bottom: 2rem;
            padding: 1rem;
            background: var(--bg-primary);
            border-radius: 10px;
            border: 1px solid var(--border-color);
        }
        
        .product-summary h3 {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .modal-price {
            color: var(--primary-color);
            font-weight: 600;
            font-size: 1.2rem;
        }
        
        .purchase-form h4 {
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .purchase-form .form-group {
            margin-bottom: 1rem;
        }
        
        .purchase-form label {
            display: block;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }
        
        .purchase-form input,
        .purchase-form select {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-family: inherit;
        }
        
        .purchase-form input:focus,
        .purchase-form select:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .purchase-form button {
            width: 100%;
            margin-top: 1rem;
        }
    `;
    
    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeModal = () => {
        modal.remove();
        modalStyles.remove();
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Form submission
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Processing...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Redirecting to Payment...</span>';
            
            setTimeout(() => {
                // Here you would typically redirect to payment processor
                alert('Thank you! You will be redirected to payment processing.');
                closeModal();
            }, 1500);
        }, 2000);
    });
}

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
