# Robotics Team Attendance System

A simple, touch-friendly attendance tracking system for high school robotics teams built with PHP and MySQL.

## Features

- Touch-optimized interface for kiosk/tablet use
- Simple sign-in/sign-out flow without authentication
- Student roster management
- Attendance logging with timestamps

## Setup Instructions

### 1. Database Setup

1. Make sure MySQL is installed and running on your Windows machine
2. Open MySQL command line or phpMyAdmin
3. Run the SQL script to create the database and tables:
   ```bash
   mysql -u root -p < schema.sql
   ```
   Or import `schema.sql` through phpMyAdmin

### 2. Configuration

1. Edit `config.php` and update the database credentials:
   - `DB_USER`: Your MySQL username (default: 'root')
   - `DB_PASS`: Your MySQL password
   - `DB_NAME`: Database name (default: 'robotics_attendance')

2. Update the timezone in `config.php` if needed (default: 'America/New_York')

### 3. Web Server Setup

1. Install a web server with PHP support:
   - **XAMPP** (recommended for Windows): https://www.apachefriends.org/
   - **WAMP**: https://www.wampserver.com/
   - Or use PHP's built-in server for testing

2. Copy all files to your web server's document root:
   - XAMPP: `C:\xampp\htdocs\attendance\`
   - WAMP: `C:\wamp64\www\attendance\`

3. Start Apache and MySQL services

### 4. Access the Application

Open a web browser and navigate to:
- `http://localhost/attendance/` (if using XAMPP/WAMP)
- Or `http://localhost:8000/` if using PHP built-in server

## File Structure

- `index.php` - Main page displaying student roster
- `attendance.php` - Backend handler for sign-in/sign-out requests
- `db.php` - Database connection
- `config.php` - Configuration file
- `schema.sql` - Database schema
- `style.css` - Styling for touch interface
- `script.js` - Frontend JavaScript logic

## Database Schema

### Students Table
- `student_id` (VARCHAR, PRIMARY KEY) - Unique student identifier
- `name` (VARCHAR) - Student's full name
- `created_at` (TIMESTAMP) - Record creation timestamp

### Attendance Log Table
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY) - Unique log entry ID
- `student_id` (VARCHAR, FOREIGN KEY) - References students table
- `timestamp` (TIMESTAMP) - When the action occurred
- `action` (ENUM: 'in', 'out') - Whether student signed in or out

## Usage

1. Students walk up to the touchscreen
2. They tap their name from the list
3. They tap either "Sign In" or "Sign Out"
4. A confirmation message appears
5. The system logs the action with a timestamp

## Adding Students

To add students to the system, run SQL commands like:

```sql
INSERT INTO students (student_id, name) VALUES ('1006', 'Jane Doe');
```

Or use phpMyAdmin to add records through the GUI.

## Next Steps

Consider adding:
- Admin panel to manage students
- Reports showing attendance history
- Export functionality for attendance records
- Student photos for easier identification
