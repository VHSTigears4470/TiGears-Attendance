<?php
/**
 * Calculate attendance status for a given timestamp
 * Returns 'on_time', 'late', or 'outside_window'
 *
 * @param mysqli $conn Database connection
 * @param string $timestamp The timestamp to check (format: Y-m-d H:i:s)
 * @return string|null The status, or null if not a sign-in
 */
function calculateAttendanceStatus($conn, $timestamp) {
    $dt = new DateTime($timestamp);
    $dayOfWeek = (int)$dt->format('w'); // 0=Sunday, 6=Saturday
    $time = $dt->format('H:i:s');

    // Find windows for that day that contain the timestamp
    $stmt = $conn->prepare("
        SELECT start_time, end_time
        FROM attendance_windows
        WHERE day_of_week = ?
        AND start_time <= ?
        AND end_time >= ?
        ORDER BY start_time ASC
        LIMIT 1
    ");
    $stmt->bind_param("iss", $dayOfWeek, $time, $time);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        return 'outside_window';
    }

    $window = $result->fetch_assoc();
    $stmt->close();

    // Check if within grace period
    $startTime = new DateTime($window['start_time']);
    $graceEnd = clone $startTime;
    $graceEnd->modify('+' . GRACE_PERIOD_MINUTES . ' minutes');

    $checkTime = new DateTime($time);

    if ($checkTime <= $graceEnd) {
        return 'on_time';
    } else {
        return 'late';
    }
}
?>
