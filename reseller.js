// Reseller page JavaScript functionality

// Search functionality
const searchInput = document.getElementById('resellerSearch');
const resellerCards = document.querySelectorAll('.reseller-card');
const regionFilters = document.querySelectorAll('.region-filter');

// Search resellers
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterResellers(searchTerm, getActiveRegion());
});

// Region filtering
regionFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        const region = filter.getAttribute('data-region');
        
        // Update active filter
        regionFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        
        // Filter resellers
        filterResellers(searchInput.value.toLowerCase(), region);
    });
});

function getActiveRegion() {
    const activeFilter = document.querySelector('.region-filter.active');
    return activeFilter ? activeFilter.getAttribute('data-region') : 'all';
}

function filterResellers(searchTerm, region) {
    const resellersGrid = document.querySelector('.resellers-grid');
    let visibleCount = 0;
    
    // Add loading animation
    resellersGrid.style.opacity = '0.5';
    
    setTimeout(() => {
        resellerCards.forEach(card => {
            const name = card.querySelector('.reseller-name').textContent.toLowerCase();
            const regionData = card.getAttribute('data-region');
            const regionText = card.querySelector('.reseller-region').textContent.toLowerCase();
            
            const matchesSearch = name.includes(searchTerm) || regionText.includes(searchTerm);
            const matchesRegion = region === 'all' || regionData === region;
            
            if (matchesSearch && matchesRegion) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                visibleCount++;
                
                // Add entrance animation
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
        
        // Remove loading animation
        resellersGrid.style.opacity = '1';
        
        // Show no results message
        showNoResults(visibleCount);
    }, 300);
}

function showNoResults(count) {
    const resellersGrid = document.querySelector('.resellers-grid');
    const existingNoResults = document.querySelector('.no-results');
    
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    if (count === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <h3>No resellers found</h3>
            <p>Try adjusting your search terms or selecting a different region.</p>
        `;
        resellersGrid.appendChild(noResults);
    }
}

// Reseller application form
const resellerForm = document.querySelector('.reseller-application');
if (resellerForm) {
    resellerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(resellerForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = resellerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Submitting...</span>';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Application Submitted!</span>';
            submitBtn.style.background = '#00ff00';
            
            // Show success message
            showMessage('success', 'Your application has been submitted successfully! We will review it and get back to you within 24 hours.');
            
            // Reset form after delay
            setTimeout(() => {
                resellerForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                
                // Remove success message
                const successMessage = document.querySelector('.success-message');
                if (successMessage) {
                    successMessage.remove();
                }
            }, 5000);
        }, 2000);
    });
}

function validateForm(data) {
    const requiredFields = ['name', 'email', 'company', 'region', 'description'];
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    });
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (errors.length > 0) {
        showMessage('error', errors.join('<br>'));
        return false;
    }
    
    return true;
}

function showMessage(type, message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.innerHTML = message;
    
    const form = document.querySelector('.reseller-application');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove error messages after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Contact reseller functionality
const contactButtons = document.querySelectorAll('.reseller-actions .btn-secondary');
contactButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const resellerCard = button.closest('.reseller-card');
        const resellerName = resellerCard.querySelector('.reseller-name').textContent;
        
        showContactModal(resellerName);
    });
});

function showContactModal(resellerName) {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Contact ${resellerName}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Choose how you'd like to contact ${resellerName}:</p>
                <div class="contact-options">
                    <a href="#" class="contact-option">
                        <img src="assets/discord.png" alt="Discord">
                        <span>Discord</span>
                    </a>
                    <a href="#" class="contact-option">
                        <img src="assets/telegram.png" alt="Telegram">
                        <span>Telegram</span>
                    </a>
                    <a href="#" class="contact-option">
                        <img src="assets/twitter.png" alt="Twitter">
                        <span>Twitter</span>
                    </a>
                </div>
                <div class="contact-info">
                    <p><strong>Business Hours:</strong> 9:00 AM - 11:00 PM (Local Time)</p>
                    <p><strong>Response Time:</strong> Usually within 1-2 hours</p>
                    <p><strong>Languages:</strong> English, and regional languages</p>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .contact-modal {
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
        
        .contact-modal .modal-content {
            background: var(--bg-tertiary);
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            border: 1px solid var(--border-color);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        
        .contact-modal .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 2rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .contact-modal .modal-header h2 {
            color: var(--text-primary);
            margin: 0;
        }
        
        .contact-modal .modal-close {
            background: none;
            border: none;
            font-size: 2rem;
            color: var(--text-secondary);
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .contact-modal .modal-close:hover {
            color: var(--primary-color);
        }
        
        .contact-modal .modal-body {
            padding: 2rem;
        }
        
        .contact-modal .modal-body p {
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }
        
        .contact-options {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .contact-option {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem;
            background: var(--bg-primary);
            border-radius: 10px;
            text-decoration: none;
            color: var(--text-secondary);
            transition: all 0.3s ease;
            border: 1px solid var(--border-color);
        }
        
        .contact-option:hover {
            background: var(--primary-color);
            color: white;
            transform: translateY(-2px);
        }
        
        .contact-option img {
            width: 32px;
            height: 32px;
        }
        
        .contact-info {
            background: var(--bg-primary);
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid var(--border-color);
        }
        
        .contact-info p {
            margin: 0.5rem 0;
            color: var(--text-secondary);
        }
        
        .contact-info strong {
            color: var(--text-primary);
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
    
    // Contact option clicks
    modal.querySelectorAll('.contact-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = option.querySelector('span').textContent;
            alert(`Opening ${platform} to contact ${resellerName}...`);
            closeModal();
        });
    });
}

// Visit store functionality
const visitStoreButtons = document.querySelectorAll('.reseller-actions .btn-primary');
visitStoreButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const href = button.getAttribute('href');
        
        // Only prevent default if there's no href or it's a placeholder
        if (!href || href === '#') {
            e.preventDefault();
            
            const resellerCard = button.closest('.reseller-card');
            const resellerName = resellerCard.querySelector('.reseller-name').textContent;
            
            // Simulate visiting store for placeholder links
            const originalText = button.innerHTML;
            button.innerHTML = '<span>Redirecting...</span>';
            button.disabled = true;
            
            setTimeout(() => {
                alert(`Opening ${resellerName} store...`);
                button.innerHTML = originalText;
                button.disabled = false;
            }, 1500);
        } else {
            // Allow normal link behavior for valid URLs
            // Add visual feedback before navigation
            const originalText = button.innerHTML;
            button.innerHTML = '<span>Opening...</span>';
            
            // Reset button state after a short delay (in case user goes back)
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }
    });
});

// Animate stats on scroll
const stats = document.querySelectorAll('.stat-number');
const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = stat.textContent.replace(/\d+/, target);
                clearInterval(timer);
            } else {
                stat.textContent = stat.textContent.replace(/\d+/, Math.floor(current));
            }
        }, 50);
    });
};

// Initialize stats animation when hero section is visible
const heroSection = document.querySelector('.reseller-hero');
if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(heroSection);
}

// Add entrance animations to reseller cards
const animateCards = () => {
    resellerCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
};

// Initialize card animations
document.addEventListener('DOMContentLoaded', animateCards);

// Sort resellers functionality
const sortSelect = document.createElement('select');
sortSelect.className = 'sort-select';
sortSelect.innerHTML = `
    <option value="name">Sort by Name</option>
    <option value="rating">Sort by Rating</option>
    <option value="region">Sort by Region</option>
`;

// Add sort styles
const sortStyles = document.createElement('style');
sortStyles.textContent = `
    .sort-select {
        margin-left: 1rem;
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        background: var(--bg-tertiary);
        color: var(--text-primary);
        font-size: 0.9rem;
    }
    
    .sort-select:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    @media (max-width: 768px) {
        .sort-select {
            margin-left: 0;
            margin-top: 1rem;
            width: 100%;
        }
    }
`;

document.head.appendChild(sortStyles);
document.querySelector('.search-bar').appendChild(sortSelect);

// Sort functionality
sortSelect.addEventListener('change', (e) => {
    const sortBy = e.target.value;
    sortResellers(sortBy);
});

function sortResellers(sortBy) {
    const resellersGrid = document.querySelector('.resellers-grid');
    const cardsArray = Array.from(resellerCards);
    
    cardsArray.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.querySelector('.reseller-name').textContent.localeCompare(
                    b.querySelector('.reseller-name').textContent
                );
            case 'rating':
                const ratingA = parseFloat(a.querySelector('.rating-text').textContent.match(/[\d.]+/)[0]);
                const ratingB = parseFloat(b.querySelector('.rating-text').textContent.match(/[\d.]+/)[0]);
                return ratingB - ratingA;
            case 'region':
                return a.querySelector('.reseller-region').textContent.localeCompare(
                    b.querySelector('.reseller-region').textContent
                );
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    cardsArray.forEach(card => {
        resellersGrid.appendChild(card);
    });
}
