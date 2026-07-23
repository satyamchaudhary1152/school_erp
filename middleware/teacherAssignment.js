const TeacherAssignment = require("../models/teacherAssignment");

const teacherAssignment = async (req, res, next) => {

    try {

        const assignment = await TeacherAssignment

            .findOne({

                teacher: req.session.admin.id,

                status: "Active"

            })

            .populate("class")

            .populate("section");

        if (!assignment) {

            return res.status(403).send("No Class Assigned To You.");

        }

        req.assignment = assignment;

        next();

    }

    catch (error) {

        next(error);

    }

};

module.exports = teacherAssignment;