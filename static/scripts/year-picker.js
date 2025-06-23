// Year Picker JavaScript Functionality

// Store year picker instances
const yearPickerInstances = new Map();

// Initialize year picker
function initYearPicker(id, options = {}) {
    const instance = {
        id: id,
        value: options.value || '',
        minYear: options.minYear || 1900,
        maxYear: options.maxYear || new Date().getFullYear() + 10,
        currentRangeStart: options.value ? parseInt(options.value) - 6 : new Date().getFullYear() - 6,
        tempValue: options.value || ''
    };
    
    yearPickerInstances.set(id, instance);
    
    // Initialize display and grid
    setTimeout(() => {
        updateYearGrid(id);
        updateYearDisplay(id);
    }, 100);
}

// Navigate to previous year range
function prevYearRange(id) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    instance.currentRangeStart -= 12;
    
    // Don't go below minimum year
    if (instance.currentRangeStart < instance.minYear) {
        instance.currentRangeStart = instance.minYear;
    }
    
    updateYearGrid(id);
    updateRangeDisplay(id);
}

// Navigate to next year range
function nextYearRange(id) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    instance.currentRangeStart += 12;
    
    // Don't go beyond maximum year
    if (instance.currentRangeStart + 11 > instance.maxYear) {
        instance.currentRangeStart = instance.maxYear - 11;
    }
    
    updateYearGrid(id);
    updateRangeDisplay(id);
}

// Select a year
function selectYear(id, year) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    // Check if year is within allowed range
    if (year < instance.minYear || year > instance.maxYear) {
        return;
    }
    
    instance.tempValue = year.toString();
    updateYearGrid(id);
}

// Select year from preset
function selectYearPreset(id, year) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return;
    
    // Update current range to show the selected year
    instance.currentRangeStart = yearNum - 6;
    
    // Ensure range is within bounds
    if (instance.currentRangeStart < instance.minYear) {
        instance.currentRangeStart = instance.minYear;
    }
    if (instance.currentRangeStart + 11 > instance.maxYear) {
        instance.currentRangeStart = instance.maxYear - 11;
    }
    
    instance.tempValue = year;
    updateYearGrid(id);
    updateRangeDisplay(id);
}

// Apply selected year
function applyYear(id) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    instance.value = instance.tempValue;
    
    // Update hidden input
    const hiddenInput = document.getElementById(id + '_input');
    if (hiddenInput) {
        hiddenInput.value = instance.value;
    }
    
    // Update display
    updateYearDisplay(id);
    
    // Close dropdown
    closeYearPickerDropdown(id);
    
    // Trigger custom event
    const event = new CustomEvent('yearchange', {
        detail: {
            year: instance.value,
            id: id
        }
    });
    document.dispatchEvent(event);
}

// Clear year selection
function clearYear(id) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    instance.value = '';
    instance.tempValue = '';
    
    // Update hidden input
    const hiddenInput = document.getElementById(id + '_input');
    if (hiddenInput) {
        hiddenInput.value = '';
    }
    
    // Update display
    updateYearDisplay(id);
    updateYearGrid(id);
}

// Update year grid display
function updateYearGrid(id) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    const gridContainer = document.getElementById(id + '_grid');
    if (!gridContainer) return;
    
    // Clear existing buttons
    gridContainer.innerHTML = '';
    
    // Create year buttons
    for (let i = 0; i < 12; i++) {
        const year = instance.currentRangeStart + i;
        
        // Skip if year is outside allowed range
        if (year < instance.minYear || year > instance.maxYear) {
            const placeholder = document.createElement('div');
            gridContainer.appendChild(placeholder);
            continue;
        }
        
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = year.toString();
        button.className = getYearButtonClasses(year, instance);
        button.onclick = () => selectYear(id, year);
        
        gridContainer.appendChild(button);
    }
}

// Get CSS classes for year button
function getYearButtonClasses(year, instance) {
    let classes = 'btn btn-ghost btn-sm w-full';
    
    // Highlight selected year
    if (instance.tempValue && parseInt(instance.tempValue) === year) {
        classes += ' btn-primary';
    } else if (instance.value && parseInt(instance.value) === year) {
        classes += ' btn-primary btn-outline';
    }
    
    // Highlight current year
    if (year === new Date().getFullYear()) {
        classes += ' border-2 border-info';
    }
    
    // Disable years outside range
    if (year < instance.minYear || year > instance.maxYear) {
        classes += ' btn-disabled';
    }
    
    return classes;
}

// Update range display header
function updateRangeDisplay(id) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    const rangeElement = document.getElementById(id + '_range');
    if (!rangeElement) return;
    
    const startYear = instance.currentRangeStart;
    const endYear = instance.currentRangeStart + 11;
    rangeElement.textContent = `${startYear} - ${endYear}`;
}

// Update display text
function updateYearDisplay(id) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    const displayElement = document.getElementById(id + '_display');
    if (!displayElement) return;
    
    if (instance.value) {
        displayElement.textContent = instance.value;
    } else {
        const container = displayElement.closest('[data-yearpicker]');
        const placeholder = 'Select year';
        displayElement.textContent = placeholder;
    }
}

// Close dropdown
function closeYearPickerDropdown(id) {
    const dropdown = document.querySelector(`[data-yearpicker="${id}"] .dropdown-content`);
    if (dropdown) {
        dropdown.blur();
    }
}

// Set year value from external source
function setYearValue(id, year) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return;
    
    // Validate year is within bounds
    if (yearNum < instance.minYear || yearNum > instance.maxYear) {
        console.warn(`Year ${yearNum} is outside allowed range ${instance.minYear}-${instance.maxYear}`);
        return;
    }
    
    instance.value = year.toString();
    instance.tempValue = year.toString();
    
    // Update display
    updateYearDisplay(id);
    
    // Update hidden input
    const hiddenInput = document.getElementById(id + '_input');
    if (hiddenInput) {
        hiddenInput.value = year.toString();
    }
    
    // Update grid to show the year
    instance.currentRangeStart = yearNum - 6;
    if (instance.currentRangeStart < instance.minYear) {
        instance.currentRangeStart = instance.minYear;
    }
    if (instance.currentRangeStart + 11 > instance.maxYear) {
        instance.currentRangeStart = instance.maxYear - 11;
    }
    
    updateYearGrid(id);
    updateRangeDisplay(id);
}

// Get current year value
function getYearValue(id) {
    const instance = yearPickerInstances.get(id);
    return instance ? instance.value : '';
}

// Navigate to specific year's range
function goToYear(id, year) {
    const instance = yearPickerInstances.get(id);
    if (!instance) return;
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) return;
    
    instance.currentRangeStart = yearNum - 6;
    
    // Ensure range is within bounds
    if (instance.currentRangeStart < instance.minYear) {
        instance.currentRangeStart = instance.minYear;
    }
    if (instance.currentRangeStart + 11 > instance.maxYear) {
        instance.currentRangeStart = instance.maxYear - 11;
    }
    
    updateYearGrid(id);
    updateRangeDisplay(id);
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.year-picker .dropdown-content');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target) && !dropdown.previousElementSibling.contains(event.target)) {
            dropdown.blur();
        }
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initYearPicker,
        prevYearRange,
        nextYearRange,
        selectYear,
        selectYearPreset,
        clearYear,
        applyYear,
        setYearValue,
        getYearValue,
        goToYear
    };
} 