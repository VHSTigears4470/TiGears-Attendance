# How to Add New Awards

This guide explains how to add new award types to the attendance tracker. The awards system is designed to be easy to modify, even if you're new to PHP.

## Overview

The awards section shows three boxes at the top of the page. Each box can display different rankings. The system works like this:

1. **Data is loaded once** from the database (all students and attendance records)
2. **Award functions** calculate rankings from this data
3. **Box functions** decide which award to show in each box

All the award code is in: `frontend/awards.php`

## Quick Start: Swap an Existing Award

If you just want to change what one of the boxes shows, find the box function in `awards.php` and change which award function it calls.

### The Three Box Functions

```php
// LEFT box - currently shows Total Time
function populateLeftBox($students, $attendance) {
    $items = awardTotalTime($students, $attendance);  // <-- Change this line
    renderAwardBox("Top 10 Total Time", "total-time-title", $items);
}

// MIDDLE box - currently shows Most Sign-Ins
function populateMiddleBox($students, $attendance) {
    $items = awardMostSignIns($students, $attendance);  // <-- Change this line
    renderAwardBox("Top 10 Most Sign-Ins", "most-signins-title", $items);
}

// RIGHT box - currently shows Today's Time
function populateRightBox($students, $attendance) {
    $items = awardTodayTime($students, $attendance);  // <-- Change this line
    renderAwardBox("Top 10 Time Today", "today-time-title", $items);
}
```

### Available Award Functions

- `awardTotalTime($students, $attendance)` - Total time signed in (all-time)
- `awardMostSignIns($students, $attendance)` - Number of sign-ins
- `awardTodayTime($students, $attendance)` - Time signed in today only

## Creating a New Award Function

### Step 1: Understand the Data

Your function receives two arrays:

**$students** - List of all students:
```php
[
    ['student_id' => '1001', 'name' => 'John Smith'],
    ['student_id' => '1002', 'name' => 'Emma Johnson'],
    // ...
]
```

**$attendance** - List of all sign-in/sign-out records:
```php
[
    ['student_id' => '1001', 'timestamp' => '2024-01-15 09:30:00', 'action' => 'in'],
    ['student_id' => '1001', 'timestamp' => '2024-01-15 12:00:00', 'action' => 'out'],
    // ...
]
```

### Step 2: Write Your Function

Create a new function that returns an array of results. Each result needs a `name` and a `value`:

```php
/**
 * Example: Award for most sign-outs (just as an example)
 */
function awardMostSignOuts($students, $attendance) {
    // Step 1: Build a lookup of student names
    $studentNames = [];
    foreach ($students as $student) {
        $studentNames[$student['student_id']] = $student['name'];
    }

    // Step 2: Count sign-outs for each student
    $signOutCounts = [];
    foreach ($attendance as $record) {
        if ($record['action'] === 'out') {
            $sid = $record['student_id'];
            if (!isset($signOutCounts[$sid])) {
                $signOutCounts[$sid] = 0;
            }
            $signOutCounts[$sid]++;
        }
    }

    // Step 3: Sort by count (highest first)
    arsort($signOutCounts);

    // Step 4: Build the result array (top 10)
    $result = [];
    $count = 0;
    foreach ($signOutCounts as $sid => $numSignOuts) {
        if ($numSignOuts > 0 && $count < 10) {
            $result[] = [
                'name' => $studentNames[$sid] ?? 'Unknown',
                'value' => (string)$numSignOuts
            ];
            $count++;
        }
    }

    return $result;
}
```

### Step 3: Use Your Function in a Box

Edit one of the box functions to call your new award:

```php
function populateLeftBox($students, $attendance) {
    $items = awardMostSignOuts($students, $attendance);  // Your new function!
    renderAwardBox("Top 10 Most Sign-Outs", "total-time-title", $items);
}
```

## Changing the Box Title and Color

The `renderAwardBox` function takes these parameters:

```php
renderAwardBox($title, $titleClass, $items);
```

**Available title colors (CSS classes):**
- `total-time-title` - Gold/orange gradient
- `most-signins-title` - Purple gradient
- `today-time-title` - Green gradient

To add a new color, edit `frontend/style.css` and add a new class like:

```css
.my-new-title {
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
}
```

## Helper Functions

The `formatTime()` function converts seconds to hours:minutes format:

```php
formatTime(3600);   // Returns "1:00"
formatTime(5400);   // Returns "1:30"
formatTime(7200);   // Returns "2:00"
```

## Complete Example: Weekly Time Award

Here's a complete example of adding a "Time This Week" award:

### 1. Add the function to `awards.php`:

```php
/**
 * Calculate total signed-in time for the current week
 */
function awardWeeklyTime($students, $attendance) {
    $studentTimes = [];

    // Get the start of the current week (Monday)
    $weekStart = date('Y-m-d', strtotime('monday this week'));

    // Build student name lookup
    $studentNames = [];
    foreach ($students as $student) {
        $studentNames[$student['student_id']] = $student['name'];
        $studentTimes[$student['student_id']] = 0;
    }

    // Filter to this week and group by student
    $studentAttendance = [];
    foreach ($attendance as $record) {
        $recordDate = date('Y-m-d', strtotime($record['timestamp']));
        if ($recordDate >= $weekStart) {
            $sid = $record['student_id'];
            if (!isset($studentAttendance[$sid])) {
                $studentAttendance[$sid] = [];
            }
            $studentAttendance[$sid][] = $record;
        }
    }

    // Calculate time for each student
    foreach ($studentAttendance as $sid => $records) {
        usort($records, function($a, $b) {
            return strtotime($a['timestamp']) - strtotime($b['timestamp']);
        });

        $signInTime = null;
        foreach ($records as $record) {
            if ($record['action'] === 'in') {
                $signInTime = strtotime($record['timestamp']);
            } elseif ($record['action'] === 'out' && $signInTime !== null) {
                $studentTimes[$sid] += (strtotime($record['timestamp']) - $signInTime);
                $signInTime = null;
            }
        }

        // If still signed in, count until now
        if ($signInTime !== null) {
            $studentTimes[$sid] += (time() - $signInTime);
        }
    }

    // Sort and return top 10
    arsort($studentTimes);

    $result = [];
    $count = 0;
    foreach ($studentTimes as $sid => $seconds) {
        if ($seconds > 0 && $count < 10) {
            $result[] = [
                'name' => $studentNames[$sid] ?? 'Unknown',
                'value' => formatTime($seconds)
            ];
            $count++;
        }
    }

    return $result;
}
```

### 2. Update a box function to use it:

```php
function populateRightBox($students, $attendance) {
    $items = awardWeeklyTime($students, $attendance);
    renderAwardBox("Top 10 Time This Week", "today-time-title", $items);
}
```

## Tips

- Always return an array, even if empty
- Each item must have both `name` and `value` keys
- The `value` should be a string (use `(string)` to convert numbers)
- Use `htmlspecialchars()` is already handled by `renderAwardBox`, so you don't need it
- Test with the existing data before deploying

## File Locations

- Award functions: `frontend/awards.php`
- Styling: `frontend/style.css`
- Main page: `frontend/index.php`
