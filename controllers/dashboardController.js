const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const Student = require("../models/student");
const Teacher = require("../models/teacher");
const Class = require("../models/class");
const Subject = require("../models/subject");
const PAGE=require("../constants/pageTitles");

const showDashboard = async (req, res) => {

    try {

        const totalStudents = await Student.countDocuments();

        const totalTeachers = await Teacher.countDocuments();

        const totalClasses = await Class.countDocuments();

        const totalSubjects = await Subject.countDocuments();

        res.render("dashboard", {

            title:PAGE.DASHBOARD,

            totalStudents,

            totalTeachers,

            totalClasses,

            totalSubjects

        });

    } catch (error) {

        console.log(error);

        res.status(500).send("Unable to load dashboard");

    }

};

// ====================================
// Admin Profile
// ====================================

const showAdminProfile = async (req, res) => {

    try {

        const admin = await Admin.findById(req.session.admin.id);

        res.render("admin/profile/profile", {

            layout: "layouts/adminLayout",

            title: "My Profile",

            admin

        });

    } catch (error) {

        console.log(error);

        res.status(500).send("Unable to load profile");

    }

};

// ====================================
// Edit Profile Page
// ====================================

const showEditAdminProfile = async (req, res) => {

    try {

        const admin = await Admin.findById(req.session.admin.id);

        res.render("admin/profile/edit", {

            layout: "layouts/adminLayout",

            title: "Edit Profile",

            admin,

            errors: []

        });

    } catch (error) {

        console.log(error);

        res.status(500).send("Unable to load profile");

    }

};

// ====================================
// Change Password Page
// ====================================

const showChangePassword = async (req, res) => {

    try {

        const admin = await Admin.findById(req.session.admin.id);

        res.render("admin/profile/changePassword", {

            layout: "layouts/adminLayout",

            title: "Change Password",

            admin,

            error: null,

            success: null

        });

    } catch (error) {

        console.log(error);

        res.status(500).send("Unable to load page");

    }

};

// ====================================
// Update Admin Profile
// ====================================

const updateAdminProfile = async (req, res) => {

    try {

        const { name, mobile, gender } = req.body;

        await Admin.findByIdAndUpdate(

            req.session.admin.id,

            {

                name,

                mobile,

                gender

            }

        );

        // Session Update

        req.session.admin.name = name;
        req.session.admin.mobile = mobile;
        req.session.admin.gender = gender;

        res.redirect("/dashboard/profile");

    }

    catch (error) {

        console.log(error);

        res.status(500).send("Unable to update profile");

    }

};

// ====================================
// Update Password
// ====================================

const updatePassword = async (req, res) => {

    try {

        const {

            currentPassword,

            newPassword,

            confirmPassword

        } = req.body;

        const admin = await Admin.findById(

            req.session.admin.id

        );

        const isMatch = await bcrypt.compare(

            currentPassword,

            admin.password

        );

        if (!isMatch) {

            return res.render(

                "admin/profile/changePassword",

                {

                    layout: "layouts/adminLayout",

                    title: "Change Password",

                    admin,

                    error: "Current Password is incorrect.",

                    success: null

                }

            );

        }

        if (newPassword !== confirmPassword) {

            return res.render(

                "admin/profile/changePassword",

                {

                    layout: "layouts/adminLayout",

                    title: "Change Password",

                    admin,

                    error: "Passwords do not match.",

                    success: null

                }

            );

        }

        admin.password = newPassword;

        await admin.save();

        req.session.destroy((err) => {

    if (err) {

        return res.redirect("/dashboard/change-password");

    }

    res.clearCookie("connect.sid");

    return res.redirect("/login/admin");

});

    }

    catch (error) {

        console.log(error);

        res.status(500).send("Unable to change password");

    }

};

module.exports = {

    showDashboard,

    showAdminProfile,

    showEditAdminProfile,

    updateAdminProfile,

    showChangePassword,

    updatePassword

};