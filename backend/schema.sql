-- Database Schema for Robotics Team Attendance System
-- Create the database
CREATE DATABASE IF NOT EXISTS robotics_attendance;
USE robotics_attendance;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Attendance log table
CREATE TABLE IF NOT EXISTS attendance_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action ENUM('in', 'out') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    INDEX idx_student_timestamp (student_id, timestamp),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample data (optional - remove or modify as needed)
INSERT INTO students (student_id, name) VALUES
('1001', 'John Smith'),
('1002', 'Emma Johnson'),
('1003', 'Michael Brown'),
('1004', 'Sophia Davis'),
('1005', 'William Wilson');