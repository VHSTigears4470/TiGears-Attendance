<?php
require_once '../backend/db.php';

// Fetch all students ordered by name
$sql = "SELECT student_id, name FROM students ORDER BY name ASC";
$result = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Robotics Team Attendance</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Robotics Team Attendance</h1>
        <p class="instructions">Select your name and then tap Sign In or Sign Out</p>

        <div id="message" class="message"></div>

        <div class="student-grid">
            <?php
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    echo '<button class="student-button" data-student-id="' . htmlspecialchars($row['student_id']) . '">';
                    echo htmlspecialchars($row['name']);
                    echo '</button>';
                }
            } else {
                echo '<p class="no-students">No students found. Please add students to the database.</p>';
            }
            ?>
        </div>

        <div class="action-buttons" id="actionButtons" style="display: none;">
            <button class="action-button sign-in" id="signInBtn">Sign In</button>
            <button class="action-button sign-out" id="signOutBtn">Sign Out</button>
            <button class="action-button cancel" id="cancelBtn">Cancel</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
<?php
$conn->close();
?>
