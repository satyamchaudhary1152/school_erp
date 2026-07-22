const express = require("express");

const router = express.Router();

const { requireTeacher } = require("../middleware/auth");

const {

    showTeacherDashboard,
    showTeacherProfile,
    showEditTeacherProfile,
    updateTeacherProfile,

    // Change Password
    showTeacherChangePassword,
    updateTeacherPassword

} = require("../controllers/teacherDashboardController");


// =====================================
// Teacher Dashboard
// =====================================

router.get(

    "/dashboard",

    requireTeacher,

    (req,res,next)=>{

        res.locals.layout="layouts/teacherLayout";

        next();

    },

    showTeacherDashboard

);


// =====================================
// My Profile
// =====================================

router.get(

    "/profile",

    requireTeacher,

    showTeacherProfile

);


// =====================================
// Edit Profile
// =====================================

router.get(

    "/profile/edit",

    requireTeacher,

    showEditTeacherProfile

);


// =====================================
// Update Profile
// =====================================

router.put(

    "/profile",

    requireTeacher,

    updateTeacherProfile

);


// =====================================
// Teacher Change Password
// =====================================

router.get(

    "/change-password",

    requireTeacher,

    showTeacherChangePassword,

);

router.put(

    "/change-password",

    requireTeacher,

    updateTeacherPassword

);

module.exports = router;