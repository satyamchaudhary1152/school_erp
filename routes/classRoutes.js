const express = require("express");

const router = express.Router();

const {

    getAllClasses,

    showAddClassForm,

    createClass,

    showEditClassForm,

    updateClass,

    deleteClass

} = require("../controllers/classController");

router.get("/", getAllClasses);

router.get("/add", showAddClassForm);

router.post("/", createClass);

router.get("/:id/edit", showEditClassForm);

router.put("/:id", updateClass);

router.delete("/:id", deleteClass);

module.exports = router;