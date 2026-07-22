const Class = require("../models/Class");
const asyncHandler = require("../middleware/asyncHandler");
const PAGE=require("../constants/pageTitles");

// ==============================
// Get All Classes
// ==============================

const getAllClasses = asyncHandler(async (req, res) => {

    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;

    const limit = 5;
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {

        filter = {
            className: {
                $regex: search,
                $options: "i"
            }
        };

    }

    const classes = await Class.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalClasses = await Class.countDocuments();

    const activeClasses = await Class.countDocuments({
        status: "Active"
    });

    const totalResults = await Class.countDocuments(filter);

    const totalPages = Math.ceil(totalResults / limit);

    res.render("class/index", {
        title:PAGE.CLASS.INDEX,

        classes,

        page,

        totalPages,

        search,

        totalClasses,

        activeClasses,

        totalResults,

        module: "class"

    });

});


// ==============================
// Show Add Form
// ==============================

const showAddClassForm = asyncHandler(async (req, res) => {

    res.render("class/add", {

        title:PAGE.CLASS.ADD,

        errors: {},

        classData: {},

        module: "class"

    });

});


// ==============================
// Create Class
// ==============================

const createClass = asyncHandler(async (req, res) => {

    try {

        const newClass = new Class(req.body);

        await newClass.save();

        res.redirect("/classes");

    }
catch (error) {

    if (error.code === 11000) {

        return res.render("class/add", {

            title: PAGE.CLASS.ADD,
            module: "class",
            classData: req.body,

            errors: {
                className: {
                    message: "Class Name already exists."
                }
            }

        });

    }

    return res.render("class/add", {

        title: PAGE.CLASS.ADD,
        module: "class",
        classData: req.body,
        errors: error.errors || {}

    });

}

});


// ==============================
// Show Edit Form
// ==============================

const showEditClassForm = asyncHandler(async (req, res) => {

    const classData = await Class.findById(req.params.id);

    if (!classData) {

        return res.status(404).send("Class Not Found");

    }

    res.render("class/edit", {

        title:PAGE.CLASS.EDIT,

        classData,

        errors: {},

        module: "class"

    });

});


// ==============================
// Update Class
// ==============================

const updateClass = asyncHandler(async (req, res) => {

    try {

        await Class.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        res.redirect("/classes");

    }

    catch (error) {

        res.render("class/edit", {

            classData: {

                ...req.body,

                _id: req.params.id

            },

            errors: error.errors || {},

            module: "class"

        });

    }

});


// ==============================
// Delete Class
// ==============================

const deleteClass = asyncHandler(async (req, res) => {

    await Class.findByIdAndDelete(req.params.id);

    res.redirect("/classes");

});


// ==============================

module.exports = {

    getAllClasses,

    showAddClassForm,

    createClass,

    showEditClassForm,

    updateClass,

    deleteClass

};