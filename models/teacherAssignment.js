const mongoose = require("mongoose");

const teacherAssignmentSchema = new mongoose.Schema({

    teacher: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Teacher",

        required: [true, "Teacher is required"]

    },

    class: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Class",

        required: [true, "Class is required"]

    },

    section: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Section",

        required: [true, "Section is required"]

    },

    subject: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Subject",

        required: [true, "Subject is required"]

    },

    role:{

    type:String,

    enum:[

        "Subject Teacher",

        "Class Teacher"

    ],

    default:"Subject Teacher",

    required:true

},

    status: {

        type: String,

        enum: ["Active", "Inactive"],

        default: "Active"

    }

},{
    timestamps:true
});

teacherAssignmentSchema.index({
    teacher:1,
    class:1,
    section:1,
    subject:1

},{
    unique:true
});

module.exports = mongoose.model(
    "TeacherAssignment",
    teacherAssignmentSchema
);