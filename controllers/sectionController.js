const Section = require("../models/Section");
const Class = require("../models/Class");
const asyncHandler = require("../middleware/asyncHandler");
const PAGE=require("../constants/pageTitles");

// =====================================================
// Get All Sections
// =====================================================

const getAllSections = asyncHandler(async (req, res) => {

    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;

    const limit = 5;
    const skip = (page - 1) * limit;

    let filter = {};

    // Search by Section Name
    if (search) {
        filter.sectionName = {
            $regex: search,
            $options: "i"
        };
    }

    const sections = await Section.find(filter)
        .populate("class")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalSections = await Section.countDocuments();

    const activeSections = await Section.countDocuments({
        status: "Active"
    });

    const totalResults = await Section.countDocuments(filter);

    const totalPages = Math.ceil(totalResults / limit);

    res.render("section/index", {
        title:PAGE.SECTION.INDEX,

        sections,

        page,

        totalPages,

        search,

        totalSections,

        activeSections,

        totalResults,

        module: "section"

    });

});


const getSectionsByClass = asyncHandler(async(req,res)=>{

    const sections = await Section.find({

        class:req.params.classId,

        status:"Active"

    });

    res.json(sections);

});


// =====================================================
// Show Add Form
// =====================================================

const showAddSectionForm = asyncHandler(async (req, res) => {

    const classes = await Class.find({
        status: "Active"
    }).sort({
        className: 1
    });

    res.render("section/add", {
        title:PAGE.SECTION.ADD,

        errors: {},

        section: {},

        classes,

        module: "section"

    });

});


// =====================================================
// Create Section
// =====================================================

const createSection = asyncHandler(async (req, res) => {

    try {

        const newSection = new Section(req.body);

        await newSection.save();

        res.redirect("/sections");

    }

    catch (error) {

        const classes = await Class.find({
            status: "Active"
        }).sort({
            className: 1
        });

        res.render("section/add", {

            title:PAGE.SECTION.ADD,

            errors: error.errors || {},

            section: req.body,

            classes,

            module: "section"

        });

    }

});


// =====================================================
// Show Edit Form
// =====================================================

const showEditSectionForm = asyncHandler(async (req, res) => {

    const section = await Section.findById(req.params.id);

    if (!section) {

        return res.status(404).send("Section Not Found");

    }

    const classes = await Class.find({
        status: "Active"
    }).sort({
        className: 1
    });

    res.render("section/edit", {
        title:PAGE.SECTION.EDIT,

        section,

        classes,

        errors: {},

        module: "section"

    });

});


// =====================================================
// Update Section
// =====================================================

const updateSection = asyncHandler(async (req, res) => {

    try {

        await Section.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        res.redirect("/sections");

    }

    catch (error) {

        const classes = await Class.find({
            status: "Active"
        }).sort({
            className: 1
        });

        res.render("section/edit", {

            section: {

                ...req.body,

                _id: req.params.id

            },

            classes,

            errors: error.errors || {},

            module: "section"

        });

    }

});


// =====================================================
// Delete Section
// =====================================================

const deleteSection = asyncHandler(async (req, res) => {

    await Section.findByIdAndDelete(req.params.id);

    res.redirect("/sections");

});


// =====================================================

module.exports = {

    getAllSections,

    showAddSectionForm,

    createSection,

    showEditSectionForm,

    updateSection,

    deleteSection,

    getSectionsByClass

};