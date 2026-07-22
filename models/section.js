const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({

    sectionName: {
        type: String,
        required: [true, "Section Name is required"],
        trim: true
    },

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: [true, "Class is required"]
    },

    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        min: [1, "Capacity must be greater than 0"]
    },

    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Section", sectionSchema);