const express = require("express");

const router = express.Router();

const {

    getAllAssignments,

    showAddAssignmentForm,

    createAssignment,

    showEditAssignmentForm,

    updateAssignment,

    deleteAssignment

} = require("../controllers/teacherAssignmentController");


// ======================================
// Show All Assignments
// ======================================

router.get("/", getAllAssignments);


// ======================================
// Show Add Form
// ======================================

router.get("/add", showAddAssignmentForm);


// ======================================
// Save Assignment
// ======================================

router.post("/", createAssignment);


// ======================================
// Show Edit Form
// ======================================

router.get("/:id/edit", showEditAssignmentForm);


// ======================================
// Update Assignment
// ======================================

router.put("/:id", updateAssignment);


// ======================================
// Delete Assignment
// ======================================

router.delete("/:id", deleteAssignment);


module.exports = router;