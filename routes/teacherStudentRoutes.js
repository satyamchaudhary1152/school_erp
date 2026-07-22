const express = require("express");

const router = express.Router();

const { requireTeacher } = require("../middleware/auth");

const teacherAssignment = require("../middleware/teacherAssignment");

const teacherStudentAccess = require("../middleware/teacherStudentAccess");

const {

    showMyStudents,

    showAddStudentForm,

    createStudent,

    showEditStudentForm,

    updateStudent,

    deleteStudent

} = require("../controllers/teacherStudentController");

// ======================================
// My Students
// ======================================

router.get(

    "/students",

    requireTeacher,

    teacherAssignment,

    showMyStudents

);

// ======================================
// Add Student
// ======================================

router.get(

    "/students/add",

    requireTeacher,

    teacherAssignment,

    showAddStudentForm

);

router.post(

    "/students",

    requireTeacher,

    teacherAssignment,

    createStudent

);

// ======================================
// Edit Student
// ======================================

router.get(

    "/students/edit/:id",

    requireTeacher,

    teacherAssignment,

    teacherStudentAccess,

    showEditStudentForm

);

router.put(

    "/students/:id",

    requireTeacher,

    teacherAssignment,

    teacherStudentAccess,

    updateStudent

);

// ======================================
// Delete Student
// ======================================

router.delete(

    "/students/:id",

    requireTeacher,

    teacherAssignment,

    teacherStudentAccess,

    deleteStudent

);

module.exports = router;