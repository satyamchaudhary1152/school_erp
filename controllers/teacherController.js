const Teacher = require("../models/Teacher");
const asyncHandler = require("../middleware/asyncHandler");
const PAGE=require("../constants/pageTitles");

// Get All Teachers -------->>
const getAllTeachers = asyncHandler(async (req, res) => {

    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    let filter = {};

    if (search) {
        filter = {
            name: {
                $regex: search,
                $options: "i"
            }
        };
    }

    const teachers = await Teacher.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalTeachers = await Teacher.countDocuments();
    const activeTeachers = await Teacher.countDocuments({
        status : "Active"
    });
    const totalResults = await Teacher.countDocuments(filter);

    const totalPages = Math.ceil(totalResults / limit);
        res.render("teacher/index", {
        title:PAGE.TEACHER.INDEX,
        teachers,
        page,
        totalPages,
        search,
        totalTeachers,
        totalResults,
        activeTeachers,
        module : "teacher"
    });

});

//Show Add form ------>>
const showAddTeacherForm = asyncHandler(async(req, res) =>{
    res.render("teacher/add", {
        title:PAGE.TEACHER.ADD,
        errors : {},
        teacher : {},
        module : "teacher"
    });
});

// Create Teacher ------->>

const createTeacher = asyncHandler(async (req, res) => {

    // Employee ID Check
    const existingTeacher = await Teacher.findOne({

        employeeId: req.body.employeeId

    });

    if (existingTeacher) {

        return res.render("teacher/add", {

            title: PAGE.TEACHER.ADD,

            teacher: req.body,

            errors: {},

            customError: "Employee ID already exists.",

            module: "teacher"

        });

    }

    // Email Check

    const existingEmail = await Teacher.findOne({

        email: req.body.email

    });

    if (existingEmail) {

        return res.render("teacher/add", {

            title: PAGE.TEACHER.ADD,

            teacher: req.body,

            errors: {},

            customError: "Email already exists.",

            module: "teacher"

        });

    }

    try {

        const teacher = new Teacher({

            ...req.body,

            role: "teacher",

            isActive: true

        });

        await teacher.save();

        return res.redirect("/teachers");

    }

    catch (error) {

        console.log(error);

        return res.render("teacher/add", {

            title: PAGE.TEACHER.ADD,

            teacher: req.body,

            errors: error.errors || {},

            customError: "",

            module: "teacher"

        });

    }

});

// Show Edit Form
const showEditTeacherForm = asyncHandler(async (req, res) => {
    const teacher = await Teacher.findById(req.params.id);

    if(!teacher){
        return res.status(404).send("Teacher not found");
    }

    res.render("teacher/edit",{
        title:PAGE.TEACHER.EDIT,
        teacher,
        errors:{},
        module : "teacher"
    });
});

// Update Teacher

const updateTeacher = asyncHandler(async (req, res) => {

    try {

        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {

            return res.redirect("/teachers");

        }

        teacher.name = req.body.name;

        teacher.employeeId = req.body.employeeId;

        teacher.email = req.body.email;

        teacher.phone = req.body.phone;

        teacher.qualification = req.body.qualification;

        teacher.class = req.body.class;

        teacher.section = req.body.section;

        teacher.isActive = req.body.isActive === "true";

        // Password change only if provided

        if (req.body.password && req.body.password.trim() !== "") {

            teacher.password = req.body.password;

        }

        await teacher.save();

        res.redirect("/teachers");

    }

    catch (error) {

        req.body._id = req.params.id;

        res.render("teacher/edit", {

            title: PAGE.TEACHER.EDIT,

            teacher: req.body,

            errors: error.errors || {},

            module: "teacher"

        });

    }

});

// Delete Teacher
const deleteTeacher = asyncHandler(async (req, res) => {
    await Teacher.findByIdAndDelete(req.params.id);
    res.redirect("/teachers");
});

module.exports = {
    getAllTeachers,
    showAddTeacherForm,
    createTeacher,
    showEditTeacherForm,
    updateTeacher,
    deleteTeacher,
};