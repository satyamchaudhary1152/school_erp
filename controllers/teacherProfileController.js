const bcrypt = require("bcrypt");

const Teacher = require("../models/Teacher");

const asyncHandler = require("../middleware/asyncHandler");

// ====================================
// Show Profile
// ====================================

const showProfile = asyncHandler(async (req, res) => {

    const teacher = await Teacher.findById(req.session.admin.id);

    if (!teacher) {

        return res.redirect("/login");

    }

    res.render("teacher/profile/profile", {

        layout: "layouts/teacherLayout",

        title: "My Profile",

        teacher,

        module: "teacher"

    });

});

// ====================================
// Show Edit Profile
// ====================================

const showEditProfile = asyncHandler(async (req, res) => {

    const teacher = await Teacher.findById(req.session.admin.id);

    if (!teacher) {

        return res.redirect("/login");

    }

    res.render("teacher/profile/edit", {

        layout: "layouts/teacherLayout",

        title: "Edit Profile",

        teacher,

        errors: [],

        module: "teacher"

    });

});

// ====================================
// Update Profile
// ====================================

const updateProfile = asyncHandler(async (req, res) => {

    const {

        name,

        phone,

        qualification,

        experience

    } = req.body;

    const teacher = await Teacher.findById(req.session.admin.id);

    if (!teacher) {

        return res.redirect("/login");

    }

teacher.name = name;

teacher.email = email.toLowerCase();

teacher.phone = phone;

teacher.gender = gender;

teacher.qualification = qualification;

teacher.experience = experience;

teacher.joiningDate = joiningDate;

    await teacher.save();

    // Update Session

    req.session.admin.name = teacher.name;

    req.session.admin.email = teacher.email;

    res.redirect("/teacher/profile/profile");

});

// ====================================
// Show Change Password
// ====================================

const showChangePassword = asyncHandler(async (req, res) => {

    res.render("teacher/profile/changePassword", {

        layout: "layouts/teacherLayout",

        title: "Change Password",

        error: null,

        success: null,

        module: "teacher"

    });

});

// ====================================
// Change Password
// ====================================

const changePassword = asyncHandler(async (req, res) => {

    const {

    name,

    email,

    phone,

    gender,

    qualification,

    experience,

    joiningDate

} = req.body;

    const teacher = await Teacher.findById(req.session.admin.id);

    if (!teacher) {

        return res.redirect("/login");

    }

    const isMatch = await teacher.comparePassword(currentPassword);

    if (!isMatch) {

        return res.render("teacher/profile/changePassword", {

            layout: "layouts/teacherLayout",

            title: "Change Password",

            error: "Current password is incorrect.",

            success: null,

            module: "teacher"

        });

    }

    if (newPassword !== confirmPassword) {

        return res.render("teacher/profile/changePassword", {

            layout: "layouts/teacherLayout",

            title: "Change Password",

            error: "New password and Confirm password do not match.",

            success: null,

            module: "teacher"

        });

    }

    teacher.password = newPassword;

    await teacher.save();

    res.render("teacher/profile/changePassword", {

        layout: "layouts/teacherLayout",

        title: "Change Password",

        error: null,

        success: "Password changed successfully.",

        module: "teacher"

    });

});

module.exports = {

    showProfile,

    showEditProfile,

    updateProfile,

    showChangePassword,

    changePassword

};