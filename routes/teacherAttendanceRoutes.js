const express = require("express");
const router = express.Router();

const { requireTeacher } = require("../middleware/auth");

const {
    showAttendance,
    showMarkAttendance,
    saveAttendance,
    showEditAttendance,
    updateAttendance,
    showAttendanceReport
} = require("../controllers/teacherAttendanceController");

// Attendance Dashboard
router.get(
    "/attendance",
    requireTeacher,
    showAttendance
);

// Take Attendance
router.get(
    "/attendance/take",
    requireTeacher,
    showMarkAttendance
);

// Save Attendance
router.post(
    "/attendance",
    requireTeacher,
    saveAttendance
);

// Edit Attendance
router.get(
    "/attendance/:id/edit",
    requireTeacher,
    showEditAttendance
);

// Update Attendance
router.put(
    "/attendance/:id",
    requireTeacher,
    updateAttendance
);

// Report
router.get(
    "/attendance/report",
    requireTeacher,
    showAttendanceReport
);

module.exports = router;