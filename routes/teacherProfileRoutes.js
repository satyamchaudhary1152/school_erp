const express = require("express");

const router = express.Router();

const { requireTeacher } = require("../middleware/auth");

const {

    showProfile,

    showEditProfile,

    updateProfile,

    showChangePassword,

    changePassword

} = require("../controllers/teacherProfileController");

// ==============================
// Profile
// ==============================

router.get(

    "/profile",

    requireTeacher,

    showProfile

);

// ==============================
// Edit Profile
// ==============================

router.get(

    "/profile/edit",

    requireTeacher,

    showEditProfile

);

router.put(

    "/profile",

    requireTeacher,

    updateProfile

);

// ==============================
// Change Password
// ==============================

router.get(

    "/change-password",

    requireTeacher,

    showChangePassword

);

router.put(

    "/change-password",

    requireTeacher,

    changePassword

);

module.exports = router;