const Subject = require("../models/Subject");
const asyncHandler = require("../middleware/asyncHandler");
const PAGE=require("../constants/pageTitles");

// ======================================================
// Get All Subjects
// ======================================================

const getAllSubjects = asyncHandler(async (req, res) => {

    const search = req.query.search || "";

    const page = parseInt(req.query.page) || 1;

    const limit = 5;

    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {

        filter.$or = [

            {
                subjectName: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                subjectCode: {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }

    const subjects = await Subject.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalSubjects = await Subject.countDocuments();

    const activeSubjects = await Subject.countDocuments({
        status: "Active"
    });

    const totalResults = await Subject.countDocuments(filter);

    const totalPages = Math.ceil(totalResults / limit);

    res.render("subject/index", {
        title:PAGE.SUBJECT.INDEX,

        subjects,

        page,

        totalPages,

        search,

        totalSubjects,

        activeSubjects,

        totalResults,

        module: "subject"

    });

});


// ======================================================
// Show Add Form
// ======================================================

const showAddSubjectForm = asyncHandler(async (req, res) => {

    res.render("subject/add", {
        title:PAGE.SUBJECT.ADD,

        errors: {},

        subject: {},

        module: "subject"

    });

});


// ======================================================
// Create Subject
// ======================================================

const createSubject = asyncHandler(async (req, res) => {

    try {

        const subject = new Subject(req.body);

        await subject.save();

        res.redirect("/subjects");

    }

    catch (error) {

        res.render("subject/add", {
            title:PAGE.SUBJECT.ADD,

            errors: error.errors || {},

            subject: req.body,

            module: "subject"

        });

    }

});


// ======================================================
// Show Edit Form
// ======================================================

const showEditSubjectForm = asyncHandler(async (req, res) => {

    const subject = await Subject.findById(req.params.id);

    if (!subject) {

        return res.status(404).send("Subject Not Found");

    }

    res.render("subject/edit", {
        title:PAGE.SUBJECT.EDIT,

        subject,

        errors: {},

        module: "subject"

    });

});


// ======================================================
// Update Subject
// ======================================================

const updateSubject = asyncHandler(async (req, res) => {

    try {

        await Subject.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        res.redirect("/subjects");

    }

    catch (error) {

        res.render("subject/edit", {

            subject: {

                ...req.body,

                _id: req.params.id

            },

            errors: error.errors || {},

            module: "subject"

        });

    }

});


// ======================================================
// Delete Subject
// ======================================================

const deleteSubject = asyncHandler(async (req, res) => {

    await Subject.findByIdAndDelete(req.params.id);

    res.redirect("/subjects");

});


// ======================================================

module.exports = {

    getAllSubjects,

    showAddSubjectForm,

    createSubject,

    showEditSubjectForm,

    updateSubject,

    deleteSubject

};