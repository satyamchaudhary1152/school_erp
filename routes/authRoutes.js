const express = require("express");

const router = express.Router();

const {

    showAdminLoginPage,

    showTeacherLoginPage,

    loginAdmin,

    loginTeacher,

    logoutAdmin,

    logoutTeacher

} = require("../controllers/authController");

// =============================
// Landing Redirect
// =============================

router.get("/login", (req,res)=>{

    res.redirect("/");

});

// =============================
// Admin Login
// =============================

router.get("/login/admin", showAdminLoginPage);

router.post("/login/admin", loginAdmin);

// =============================
// Teacher Login
// =============================

router.get("/login/teacher", showTeacherLoginPage);

router.post("/login/teacher", loginTeacher);

// =============================
// Logout
// =============================

router.get("/logout", logoutAdmin);

router.get("/teacher/logout", logoutTeacher);

module.exports = router;