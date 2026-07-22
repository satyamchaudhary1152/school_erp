const express = require("express");
const router = express.Router();

const {

    authMiddleware

} = require("../middleware/authMiddleware");

const {

    showDashboard,

    // Admin Profile
    showAdminProfile,
    showEditAdminProfile,
    updateAdminProfile,

    // Change Password
    showChangePassword,
    updatePassword

} = require("../controllers/dashboardController");

// ====================================
// Dashboard
// ====================================

router.get(
    "/",
    authMiddleware,
    showDashboard
);

// ====================================
// Admin Profile
// ====================================

router.get(
    "/profile",
    authMiddleware,
    showAdminProfile
);

router.get(
    "/profile/edit",
    authMiddleware,
    showEditAdminProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateAdminProfile
);

// ====================================
// Change Password
// ====================================

router.get(
    "/change-password",
    authMiddleware,
    showChangePassword
);

router.put(
    "/change-password",
    authMiddleware,
    updatePassword
);

module.exports = router;