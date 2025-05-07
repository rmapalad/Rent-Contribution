document.addEventListener('DOMContentLoaded', function() {
    const electricBillForm = document.getElementById('electricBillForm');
    const results = document.getElementById('results');
    const selectedDatesList = document.getElementById('selectedDatesList');
    let selectedDates = [];
    
    // Constants
    const INTERNET_BILL = 1400;
    const WATER_BILL = 360;
    const NUMBER_OF_TENANTS = 4;

    // Calculate constant bill shares
    const internetShare = INTERNET_BILL / NUMBER_OF_TENANTS;
    const waterShare = WATER_BILL / NUMBER_OF_TENANTS;

    // Update constant bill shares in the UI
    document.getElementById('internetShare').textContent = `₱${internetShare.toFixed(2)}`;
    document.getElementById('waterShare').textContent = `₱${waterShare.toFixed(2)}`;

    // Initialize Flatpickr
    const datePicker = flatpickr("#absentDates", {
        mode: "multiple",
        dateFormat: "Y-m-d",
        allowInput: true,
        onChange: function(selectedDates, dateStr) {
            updateSelectedDatesList(selectedDates);
        }
    });

    // Function to update the selected dates list
    function updateSelectedDatesList(dates) {
        selectedDates = dates;
        selectedDatesList.innerHTML = '';
        
        dates.forEach(date => {
            const li = document.createElement('li');
            const dateStr = date.toLocaleDateString();
            li.innerHTML = `
                ${dateStr}
                <button class="remove-date" data-date="${date.toISOString()}">×</button>
            `;
            selectedDatesList.appendChild(li);
        });

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-date').forEach(button => {
            button.addEventListener('click', function() {
                const dateToRemove = new Date(this.dataset.date);
                selectedDates = selectedDates.filter(date => date.getTime() !== dateToRemove.getTime());
                datePicker.setDate(selectedDates);
                updateSelectedDatesList(selectedDates);
            });
        });
    }

    electricBillForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const totalElectricBill = parseFloat(document.getElementById('totalElectricBill').value);
        const daysAbsent = selectedDates.length;

        // Get the current month's number of days
        const today = new Date();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        // Calculate electric bill share
        const dailyRate = totalElectricBill / daysInMonth; // Daily rate for the entire bill
        const absentDaysDeduction = dailyRate * daysAbsent; // Total deduction for absent days
        
        // Calculate remaining bill after deduction
        const remainingBill = totalElectricBill - absentDaysDeduction;
        
        // Calculate share for this tenant (remaining bill divided by number of tenants)
        const electricShare = remainingBill / NUMBER_OF_TENANTS;

        // Update electric share in the UI
        document.getElementById('electricShare').textContent = `₱${electricShare.toFixed(2)}`;

        // Calculate and update total share
        const totalShare = electricShare + internetShare + waterShare;
        document.getElementById('totalShare').textContent = `₱${totalShare.toFixed(2)}`;

        // Update breakdown section
        document.getElementById('totalBill').textContent = `₱${totalElectricBill.toFixed(2)}`;
        document.getElementById('daysInMonth').textContent = daysInMonth;
        document.getElementById('dailyRate').textContent = `₱${dailyRate.toFixed(2)}`;
        document.getElementById('daysAbsent').textContent = daysAbsent;
        document.getElementById('totalDeduction').textContent = `₱${absentDaysDeduction.toFixed(2)}`;
        document.getElementById('remainingBill').textContent = `₱${remainingBill.toFixed(2)}`;
        document.getElementById('breakdownShare').textContent = `₱${electricShare.toFixed(2)}`;
    });
}); 