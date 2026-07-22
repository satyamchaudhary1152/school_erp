const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const PAGE = require("../constants/pageTitles");
const Teacher = require("../models/Teacher");

// ==============================
// Login Page
// ==============================

const showLoginPage = (req, res) => {

    res.render("auth/login", {

        layout: false,

        title: PAGE.AUTH.LOGIN,

        error: null

    });

};

// ==============================
// Admin Login Page
// ==============================

const showAdminLoginPage = (req, res) => {

    res.render("auth/adminLogin", {

        layout: false,

        title: "Admin Login",

        error: null

    });

};

// ==============================
// Teacher Login Page
// ==============================

const showTeacherLoginPage = (req, res) => {

    res.render("auth/teacherLogin", {

        layout: false,

        title: "Teacher Login",

        error: null

    });

};

// ==============================
// Login admin
// ==============================

const loginAdmin = async (req, res) => {

    try {

        const { email, password } = req.body;

        const admin = await Admin.findOne({

            email: email.toLowerCase()

        });

        if (!admin) {

            return res.render("auth/adminLogin", {

                layout: false,

                title: "Admin Login",

                error: "Invalid Email or Password"

            });

        }

        const isMatch = await bcrypt.compare(

            password,

            admin.password

        );

        if (!isMatch) {

            return res.render("auth/adminLogin", {

                layout: false,

                title: "Admin Login",

                error: "Invalid Email or Password"

            });

        }

        req.session.admin = {

            id: admin._id,

            name: admin.name,

            email: admin.email,

            role: "admin"

        };

        return res.redirect("/dashboard");

    }

    catch (error) {

        console.log(error);

        res.status(500).send(error.message);

    }

};

// ==============================
// Login teacher
// ==============================

const loginTeacher = async (req, res) => {

    try {

        const { email, password } = req.body;

        const teacher = await Teacher.findOne({

            email: email.toLowerCase()

        });

        if (!teacher) {

            return res.render("auth/teacherLogin", {

                layout: false,

                title: "Teacher Login",

                error: "Invalid Email or Password"

            });

        }

        const isMatch = await teacher.comparePassword(password);

        if (!isMatch) {

            return res.render("auth/teacherLogin", {

                layout: false,

                title: "Teacher Login",

                error: "Invalid Email or Password"

            });

        }

        if (!teacher.isActive) {

            return res.render("auth/teacherLogin", {

                layout: false,

                title: "Teacher Login",

                error: "Teacher account is inactive."

            });

        }

        teacher.lastLogin = new Date();

        await teacher.save();

        req.session.admin = {

            id: teacher._id,

            name: teacher.name,

            email: teacher.email,

            role: "teacher"

        };

        return res.redirect("/teacher/dashboard");

    }

    catch (error) {

        console.log(error);

        res.status(500).send(error.message);

    }

};

// ==============================
// Logout
// ==============================

const logoutAdmin = (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            return res.redirect("/dashboard");

        }

        res.clearCookie("connect.sid");

        res.redirect("/login");

    });

};

const logoutTeacher = (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            return res.redirect("/teacher/dashboard");

        }

        res.clearCookie("connect.sid");

        res.redirect("/");

    });

};

module.exports = {

    showAdminLoginPage,

    showTeacherLoginPage,

    loginAdmin,

    loginTeacher,

    logoutAdmin,

    logoutTeacher

};