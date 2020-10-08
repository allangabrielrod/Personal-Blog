const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    content: String,
    created: {
        type: Date,
        default: new Date()
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        fname: String,
        lname: String
    }
});

module.exports = mongoose.model("post", PostSchema);