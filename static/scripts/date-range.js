// Date Range Picker JavaScript Functionality

// Store date range instances
const dateRangeInstances = new Map();

// Initialize date range picker
function initDateRange(id, options = {}) {
    const instance = {
        id: id,
        startDate: options.startDate || '',
        endDate: options.endDate || '',
        minDate: options.minDate || '',
        maxDate: options.maxDate || '',
        format: options.format || 'MMM dd, yyyy',
        currentMonth: new Date(),
        isSelectingStart: true,
        tempStartDate: '',
        tempEndDate: ''
    };
    
    dateRangeInstances.set(id, instance);
    
    // Initialize calendars
    setTimeout(() => {
        renderCalendar(id + '_start_cal', instance);
        renderCalendar(id + '_end_cal', instance);
        updateDisplay(id);
    }, 100);
}

// Render calendar for a specific month
function renderCalendar(calendarId, instance) {
    const calendar = document.getElementById(calendarId);
    if (!calendar) return;
    
    const daysContainer = calendar.querySelector(`#${calendarId}_days`);
    const headerElement = calendar.querySelector(`#${calendarId}_header`);
    
    if (!daysContainer || !headerElement) return;
    
    const isStartCalendar = calendarId.includes('_start_cal');
    const currentMonth = new Date(instance.currentMonth);
    
    // Adjust month for end calendar (show next month)
    if (!isStartCalendar) {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    
    // Update header
    headerElement.textContent = currentMonth.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    // Clear existing days
    daysContainer.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'p-1';
        daysContainer.appendChild(emptyCell);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayButton = document.createElement('button');
        dayButton.type = 'button';
        dayButton.className = 'btn btn-ghost btn-xs w-full h-8 p-0 min-h-0';
        dayButton.textContent = day;
        
        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateString = formatDateToISO(currentDate);
        
        // Add click handler
        dayButton.onclick = () => selectDate(instance.id, dateString, isStartCalendar);
        
        // Style selected dates
        if (dateString === instance.startDate || dateString === instance.tempStartDate) {
            dayButton.classList.add('btn-primary');
        } else if (dateString === instance.endDate || dateString === instance.tempEndDate) {
            dayButton.classList.add('btn-secondary');
        } else if (isDateInRange(dateString, instance)) {
            dayButton.classList.add('btn-accent', 'btn-outline');
        }
        
        // Disable dates outside min/max range
        if (isDateDisabled(dateString, instance)) {
            dayButton.disabled = true;
            dayButton.classList.add('btn-disabled');
        }
        
        // Highlight today
        if (dateString === formatDateToISO(new Date())) {
            dayButton.classList.add('border-2', 'border-info');
        }
        
        daysContainer.appendChild(dayButton);
    }
}

// Select a date
function selectDate(id, dateString, isStartCalendar) {
    const instance = dateRangeInstances.get(id);
    if (!instance) return;
    
    if (instance.isSelectingStart || isStartCalendar) {
        instance.tempStartDate = dateString;
        instance.tempEndDate = '';
        instance.isSelectingStart = false;
    } else {
        // If selecting end date and it's before start date, swap them
        if (new Date(dateString) < new Date(instance.tempStartDate)) {
            instance.tempEndDate = instance.tempStartDate;
            instance.tempStartDate = dateString;
        } else {
            instance.tempEndDate = dateString;
        }
        instance.isSelectingStart = true;
    }
    
    // Re-render both calendars to update styling
    renderCalendar(id + '_start_cal', instance);
    renderCalendar(id + '_end_cal', instance);
}

// Navigate calendar months
function prevMonth(calendarId) {
    const id = calendarId.replace('_start_cal', '').replace('_end_cal', '');
    const instance = dateRangeInstances.get(id);
    if (!instance) return;
    
    instance.currentMonth.setMonth(instance.currentMonth.getMonth() - 1);
    renderCalendar(id + '_start_cal', instance);
    renderCalendar(id + '_end_cal', instance);
}

function nextMonth(calendarId) {
    const id = calendarId.replace('_start_cal', '').replace('_end_cal', '');
    const instance = dateRangeInstances.get(id);
    if (!instance) return;
    
    instance.currentMonth.setMonth(instance.currentMonth.getMonth() + 1);
    renderCalendar(id + '_start_cal', instance);
    renderCalendar(id + '_end_cal', instance);
}

// Select date preset
function selectDatePreset(id, presetLabel) {
    const instance = dateRangeInstances.get(id);
    if (!instance) return;
    
    const today = new Date();
    let startDate, endDate;
    
    switch (presetLabel) {
        case 'Today':
            startDate = endDate = new Date(today);
            break;
        case 'Yesterday':
            startDate = endDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'Last 7 days':
            endDate = new Date(today);
            startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
            break;
        case 'Last 30 days':
            endDate = new Date(today);
            startDate = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
            break;
        case 'This month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            break;
        case 'Last month':
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'This year':
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = new Date(today.getFullYear(), 11, 31);
            break;
        default:
            return;
    }
    
    instance.tempStartDate = formatDateToISO(startDate);
    instance.tempEndDate = formatDateToISO(endDate);
    
    // Update calendar view to show the selected month
    instance.currentMonth = new Date(startDate);
    
    renderCalendar(id + '_start_cal', instance);
    renderCalendar(id + '_end_cal', instance);
}

// Apply selected date range
function applyDateRange(id) {
    const instance = dateRangeInstances.get(id);
    if (!instance) return;
    
    // Apply temporary dates to actual dates
    instance.startDate = instance.tempStartDate;
    instance.endDate = instance.tempEndDate;
    
    // Update hidden inputs
    const startInput = document.getElementById(id + '_start');
    const endInput = document.getElementById(id + '_end');
    
    if (startInput) startInput.value = instance.startDate;
    if (endInput) endInput.value = instance.endDate;
    
    // Update display
    updateDisplay(id);
    
    // Close dropdown
    const dropdown = document.querySelector(`[data-daterange="${id}"] .dropdown`);
    if (dropdown) {
        const content = dropdown.querySelector('.dropdown-content');
        if (content) content.blur();
    }
    
    // Trigger custom event
    const event = new CustomEvent('daterangechange', {
        detail: {
            startDate: instance.startDate,
            endDate: instance.endDate,
            id: id
        }
    });
    document.dispatchEvent(event);
}

// Clear date range
function clearDateRange(id) {
    const instance = dateRangeInstances.get(id);
    if (!instance) return;
    
    instance.startDate = '';
    instance.endDate = '';
    instance.tempStartDate = '';
    instance.tempEndDate = '';
    instance.isSelectingStart = true;
    
    // Clear hidden inputs
    const startInput = document.getElementById(id + '_start');
    const endInput = document.getElementById(id + '_end');
    
    if (startInput) startInput.value = '';
    if (endInput) endInput.value = '';
    
    // Update display
    updateDisplay(id);
    
    // Re-render calendars
    renderCalendar(id + '_start_cal', instance);
    renderCalendar(id + '_end_cal', instance);
}

// Update display text
function updateDisplay(id) {
    const instance = dateRangeInstances.get(id);
    if (!instance) return;
    
    const displayElement = document.getElementById(id + '_display');
    if (!displayElement) return;
    
    if (instance.startDate && instance.endDate) {
        const startDate = new Date(instance.startDate);
        const endDate = new Date(instance.endDate);
        const formattedRange = formatDisplayDate(startDate, instance.format) + 
                             ' - ' + 
                             formatDisplayDate(endDate, instance.format);
        displayElement.textContent = formattedRange;
    } else {
        const container = displayElement.closest('[data-daterange]');
        const placeholder = container?.querySelector('input')?.placeholder || 'Select date range';
        displayElement.textContent = placeholder;
    }
}

// Helper functions
function formatDateToISO(date) {
    return date.getFullYear() + '-' + 
           String(date.getMonth() + 1).padStart(2, '0') + '-' + 
           String(date.getDate()).padStart(2, '0');
}

function formatDisplayDate(date, format) {
    const options = {};
    
    if (format.includes('Monday')) {
        options.weekday = 'long';
    }
    
    if (format.includes('Jan')) {
        options.month = 'short';
    } else if (format.includes('January')) {
        options.month = 'long';
    } else if (format.includes('01')) {
        options.month = '2-digit';
    }
    
    if (format.includes('02')) {
        options.day = '2-digit';
    } else {
        options.day = 'numeric';
    }
    
    if (format.includes('2006')) {
        options.year = 'numeric';
    }
    
    return date.toLocaleDateString('en-US', options);
}

function isDateInRange(dateString, instance) {
    if (!instance.tempStartDate || !instance.tempEndDate) return false;
    
    const date = new Date(dateString);
    const start = new Date(instance.tempStartDate);
    const end = new Date(instance.tempEndDate);
    
    return date > start && date < end;
}

function isDateDisabled(dateString, instance) {
    const date = new Date(dateString);
    
    if (instance.minDate && date < new Date(instance.minDate)) {
        return true;
    }
    
    if (instance.maxDate && date > new Date(instance.maxDate)) {
        return true;
    }
    
    return false;
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    const dropdowns = document.querySelectorAll('.date-range-picker .dropdown-content');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target) && !dropdown.previousElementSibling.contains(event.target)) {
            dropdown.blur();
        }
    });
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDateRange,
        selectDatePreset,
        clearDateRange,
        applyDateRange,
        prevMonth,
        nextMonth
    };
} 