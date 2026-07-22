const authMiddleware = (req, res, next) => {

    if (!req.session.admin) {

        return res.redirect("/");

    }

    next();

};

const adminMiddleware = (req, res, next) => {

    if (!req.session.admin) {

        return res.redirect("/login/admin");

    }

    if (req.session.admin.role !== "admin") {

        return res.redirect("/teacher/dashboard");

    }

    next();

};

const teacherMiddleware = (req, res, next) => {

    if (!req.session.admin) {

        return res.redirect("/login/teacher");

    }

    if (req.session.admin.role !== "teacher") {

        return res.redirect("/dashboard");

    }

    next();

};

module.exports = {

    authMiddleware,

    adminMiddleware,

    teacherMiddleware

};