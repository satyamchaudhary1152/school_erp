const express = require("express");

const router = express.Router();

const {

    getAllSections,
    showAddSectionForm,
    createSection,
    showEditSectionForm,
    updateSection,
    deleteSection,
    getSectionsByClass

} = require("../controllers/sectionController");

router.get("/", getAllSections);

router.get("/add", showAddSectionForm);

router.post("/", createSection);

router.get("/:id/edit", showEditSectionForm);

router.get("/by-class/:classId", getSectionsByClass);

router.put("/:id", updateSection);

router.delete("/:id", deleteSection);

module.exports = router;