const TeacherAssignment = require("../models/TeacherAssignment");
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");
const Section = require("../models/Section");
const Subject = require("../models/Subject");

const asyncHandler = require("../middleware/asyncHandler");
const PAGE=require("../constants/pageTitles");


// ===================================================
// Get All Assignments
// ===================================================

const getAllAssignments = asyncHandler(async (req, res) => {

    const search = req.query.search || "";

    const page = parseInt(req.query.page) || 1;

    const limit = 5;

    const skip = (page - 1) * limit;

    let filter = {};

    const assignments = await TeacherAssignment.find(filter)

        .populate("teacher")

        .populate("class")

        .populate("section")

        .populate("subject")

        .sort({ createdAt: -1 })

        .skip(skip)

        .limit(limit);

    let filteredAssignments = assignments;

    if (search) {

        filteredAssignments = assignments.filter(item =>

            item.teacher.name.toLowerCase().includes(search.toLowerCase()) ||

            item.class.className.toLowerCase().includes(search.toLowerCase()) ||

            item.section.sectionName.toLowerCase().includes(search.toLowerCase()) ||

            item.subject.subjectName.toLowerCase().includes(search.toLowerCase())

        );

    }

    const totalAssignments = await TeacherAssignment.countDocuments();

    const activeAssignments = await TeacherAssignment.countDocuments({

        status: "Active"

    });

    const totalResults = filteredAssignments.length;

    const totalPages = Math.ceil(totalResults / limit);

    res.render("teacherAssignment/index", {
        title:PAGE.ASSIGNMENT.INDEX,

        assignments: filteredAssignments,

        page,

        totalPages,

        search,

        totalAssignments,

        activeAssignments,

        totalResults,

        module: "teacherAssignment"

    });

});


// ===================================================
// Show Add Form
// ===================================================

const showAddAssignmentForm = asyncHandler(async (req, res) => {

    const teachers = await Teacher.find();

    const classes = await Class.find();

    const sections = await Section.find().populate("class");

    const subjects = await Subject.find();

    res.render("teacherAssignment/add", {
        title:PAGE.ASSIGNMENT.ADD,

        teachers,

        classes,

        sections,

        subjects,

        assignment: {},

        errors: {},

        module: "teacherAssignment"

    });

});


// ===================================================
// Create Assignment
// ===================================================

const createAssignment = asyncHandler(async (req, res) => {

    try {

        // ===============================
        // Check Class Teacher Already Exists
        // ===============================

        if (req.body.role === "Class Teacher") {

            const existingClassTeacher = await TeacherAssignment.findOne({

                class: req.body.class,

                section: req.body.section,

                role: "Class Teacher"

            });

            if (existingClassTeacher) {

                const teachers = await Teacher.find();

                const classes = await Class.find();

                const sections = await Section.find().populate("class");

                const subjects = await Subject.find();

                return res.render("teacherAssignment/add", {
                    title:PAGE.ASSIGNMENT.ADD,

                    teachers,

                    classes,

                    sections,

                    subjects,

                    assignment: req.body,

                    errors: {},

                    customError:
                        "This class already has a Class Teacher.",

                    module: "teacherAssignment"

                });

            }

        }

        // ===============================
        // Save Assignment
        // ===============================

        const assignment = new TeacherAssignment(req.body);

        await assignment.save();

        res.redirect("/teacher-assignments");

    }

    catch (error) {

        const teachers = await Teacher.find();

        const classes = await Class.find();

        const sections = await Section.find().populate("class");

        const subjects = await Subject.find();

        res.render("teacherAssignment/add", {
            title:PAGE.ASSIGNMENT.ADD,

            teachers,

            classes,

            sections,

            subjects,

            assignment: req.body,

            errors: error.errors || {},

            module: "teacherAssignment"

        });

    }

});


// ===================================================
// Show Edit Form
// ===================================================

const showEditAssignmentForm = asyncHandler(async (req, res) => {

    const assignment = await TeacherAssignment.findById(req.params.id);

    const teachers = await Teacher.find();

    const classes = await Class.find();

    const sections = await Section.find();

    const subjects = await Subject.find();

    res.render("teacherAssignment/edit", {

        title:PAGE.ASSIGNMENT.EDIT,

        layout: "layouts/adminLayout",

        assignment,

        teachers,

        classes,

        sections,

        subjects,

        errors: {},

        module: "teacherAssignment"

    });

});


// ===================================================
// Update Assignment
// ===================================================

const updateAssignment = asyncHandler(async (req, res) => {

    try {

        // ===========================================
        // Check if another Class Teacher already exists
        // ===========================================

        if (req.body.role === "Class Teacher") {

            const existingClassTeacher =
                await TeacherAssignment.findOne({

                    class: req.body.class,

                    section: req.body.section,

                    role: "Class Teacher",

                    _id: {
                        $ne: req.params.id
                    }

                });

            if (existingClassTeacher) {

                const teachers = await Teacher.find();

                const classes = await Class.find();

                const sections = await Section.find().populate("class");

                const subjects = await Subject.find();

                return res.render("teacherAssignment/edit", {

                    assignment: {
                        ...req.body,
                        _id: req.params.id
                    },

                    teachers,

                    classes,

                    sections,

                    subjects,

                    errors: {},

                    customError:
                        "This class already has a Class Teacher.",

                    module: "teacherAssignment"

                });

            }

        }

        // ===========================================
        // Update Assignment
        // ===========================================

        await TeacherAssignment.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                runValidators: true,
                returnDocument: "after"
            }

        );

        res.redirect("/teacher-assignments");

    }

    catch (error) {

        const teachers = await Teacher.find();

        const classes = await Class.find();

        const sections = await Section.find().populate("class");

        const subjects = await Subject.find();

        res.render("teacherAssignment/edit", {

            assignment: {
                ...req.body,
                _id: req.params.id
            },

            teachers,

            classes,

            sections,

            subjects,

            errors: error.errors || {},

            customError: null,

            module: "teacherAssignment"

        });

    }

});


// ===================================================
// Delete Assignment
// ===================================================

const deleteAssignment = asyncHandler(async (req, res) => {

    await TeacherAssignment.findByIdAndDelete(req.params.id);

    res.redirect("/teacher-assignments");

});


module.exports = {

    getAllAssignments,

    showAddAssignmentForm,

    createAssignment,

    showEditAssignmentForm,

    updateAssignment,

    deleteAssignment

};