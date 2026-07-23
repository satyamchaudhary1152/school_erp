const Attendance = require("../models/attendance");
const asyncHandler = require("../middleware/asyncHandler");
const PAGE = require("../constants/pageTitles");
const Class = require("../models/class");
const Section = require("../models/section");
const Student = require("../models/student");
const mongoose = require("mongoose");
const generateAttendancePDF = require("../utils/pdfGenerator");


// ==============================
// Attendance Dashboard
// ==============================

const showAttendanceDashboard = asyncHandler(async (req, res) => {

    const attendance = await Attendance.find()
        .populate("class")
        .populate("section")
        .sort({ date: -1 });

    let todayStudents = 0;
    let todayPresent = 0;

    attendance.forEach(record => {

        todayStudents += record.students.length;

        todayPresent += record.students.filter(
            s => s.status === "Present"
        ).length;

    });

    res.render("attendance/index", {

        title: PAGE.ATTENDANCE.INDEX,

        attendance,

        totalAttendance: attendance.length,

        todayStudents,

        todayPresent,

        module: "attendance"

    });

});


// ==============================
// Attendance Reports
// ==============================

const showAttendanceReports = asyncHandler(async (req, res) => {

    const {
        section = "",
        fromDate = "",
        toDate = "",
        student = ""
    } = req.query;

    // Active Sections
    const sections = await Section.find({
        status: "Active"
    })
        .populate("class")
        .sort({
            class: 1,
            sectionName: 1
        });

    // Filter Query
    let query = {};

    if (section) {

        query.section = section;

    }

    if (fromDate || toDate) {

    query.date = {};

    if (fromDate) {

        query.date.$gte = new Date(fromDate);

    }

    if (toDate) {

        const end = new Date(toDate);

        end.setDate(end.getDate() + 1);

        query.date.$lt = end;

    }

}

    // Attendance Records
    const attendance = await Attendance.find(query)

        .populate("class")

        .populate("section")

        .populate("students.student")

        .sort({
            date: -1
        });

    let reportRows = [];

attendance.forEach(record => {

    record.students.forEach(item => {

        if (
            student &&
            !item.student.name.toLowerCase().includes(student.toLowerCase())
        ) {
            return;
        }

        reportRows.push({

            date: record.date,

            class: record.class,

            section: record.section,

            student: item.student,

            status: item.status

        });

    });

});

    // Dashboard Statistics

    let totalStudents = 0;

    let present = 0;

    let absent = 0;

    let late = 0;

    let leave = 0;

    attendance.forEach(record => {

        reportRows.forEach(item => {

    totalStudents++;

    if (item.status === "Present") present++;

    if (item.status === "Absent") absent++;

    if (item.status === "Late") late++;

    if (item.status === "Leave") leave++;

});

    });

    const attendancePercentage =

        totalStudents === 0

            ? 0

            : ((present / totalStudents) * 100).toFixed(1);

    res.render("attendance/report", {

    title: PAGE.ATTENDANCE.REPORT,

    attendance,

    reportRows,

    sections,

    selectedSection: section,

    fromDate,

    toDate,

    student,

    totalStudents,

    present,

    absent,

    late,

    leave,

    attendancePercentage,

    module: "attendance"

});

});

// ==============================
// Export Attendance PDF
// ==============================

const exportAttendancePDF = asyncHandler(async (req, res) => {

    const {
        section = "",
        fromDate = "",
        toDate = "",
        student = ""
    } = req.query;

    let query = {};

    if (section) {

        query.section = section;

    }

    if (fromDate || toDate) {

        query.date = {};

        if (fromDate) {

            query.date.$gte = new Date(fromDate);

        }

        if (toDate) {

            const end = new Date(toDate);
            end.setDate(end.getDate() + 1);

            query.date.$lt = end;

        }

    }

    const attendance = await Attendance.find(query)
        .populate("class")
        .populate("section")
        .populate("students.student")
        .sort({ date: -1 });

    let reportRows = [];

    attendance.forEach(record => {

        record.students.forEach(item => {

            if (
                student &&
                !item.student.name.toLowerCase().includes(student.toLowerCase())
            ) {
                return;
            }

            reportRows.push({

                date: record.date,

                class: record.class,

                section: record.section,

                student: item.student,

                status: item.status

            });

        });

    });

    let totalStudents = reportRows.length;

    let present = reportRows.filter(r => r.status === "Present").length;

    let absent = reportRows.filter(r => r.status === "Absent").length;

    let late = reportRows.filter(r => r.status === "Late").length;

    let leave = reportRows.filter(r => r.status === "Leave").length;

    const attendancePercentage =

        totalStudents === 0

            ? 0

            : ((present / totalStudents) * 100).toFixed(1);

    generateAttendancePDF(res, reportRows, {

        totalStudents,

        present,

        absent,

        late,

        leave,

        attendancePercentage

    });

});

module.exports = {

    showAttendanceDashboard,

    showAttendanceReports,

    exportAttendancePDF

};