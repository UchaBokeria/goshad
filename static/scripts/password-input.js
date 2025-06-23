// Password Input JavaScript Functionality

// Store password input instances
const passwordInstances = new Map();

// Initialize password input
function initPasswordInput(id, options = {}) {
    const instance = {
        id: id,
        showToggle: options.showToggle !== false,
        showStrength: options.showStrength || false,
        minLength: options.minLength || 8,
        isVisible: false
    };
    
    passwordInstances.set(id, instance);
    
    // Initialize strength checking if enabled
    if (instance.showStrength) {
        const input = document.getElementById(id);
        if (input && input.value) {
            updatePasswordStrength(id);
        }
    }
}

// Toggle password visibility
function togglePasswordVisibility(id) {
    const instance = passwordInstances.get(id);
    if (!instance) return;
    
    const input = document.getElementById(id);
    const eyeOpen = document.getElementById(id + '_eye_open');
    const eyeClosed = document.getElementById(id + '_eye_closed');
    
    if (!input) return;
    
    instance.isVisible = !instance.isVisible;
    
    if (instance.isVisible) {
        // Show password
        input.type = 'text';
        if (eyeOpen) eyeOpen.classList.remove('hidden');
        if (eyeClosed) eyeClosed.classList.add('hidden');
    } else {
        // Hide password
        input.type = 'password';
        if (eyeOpen) eyeOpen.classList.add('hidden');
        if (eyeClosed) eyeClosed.classList.remove('hidden');
    }
    
    // Keep focus on input
    input.focus();
}

// Update password strength indicator
function updatePasswordStrength(id) {
    const instance = passwordInstances.get(id);
    if (!instance || !instance.showStrength) return;
    
    const input = document.getElementById(id);
    if (!input) return;
    
    const password = input.value;
    const strength = calculatePasswordStrength(password, instance.minLength);
    
    // Update strength bars
    for (let i = 1; i <= 4; i++) {
        const bar = document.getElementById(id + '_strength_' + i);
        if (bar) {
            bar.className = 'h-1 flex-1 rounded ' + getStrengthBarClass(i, strength.score);
        }
    }
    
    // Update strength text
    const textElement = document.getElementById(id + '_strength_text');
    if (textElement) {
        textElement.textContent = strength.text;
        textElement.className = 'text-xs ' + getStrengthTextClass(strength.score);
    }
    
    // Trigger custom event
    const event = new CustomEvent('passwordstrengthchange', {
        detail: {
            strength: strength,
            id: id
        }
    });
    document.dispatchEvent(event);
}

// Calculate password strength
function calculatePasswordStrength(password, minLength = 8) {
    if (!password) {
        return { score: 0, text: 'Enter a password' };
    }
    
    let score = 0;
    const feedback = [];
    
    // Length check
    if (password.length >= minLength) {
        score += 1;
    } else {
        feedback.push(`At least ${minLength} characters`);
    }
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 0.5;
    if (/[A-Z]/.test(password)) score += 0.5;
    if (/[0-9]/.test(password)) score += 0.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 0.5;
    
    // Additional length bonuses
    if (password.length >= 12) score += 0.5;
    if (password.length >= 16) score += 0.5;
    
    // Common patterns penalties
    if (/(.)\1{2,}/.test(password)) score -= 0.5; // Repeated characters
    if (/123|abc|qwe/i.test(password)) score -= 0.5; // Common sequences
    
    // Normalize score to 0-4 range
    score = Math.max(0, Math.min(4, Math.round(score)));
    
    const strengthLevels = [
        'Very Weak',
        'Weak',
        'Fair',
        'Good',
        'Strong'
    ];
    
    let text = strengthLevels[score] || 'Very Weak';
    
    if (feedback.length > 0 && score < 3) {
        text += ' - ' + feedback[0];
    }
    
    return { score, text };
}

// Get CSS class for strength bar
function getStrengthBarClass(barIndex, score) {
    const baseClass = 'transition-colors duration-300';
    
    if (barIndex <= score) {
        switch (score) {
            case 1:
                return baseClass + ' bg-error';
            case 2:
                return baseClass + ' bg-warning';
            case 3:
                return baseClass + ' bg-info';
            case 4:
                return baseClass + ' bg-success';
            default:
                return baseClass + ' bg-base-300';
        }
    }
    
    return baseClass + ' bg-base-300';
}

// Get CSS class for strength text
function getStrengthTextClass(score) {
    switch (score) {
        case 0:
            return 'text-base-content/60';
        case 1:
            return 'text-error';
        case 2:
            return 'text-warning';
        case 3:
            return 'text-info';
        case 4:
            return 'text-success';
        default:
            return 'text-base-content/60';
    }
}

// Generate random password
function generateRandomPassword(length = 12, includeSymbols = true) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = includeSymbols ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';
    
    // Ensure at least one character from each category
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    if (includeSymbols) {
        password += symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Auto-generate password for input
function generatePasswordForInput(id, length = 12, includeSymbols = true) {
    const input = document.getElementById(id);
    if (!input) return;
    
    const password = generateRandomPassword(length, includeSymbols);
    input.value = password;
    
    // Update strength if enabled
    const instance = passwordInstances.get(id);
    if (instance && instance.showStrength) {
        updatePasswordStrength(id);
    }
    
    // Trigger input event
    input.dispatchEvent(new Event('input', { bubbles: true }));
}

// Check password against common passwords list (basic implementation)
function isCommonPassword(password) {
    const commonPasswords = [
        'password', '123456', '123456789', 'qwerty', 'abc123',
        'password123', 'admin', 'letmein', 'welcome', 'monkey',
        'dragon', 'master', 'shadow', 'superman', 'michael'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
}

// Validate password against custom rules
function validatePassword(password, rules = {}) {
    const errors = [];
    
    const {
        minLength = 8,
        requireUppercase = true,
        requireLowercase = true,
        requireNumbers = true,
        requireSymbols = false,
        maxLength = 128,
        disallowCommon = true
    } = rules;
    
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (password.length > maxLength) {
        errors.push(`Password must be no more than ${maxLength} characters long`);
    }
    
    if (requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    
    if (requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    
    if (requireNumbers && !/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    if (requireSymbols && !/[^A-Za-z0-9]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    
    if (disallowCommon && isCommonPassword(password)) {
        errors.push('Password is too common, please choose a different one');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPasswordInput,
        togglePasswordVisibility,
        updatePasswordStrength,
        generateRandomPassword,
        generatePasswordForInput,
        validatePassword
    };
} 