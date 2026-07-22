const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },

    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    students: [

        {

            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
                required: true
            },

            status: {
                type: String,
                enum: ["Present", "Absent"],
                default: "Present"
            }

        }

    ]

}, {

    timestamps: true

});

attendanceSchema.index(
    {
        class: 1,
        section: 1,
        date: 1
    },
    {
        unique: true
    }
);

module.exports = mongoose.model("Attendance", attendanceSchema);