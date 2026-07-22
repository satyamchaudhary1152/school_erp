const requireLogin = (req, res, next) => {

    if (!req.session.admin) {

        return res.redirect("/login");

    }

    next();

};

const requireAdmin = (req, res, next) => {

    if (!req.session.admin) {

        return res.redirect("/login");

    }

    if (req.session.admin.role !== "admin") {

        return res.redirect("/teacher/dashboard");

    }

    next();

};

const requireTeacher = (req, res, next) => {

    if (!req.session.admin) {

        return res.redirect("/login");

    }

    if (req.session.admin.role !== "teacher") {

        return res.redirect("/dashboard");

    }

    next();

};

module.exports = {

    requireLogin,
    requireAdmin,
    requireTeacher

};