-- Schema update for attendance windows and on-time tracking
-- Run this on an existing database to add the new features

-- Create attendance windows table
CREATE TABLE IF NOT EXISTS attendance_windows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week TINYINT NOT NULL,  -- 0=Sunday, 1=Monday, ..., 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_day (day_of_week),
    CONSTRAINT chk_day CHECK (day_of_week BETWEEN 0 AND 6),
    CONSTRAINT chk_times CHECK (start_time < end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default attendance windows
-- T=Tuesday(2), Th=Thursday(4), F=Friday(5), S=Saturday(6)
INSERT INTO attendance_windows (day_of_week, start_time, end_time) VALUES
(2, '14:00:00', '16:00:00'),  -- Tuesday 2PM-4PM
(4, '14:00:00', '16:00:00'),  -- Thursday 2PM-4PM
(5, '14:00:00', '16:00:00'),  -- Friday 2PM-4PM
(6, '09:00:00', '13:00:00');  -- Saturday 9AM-1PM
