const Student = require("../models/student");
const asyncHandler = require("../middleware/asyncHandler");

// =======================================
// GET My Students
// =======================================

const showMyStudents = asyncHandler(async (req, res) => {

    const search = req.query.search || "";

    const page = Number(req.query.page) || 1;

    const limit = 5;

    const skip = (page - 1) * limit;

    const assignment = req.assignment;

    let query = {

        class: assignment.class._id,

        section: assignment.section._id

    };

    if (search) {

        query.name = {

            $regex: search,

            $options: "i"

        };

    }

    const totalStudents = await Student.countDocuments({

        class: assignment.class._id,

        section: assignment.section._id

    });

    const totalResults = await Student.countDocuments(query);

    const totalPages = Math.ceil(totalResults / limit);

    const students = await Student.find(query)

        .populate("class")

        .populate("section")

        .sort({

            createdAt: -1

        })

        .skip(skip)

        .limit(limit);

    res.render("teacher/students/index", {

        layout: "layouts/teacherLayout",

        title: "My Students",

        teacher: req.session.admin,

        students,

        search,

        page,

        totalPages,

        totalStudents,

        totalResults,

        module: "teacher"

    });

});

// =======================================
// SHOW ADD FORM
// =======================================

const showAddStudentForm = asyncHandler(async (req, res) => {

    res.render("teacher/students/add", {

        layout: "layouts/teacherLayout",

        title: "Add Student",

        teacher: req.session.admin,

        errors: [],

        student: {},

        module: "teacher"

    });

});

// =======================================
// CREATE STUDENT
// =======================================

const createStudent = asyncHandler(async (req, res) => {

    try {

        req.body.class = req.assignment.class._id;

        req.body.section = req.assignment.section._id;

        const student = new Student(req.body);

        await student.save();

        return res.redirect("/teacher/students");

    }

    catch (error) {

        let errors = [];

        if (error.name === "ValidationError") {

            errors = Object.values(error.errors).map(err => err.message);

        }

        if (error.code === 11000) {

            errors.push("Email already exists.");

        }

        return res.render("teacher/students/add", {

            layout: "layouts/teacherLayout",

            title: "Add Student",

            teacher: req.session.admin,

            errors,

            student: req.body,

            module: "teacher"

        });

    }

});

// =======================================
// SHOW EDIT FORM
// =======================================

const showEditStudentForm = asyncHandler(async (req, res) => {

    res.render("teacher/students/edit", {

        layout: "layouts/teacherLayout",

        title: "Edit Student",

        teacher: req.session.admin,

        student: req.student,

        errors: {},

        module: "teacher"

    });

});

// =======================================
// UPDATE STUDENT
// =======================================

const updateStudent = asyncHandler(async (req, res) => {

    try {

        req.body.class = req.assignment.class._id;

        req.body.section = req.assignment.section._id;

        await Student.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        return res.redirect("/teacher/students");

    }

    catch (error) {

        const student = req.body;

        student._id = req.params.id;

        return res.render("teacher/students/edit", {

            layout: "layouts/teacherLayout",

            title: "Edit Student",

            teacher: req.session.admin,

            student,

            errors: error.errors || {},

            module: "teacher"

        });

    }

});

// =======================================
// DELETE STUDENT
// =======================================

const deleteStudent = asyncHandler(async (req, res) => {

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {

        const error = new Error("Student Not Found");

        error.statusCode = 404;

        throw error;

    }

    res.redirect("/teacher/students");

});

module.exports = {

    showMyStudents,

    showAddStudentForm,

    createStudent,

    showEditStudentForm,

    updateStudent,

    deleteStudent

};