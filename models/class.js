const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({

    className: {
        type: String,
        required: [true, "Class Name is required"],
        unique: true,
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

module.exports = mongoose.model("Class", classSchema);