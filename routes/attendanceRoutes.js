const express = require("express");

const router = express.Router();

const {

    showAttendanceDashboard,

    showAttendanceReports,

    exportAttendancePDF

} = require("../controllers/attendanceController");


router.get("/", showAttendanceDashboard);


router.get("/reports", showAttendanceReports);


router.get("/reports/pdf", exportAttendancePDF);


module.exports = router;