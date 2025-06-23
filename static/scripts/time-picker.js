// Time Picker JavaScript Functionality

// Store time picker instances
const timePickerInstances = new Map();

// Initialize time picker
function initTimePicker(id, options = {}) {
    const instance = {
        id: id,
        value: options.value || '',
        format24: options.format24 || false,
        showSeconds: options.showSeconds || false,
        minTime: options.minTime || '',
        maxTime: options.maxTime || '',
        tempValue: options.value || ''
    };
    
    timePickerInstances.set(id, instance);
    
    // Parse and set initial values
    setTimeout(() => {
        parseAndSetTime(id, instance.value);
        updateTimeDisplay(id);
    }, 100);
}

// Parse time string and set selectors
function parseAndSetTime(id, timeStr) {
    const instance = timePickerInstances.get(id);
    if (!instance || !timeStr) return;
    
    const hourSelect = document.getElementById(id + '_hour');
    const minuteSelect = document.getElementById(id + '_minute');
    const secondSelect = document.getElementById(id + '_second');
    const periodSelect = document.getElementById(id + '_period');
    
    if (!hourSelect || !minuteSelect) return;
    
    // Parse time string (HH:MM or HH:MM:SS, with optional AM/PM)
    const timePattern = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i;
    const match = timeStr.match(timePattern);
    
    if (match) {
        let hour = parseInt(match[1]);
        const minute = match[2];
        const second = match[3] || '00';
        const period = match[4] || '';
        
        // Convert to 24-hour format if needed
        if (!instance.format24 && period) {
            if (period.toUpperCase() === 'PM' && hour !== 12) {
                hour += 12;
            } else if (period.toUpperCase() === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        
        // Set hour
        if (instance.format24) {
            hourSelect.value = String(hour).padStart(2, '0');
        } else {
            const displayHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
            hourSelect.value = String(displayHour);
            if (periodSelect) {
                periodSelect.value = hour >= 12 ? 'PM' : 'AM';
            }
        }
        
        // Set minute and second
        minuteSelect.value = minute;
        if (secondSelect && instance.showSeconds) {
            secondSelect.value = second;
        }
    }
}

// Update time when selectors change
function updateTime(id) {
    const instance = timePickerInstances.get(id);
    if (!instance) return;
    
    const hourSelect = document.getElementById(id + '_hour');
    const minuteSelect = document.getElementById(id + '_minute');
    const secondSelect = document.getElementById(id + '_second');
    const periodSelect = document.getElementById(id + '_period');
    
    if (!hourSelect || !minuteSelect) return;
    
    const hour = hourSelect.value;
    const minute = minuteSelect.value;
    const second = secondSelect ? secondSelect.value : '';
    const period = periodSelect ? periodSelect.value : '';
    
    if (hour && minute) {
        let timeStr = '';
        
        if (instance.format24) {
            timeStr = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
            if (instance.showSeconds && second) {
                timeStr += `:${second.padStart(2, '0')}`;
            }
        } else {
            timeStr = `${hour}:${minute.padStart(2, '0')}`;
            if (instance.showSeconds && second) {
                timeStr += `:${second.padStart(2, '0')}`;
            }
            if (period) {
                timeStr += ` ${period}`;
            }
        }
        
        instance.tempValue = timeStr;
    }
}

// Select time preset
function selectTimePreset(id, timeStr) {
    const instance = timePickerInstances.get(id);
    if (!instance) return;
    
    // Convert preset to appropriate format
    let convertedTime = timeStr;
    
    if (instance.format24) {
        // Convert AM/PM to 24-hour
        const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (match) {
            let hour = parseInt(match[1]);
            const minute = match[2];
            const period = match[3].toUpperCase();
            
            if (period === 'PM' && hour !== 12) {
                hour += 12;
            } else if (period === 'AM' && hour === 12) {
                hour = 0;
            }
            
            convertedTime = `${String(hour).padStart(2, '0')}:${minute}`;
        }
    }
    
    instance.tempValue = convertedTime;
    parseAndSetTime(id, convertedTime);
}

// Apply selected time
function applyTime(id) {
    const instance = timePickerInstances.get(id);
    if (!instance) return;
    
    instance.value = instance.tempValue;
    
    // Update hidden input
    const hiddenInput = document.getElementById(id + '_input');
    if (hiddenInput) {
        hiddenInput.value = instance.value;
    }
    
    // Update display
    updateTimeDisplay(id);
    
    // Close dropdown
    closeTimePickerDropdown(id);
    
    // Trigger custom event
    const event = new CustomEvent('timechange', {
        detail: {
            time: instance.value,
            id: id
        }
    });
    document.dispatchEvent(event);
}

// Clear time
function clearTime(id) {
    const instance = timePickerInstances.get(id);
    if (!instance) return;
    
    instance.value = '';
    instance.tempValue = '';
    
    // Clear selectors
    const hourSelect = document.getElementById(id + '_hour');
    const minuteSelect = document.getElementById(id + '_minute');
    const secondSelect = document.getElementById(id + '_second');
    const periodSelect = document.getElementById(id + '_period');
    
    if (hourSelect) hourSelect.value = '';
    if (minuteSelect) minuteSelect.value = '';
    if (secondSelect) secondSelect.value = '';
    if (periodSelect) periodSelect.value = 'AM';
    
    // Update hidden input
    const hiddenInput = document.getElementById(id + '_input');
    if (hiddenInput) {
        hiddenInput.value = '';
    }
    
    // Update display
    updateTimeDisplay(id);
}

// Update display text
function updateTimeDisplay(id) {
    const instance = timePickerInstances.get(id);
    if (!instance) return;
    
    const displayElement = document.getElementById(id + '_display');
    if (!displayElement) return;
    
    if (instance.value) {
        displayElement.textContent = instance.value;
    } else {
        const container = displayElement.closest('[data-timepicker]');
        const placeholder = 'Select time';
        displayElement.textContent = placeholder;
    }
}

// Close dropdown
function closeTimePickerDropdown(id) {
    const dropdown = document.querySelector(`[data-timepicker="${id}"] .dropdown-content`);
    if (dropdown) {
        dropdown.blur();
    }
}

// Validate time against min/max constraints
function isTimeValid(timeStr, minTime, maxTime) {
    if (!timeStr) return true;
    
    const timeToMinutes = (time) => {
        const match = time.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
        if (!match) return 0;
        
        let hour = parseInt(match[1]);
        const minute = parseInt(match[2]);
        const period = match[3];
        
        if (period) {
            if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
            if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
        }
        
        return hour * 60 + minute;
    };
    
    const currentMinutes = timeToMinutes(timeStr);
    
    if (minTime) {
        const minMinutes = timeToMinutes(minTime);
        if (currentMinutes < minMinutes) return false;
    }
    
    if (maxTime) {
        const maxMinutes = timeToMinutes(maxTime);
        if (currentMinutes > maxMinutes) return false;
    }
    
    return true;
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.time-picker .dropdown-content');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target) && !dropdown.previousElementSibling.contains(event.target)) {
            dropdown.blur();
        }
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initTimePicker,
        updateTime,
        selectTimePreset,
        clearTime,
        applyTime
    };
} 