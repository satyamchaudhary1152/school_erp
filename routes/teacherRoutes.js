const express = require("express");

const router = express.Router();

const {
    getAllTeachers,
    showAddTeacherForm,
    createTeacher,
    showEditTeacherForm,
    updateTeacher,
    deleteTeacher
} = require("../controllers/teacherController");

// Show All Teacher
router.get("/", getAllTeachers);

// Add Teacher Form
router.get("/add", showAddTeacherForm);

// Save Teacher
router.post("/", createTeacher);

// Edit Form
router.get("/:id/edit", showEditTeacherForm);

// Update Teacher
router.put("/:id", updateTeacher);

// Delete Teacher
router.delete("/:id", deleteTeacher);

module.exports = router;