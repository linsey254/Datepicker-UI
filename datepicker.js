class DatePicker {
    constructor(container) {
        this.container = container;
        this.input = container.querySelector('.date-input');
        this.picker = container.querySelector('.datepicker');
        this.monthYear = container.querySelector('.month-year');
        this.calendarGrid = container.querySelector('.calendar-grid');
        
        this.currentDate = new Date();
        this.selectedDate = null;
        this.today = new Date();
        
        this.init();
    }

    init() {
        this.renderCalendar();
        this.addEventListeners();
    }

    addEventListeners() {
        // Input click handler
        this.input.addEventListener('click', () => this.togglePicker());
        
        // Navigation buttons
        this.picker.querySelector('.prev').addEventListener('click', () => this.changeMonth(-1));
        this.picker.querySelector('.next').addEventListener('click', () => this.changeMonth(1));
        
        // Date selection
        this.calendarGrid.addEventListener('click', (e) => this.handleDateClick(e));
        
        // Close picker when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.hidePicker();
            }
        });
    }

    togglePicker() {
        this.picker.classList.toggle('active');
    }

    hidePicker() {
        this.picker.classList.remove('active');
    }

    handleDateClick(e) {
        if (e.target.classList.contains('date') && !e.target.classList.contains('inactive')) {
            const date = parseInt(e.target.textContent);
            this.selectedDate = new Date(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth(),
                date
            );
            
            this.updateInput();
            this.renderCalendar();
            this.hidePicker();
        }
    }

    updateInput() {
        if (this.selectedDate) {
            this.input.value = this.selectedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }
    }

    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.renderCalendar();
    }

    renderCalendar() {
        // Clear existing dates
        this.calendarGrid.innerHTML = '';
        
        // Add day names
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const div = document.createElement('div');
            div.className = 'day-name';
            div.textContent = day;
            this.calendarGrid.appendChild(div);
        });

        // Set month/year header
        this.monthYear.textContent = this.currentDate.toLocaleString('default', { 
            month: 'long', 
            year: 'numeric' 
        });

        // Calculate calendar dates
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Create date cells
        let date = 1;
        let dayOfWeek = firstDay.getDay();
        
        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = dayOfWeek - 1; i >= 0; i--) {
            this.createDateCell(prevMonthLastDay - i, true);
        }

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
            this.createDateCell(d);
        }

        // Next month days
        const nextMonthDays = 7 - (this.calendarGrid.children.length % 7);
        for (let i = 1; i <= nextMonthDays; i++) {
            this.createDateCell(i, true);
        }
    }

    createDateCell(day, isInactive = false) {
        const button = document.createElement('button');
        button.className = 'date' + (isInactive ? ' inactive' : '');
        button.textContent = day;

        // Highlight today
        if (!isInactive && this.isToday(day)) {
            button.classList.add('today');
        }

        // Highlight selected date
        if (this.isSelectedDate(day)) {
            button.classList.add('selected');
        }

        this.calendarGrid.appendChild(button);
    }

    isToday(day) {
        return this.currentDate.getMonth() === this.today.getMonth() &&
               this.currentDate.getFullYear() === this.today.getFullYear() &&
               day === this.today.getDate();
    }

    isSelectedDate(day) {
        return this.selectedDate &&
               this.currentDate.getMonth() === this.selectedDate.getMonth() &&
               this.currentDate.getFullYear() === this.selectedDate.getFullYear() &&
               day === this.selectedDate.getDate();
    }
}

// Initialize datepicker
const container = document.querySelector('.datepicker-container');
const datePicker = new DatePicker(container);s