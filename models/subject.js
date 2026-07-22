const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

    subjectName: {
        type: String,
        required: [true, "Subject Name is required"],
        trim: true
    },

    subjectCode: {
        type: String,
        required: [true, "Subject Code is required"],
        unique: true,
        uppercase: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Subject", subjectSchema);