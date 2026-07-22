const asyncHandler = require("../middleware/asyncHandler");

const TeacherAssignment = require("../models/TeacherAssignment");

const Attendance = require("../models/Attendance");

const Student = require("../models/Student");


// ==============================
// Attendance Dashboard
// ==============================

const showAttendance = asyncHandler(async (req, res) => {

    const teacherId = req.session.admin.id;

    // =====================================
    // Teacher Assignment
    // =====================================

    const assignment = await TeacherAssignment.findOne({

        teacher: teacherId,

        status: "Active"

    })

    .populate("class")

    .populate("section")

    .populate("subject");

    // No Assignment

    if (!assignment) {

        return res.render("teacher/attendance/index", {

            layout: "layouts/teacherLayout",

            title: "Attendance",

            teacher: req.session.admin,

            assignment: null,

            attendance: [],

            totalAttendance: 0,

            todayStudents: 0,

            todayPresent: 0,

            todayAbsent: 0,

            attendanceTakenToday: false,

            module: "teacher"

        });

    }

    // =====================================
    // Today's Attendance Check
    // =====================================

    const today = new Date();

    const start = new Date(today);

    start.setHours(0,0,0,0);

    const end = new Date(today);

    end.setHours(23,59,59,999);

    const todayAttendance = await Attendance.findOne({

        class: assignment.class._id,

        section: assignment.section._id,

        date:{

            $gte:start,

            $lte:end

        }

    });

    // =====================================
    // If Attendance Not Taken
    // =====================================

    if(!todayAttendance){

        const students = await Student.find({

            class:assignment.class._id,

            section:assignment.section._id

        })

        .sort({

            rollNumber:1

        });

        return res.render("teacher/attendance/attendanceForm",{

            layout:"layouts/teacherLayout",

            title:"Take Attendance",

            teacher:req.session.admin,

            assignment,

            students,

            attendance:null,

            editMode:false,

            module:"teacher"

        });

    }

    // =====================================
    // Attendance History
    // =====================================

    const attendance = await Attendance.find({

        class:assignment.class._id,

        section:assignment.section._id

    })

    .sort({

        date:-1

    });

    let totalStudents=0;

    let todayPresent=0;

    let todayAbsent=0;

    attendance.forEach(record=>{

        totalStudents+=record.students.length;

    });

    todayPresent=todayAttendance.students.filter(

        s=>s.status==="Present"

    ).length;

    todayAbsent=todayAttendance.students.filter(

        s=>s.status==="Absent"

    ).length;

    res.render("teacher/attendance/index",{

        layout:"layouts/teacherLayout",

        title:"Attendance",

        teacher:req.session.admin,

        assignment,

        attendance,

        totalAttendance:attendance.length,

        todayStudents:todayAttendance.students.length,

        todayPresent,

        todayAbsent,

        attendanceTakenToday:true,

        todayAttendance,

        module:"teacher"

    });

});

// ==============================
// Mark Attendance Form
// ==============================

const showMarkAttendance = asyncHandler(async (req, res) => {

    const teacherId = req.session.admin.id;

    // Teacher Assignment

    const assignment = await TeacherAssignment.findOne({

        teacher: teacherId,

        status: "Active"

    })

    .populate("class")

    .populate("section")

    .populate("subject");

    if (!assignment) {

        return res.render("teacher/attendance/attendanceForm", {

            layout: "layouts/teacherLayout",

            title: "Take Attendance",

            teacher: req.session.admin,

            assignment: null,

            students: [],

            attendance:null,

            editMode:false,

            module:"teacher"

        });

    }

    // Students

    const students = await Student.find({

        class: assignment.class._id,

        section: assignment.section._id

    })

    .populate("class")

    .populate("section")

    .sort({

        name: 1

    });

    res.render("teacher/attendance/attendanceForm", {

        layout:"layouts/teacherLayout",

        title:"Take Attendance",

        teacher:req.session.admin,

        assignment,

        students,

        attendance:null,

        editMode:false,

        module:"teacher"

    });

});

// =====================================
// Edit Attendance
// =====================================

const showEditAttendance = asyncHandler(async (req, res) => {

    const teacherId = req.session.admin.id;

    const assignment = await TeacherAssignment.findOne({

        teacher: teacherId,

        status: "Active"

    })

    .populate("class")

    .populate("section")

    .populate("subject");

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {

        return res.redirect("/teacher/attendance");

    }

    const students = await Student.find({

        class: assignment.class._id,

        section: assignment.section._id

    })

    .sort({

        rollNumber: 1,

        name: 1

    });
    res.render("teacher/attendance/attendanceForm", {

        layout:"layouts/teacherLayout",

        title:"Edit Attendance",

        teacher:req.session.admin,

        assignment,

        students,

        attendance,

        editMode:true,

        module:"teacher"

    });

});

// =====================================
// Update Attendance
// =====================================

const updateAttendance = asyncHandler(async (req, res) => {

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {

        return res.redirect("/teacher/attendance");

    }

    const studentIds = Array.isArray(req.body.studentIds)

        ? req.body.studentIds

        : [req.body.studentIds];

    attendance.students = studentIds.map(studentId => ({

        student: studentId,

        status: req.body[`status_${studentId}`] || "Present"

    }));

    await attendance.save();

    res.redirect("/teacher/attendance");

});

// ==============================
// Save Attendance
// ==============================

const saveAttendance = asyncHandler(async (req, res) => {

    const teacherId = req.session.admin.id;

    // Active Assignment

    const assignment = await TeacherAssignment.findOne({

        teacher: teacherId,

        status: "Active"

    });

    if (!assignment) {

        return res.redirect("/teacher/attendance");

    }

    // Today's Date

    const today = new Date();

    today.setHours(0,0,0,0);

    // Duplicate Attendance Check

    const alreadyExists = await Attendance.findOne({

        class: assignment.class,

        section: assignment.section,

        date: today

    });

    if (alreadyExists) {

        return res.redirect("/teacher/attendance");

    }

    // Student IDs

    const studentIds = Array.isArray(req.body.studentIds)

        ? req.body.studentIds

        : [req.body.studentIds];

    const students = studentIds.map(id => ({

        student: id,

        status: req.body[`status_${id}`]

    }));

    // Save Attendance

    await Attendance.create({

        class: assignment.class,

        section: assignment.section,

        date: today,

        students

    });

    res.redirect("/teacher/attendance");

});

// ==============================
// Attendance Report
// ==============================

const showAttendanceReport = asyncHandler(async (req, res) => {

    res.send("Teacher Attendance Report");

});

module.exports = {

    showAttendance,

    showMarkAttendance,

    saveAttendance,

    showAttendanceReport,

    showEditAttendance,

    updateAttendance

};