const Student = require("../models/Student");

const teacherStudentAccess = async (req, res, next) => {

    try {

        const assignment = req.assignment;

        const student = await Student.findById(req.params.id);

        if (!student) {

            return res.status(404).send("Student Not Found");

        }

        const sameClass =
            student.class.toString() === assignment.class._id.toString();

        const sameSection =
            student.section.toString() === assignment.section._id.toString();

        if (!sameClass || !sameSection) {

            return res.status(403).send("Access Denied");

        }

        req.student = student;

        next();

    }

    catch (error) {

        next(error);

    }

};

module.exports = teacherStudentAccess;