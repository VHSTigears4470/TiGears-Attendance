// Global variables
let selectedStudentId = null;
let selectedStudentButton = null;
let selectedStudentStatus = null;

// Get DOM elements
const studentButtons = document.querySelectorAll('.student-item');
const actionButtons = document.getElementById('actionButtons');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');
const messageDiv = document.getElementById('message');

// Add click event to all student buttons
studentButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove previous selection
        if (selectedStudentButton) {
            selectedStudentButton.classList.remove('selected');
        }

        // Select current student
        selectedStudentId = this.getAttribute('data-student-id');
        selectedStudentStatus = this.getAttribute('data-status');
        selectedStudentButton = this;
        this.classList.add('selected');

        // Update confirm button text based on status
        if (selectedStudentStatus === 'in') {
            confirmBtn.textContent = 'Confirm Sign Out';
            confirmBtn.className = 'action-button confirm sign-out';
        } else if (selectedStudentStatus === 'out') {
            confirmBtn.textContent = 'Confirm Sign In';
            confirmBtn.className = 'action-button confirm sign-in';
        } else {
            confirmBtn.textContent = 'Confirm First Sign In';
            confirmBtn.className = 'action-button confirm sign-in';
        }

        // Show action buttons
        actionButtons.style.display = 'flex';

        // Clear any previous message
        hideMessage();

        // Scroll action buttons into view
        actionButtons.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// Confirm button
confirmBtn.addEventListener('click', function() {
    if (selectedStudentId && selectedStudentStatus) {
        // Determine action based on current status
        let action = (selectedStudentStatus === 'in') ? 'out' : 'in';
        recordAttendance(selectedStudentId, action);
    }
});

// Cancel button
cancelBtn.addEventListener('click', function() {
    clearSelection();
});

// Function to record attendance
function recordAttendance(studentId, action) {
    fetch('../backend/attendance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            student_id: studentId,
            action: action
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(data.message, 'success');
            clearSelection();
            // Reload page after 2 seconds to update student lists
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            showMessage('Error: ' + data.message, 'error');
        }
    })
    .catch(error => {
        showMessage('Network error. Please try again.', 'error');
        console.error('Error:', error);
    });
}

// Function to show message
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = 'message show ' + type;

    // Scroll message into view
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Don't auto-hide if page will reload
    if (type === 'error') {
        setTimeout(hideMessage, 3000);
    }
}

// Function to hide message
function hideMessage() {
    messageDiv.className = 'message';
}

// Function to clear selection
function clearSelection() {
    if (selectedStudentButton) {
        selectedStudentButton.classList.remove('selected');
    }
    selectedStudentId = null;
    selectedStudentButton = null;
    selectedStudentStatus = null;
    actionButtons.style.display = 'none';
}

// Prevent double-tap zoom on buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.click();
    }, { passive: false });
});
