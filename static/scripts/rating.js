// Rating Component JavaScript Functionality

// Store rating instances
const ratingInstances = new Map();

// Initialize rating component
function initRating(id, options = {}) {
    const instance = {
        id: id,
        maxRating: options.maxRating || 5,
        allowHalf: options.allowHalf || false,
        currentValue: parseFloat(options.currentValue) || 0,
        tempValue: 0,
        onChange: options.onChange || null
    };
    
    ratingInstances.set(id, instance);
    
    // Set initial state
    setTimeout(() => {
        updateRatingDisplay(id, instance.currentValue);
    }, 100);
}

// Set rating value
function setRating(id, value) {
    const instance = ratingInstances.get(id);
    if (!instance) return;
    
    // Handle half ratings if enabled
    if (instance.allowHalf) {
        const currentIcon = document.querySelector(`[data-rating="${id}"] [data-rating-value="${value}"]`);
        if (currentIcon) {
            const rect = currentIcon.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const iconWidth = rect.width;
            
            // If clicked on left half, use half rating
            if (clickX < iconWidth / 2) {
                value = value - 0.5;
            }
        }
    }
    
    instance.currentValue = value;
    instance.tempValue = value;
    
    // Update hidden input
    const hiddenInput = document.getElementById(id + '_input');
    if (hiddenInput) {
        hiddenInput.value = value.toString();
    }
    
    // Update value display
    const valueDisplay = document.getElementById(id + '_value');
    if (valueDisplay) {
        valueDisplay.textContent = value.toFixed(1);
    }
    
    // Update visual display
    updateRatingDisplay(id, value);
    
    // Trigger callback
    if (instance.onChange) {
        try {
            if (typeof window[instance.onChange] === 'function') {
                window[instance.onChange](value, id);
            }
        } catch (e) {
            console.warn('Rating onChange callback error:', e);
        }
    }
    
    // Trigger custom event
    const event = new CustomEvent('ratingchange', {
        detail: {
            rating: value,
            id: id
        }
    });
    document.dispatchEvent(event);
}

// Handle hover effects
function hoverRating(id, value) {
    const instance = ratingInstances.get(id);
    if (!instance) return;
    
    instance.tempValue = value;
    updateRatingDisplay(id, value, true);
}

// Remove hover effects
function unhoverRating(id) {
    const instance = ratingInstances.get(id);
    if (!instance) return;
    
    updateRatingDisplay(id, instance.currentValue);
}

// Update visual display of rating
function updateRatingDisplay(id, value, isHover = false) {
    const instance = ratingInstances.get(id);
    if (!instance) return;
    
    const container = document.querySelector(`[data-rating="${id}"]`);
    if (!container) return;
    
    const icons = container.querySelectorAll('[data-rating-value]');
    
    icons.forEach((icon, index) => {
        const iconValue = parseInt(icon.getAttribute('data-rating-value'));
        const svg = icon.querySelector('svg');
        
        if (!svg) return;
        
        // Reset classes
        svg.className = svg.className.replace(/text-\S+/g, '');
        
        // Determine fill state
        let shouldFill = false;
        let shouldHalfFill = false;
        
        if (iconValue <= value) {
            shouldFill = true;
        } else if (instance.allowHalf && iconValue - 0.5 <= value) {
            shouldHalfFill = true;
        }
        
        // Apply appropriate styling
        if (shouldFill) {
            if (isHover) {
                svg.classList.add('text-warning', 'opacity-80');
            } else {
                svg.classList.add('text-warning');
            }
        } else if (shouldHalfFill) {
            svg.classList.add('text-warning', 'opacity-50');
        } else {
            svg.classList.add('text-base-300');
        }
        
        // Add hover effect classes
        if (isHover && iconValue <= value) {
            svg.classList.add('scale-110');
        } else {
            svg.classList.remove('scale-110');
        }
    });
}

// Clear rating
function clearRating(id) {
    const instance = ratingInstances.get(id);
    if (!instance) return;
    
    setRating(id, 0);
}

// Set rating from external call (useful for form pre-filling)
function setRatingValue(id, value) {
    const instance = ratingInstances.get(id);
    if (!instance) return;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    // Validate value is within bounds
    const clampedValue = Math.max(0, Math.min(instance.maxRating, numValue));
    
    setRating(id, clampedValue);
}

// Get current rating value
function getRatingValue(id) {
    const instance = ratingInstances.get(id);
    return instance ? instance.currentValue : 0;
}

// Enable/disable rating
function setRatingEnabled(id, enabled) {
    const instance = ratingInstances.get(id);
    if (!instance) return;
    
    const container = document.querySelector(`[data-rating="${id}"]`);
    if (!container) return;
    
    const icons = container.querySelectorAll('[data-rating-value]');
    
    icons.forEach(icon => {
        if (enabled) {
            icon.style.pointerEvents = 'auto';
            icon.style.opacity = '1';
        } else {
            icon.style.pointerEvents = 'none';
            icon.style.opacity = '0.5';
        }
    });
}

// Update rating with animation
function animateRatingChange(id, newValue, duration = 300) {
    const instance = ratingInstances.get(id);
    if (!instance) return;
    
    const startValue = instance.currentValue;
    const diff = newValue - startValue;
    const stepTime = 50; // ms
    const steps = duration / stepTime;
    const stepValue = diff / steps;
    
    let currentStep = 0;
    
    const animate = () => {
        if (currentStep >= steps) {
            setRating(id, newValue);
            return;
        }
        
        const intermediateValue = startValue + (stepValue * currentStep);
        updateRatingDisplay(id, intermediateValue);
        
        currentStep++;
        setTimeout(animate, stepTime);
    };
    
    animate();
}

// Handle keyboard navigation
function handleRatingKeyboard(id, event) {
    const instance = ratingInstances.get(id);
    if (!instance) return;
    
    let newValue = instance.currentValue;
    
    switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
            event.preventDefault();
            newValue = Math.min(instance.maxRating, newValue + (instance.allowHalf ? 0.5 : 1));
            setRating(id, newValue);
            break;
            
        case 'ArrowLeft':
        case 'ArrowDown':
            event.preventDefault();
            newValue = Math.max(0, newValue - (instance.allowHalf ? 0.5 : 1));
            setRating(id, newValue);
            break;
            
        case 'Home':
            event.preventDefault();
            setRating(id, instance.allowHalf ? 0.5 : 1);
            break;
            
        case 'End':
            event.preventDefault();
            setRating(id, instance.maxRating);
            break;
            
        case 'Delete':
        case 'Backspace':
            event.preventDefault();
            setRating(id, 0);
            break;
    }
}

// Add keyboard support to rating component
function addRatingKeyboardSupport(id) {
    const container = document.querySelector(`[data-rating="${id}"]`);
    if (!container) return;
    
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'slider');
    container.setAttribute('aria-valuemin', '0');
    
    const instance = ratingInstances.get(id);
    if (instance) {
        container.setAttribute('aria-valuemax', instance.maxRating.toString());
        container.setAttribute('aria-valuenow', instance.currentValue.toString());
    }
    
    container.addEventListener('keydown', (event) => {
        handleRatingKeyboard(id, event);
    });
    
    // Update aria-valuenow when rating changes
    document.addEventListener('ratingchange', (event) => {
        if (event.detail.id === id) {
            container.setAttribute('aria-valuenow', event.detail.rating.toString());
        }
    });
}

// Batch update multiple ratings (useful for forms)
function setMultipleRatings(ratings) {
    ratings.forEach(({ id, value }) => {
        setRatingValue(id, value);
    });
}

// Get average rating from multiple rating components
function getAverageRating(ids) {
    const values = ids.map(id => getRatingValue(id)).filter(val => val > 0);
    if (values.length === 0) return 0;
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initRating,
        setRating,
        hoverRating,
        unhoverRating,
        clearRating,
        setRatingValue,
        getRatingValue,
        setRatingEnabled,
        animateRatingChange,
        addRatingKeyboardSupport,
        setMultipleRatings,
        getAverageRating
    };
} 