const express = require("express");

const router = express.Router();

const {

    getAllSubjects,
    showAddSubjectForm,
    createSubject,
    showEditSubjectForm,
    updateSubject,
    deleteSubject

} = require("../controllers/subjectController");

router.get("/", getAllSubjects);

router.get("/add", showAddSubjectForm);

router.post("/", createSubject);

router.get("/:id/edit", showEditSubjectForm);

router.put("/:id", updateSubject);

router.delete("/:id", deleteSubject);

module.exports = router;