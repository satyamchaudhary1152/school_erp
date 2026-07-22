const express = require("express");

const router = express.Router();

const {

    getAllStudents,
    createStudent,
    showAddForm,
    showEditForm,
    updateStudent,
    deleteStudent

} = require("../controllers/studentController");


// ==============================
// Student Routes
// ==============================

// Student Dashboard

router.get("/", getAllStudents);

// Add Student

router.get("/add", showAddForm);

router.post("/", createStudent);

// Edit Student

router.get("/:id/edit", showEditForm);

router.put("/:id", updateStudent);

// Delete Student

router.delete("/:id", deleteStudent);

module.exports = router;