require("../config/db.connection");

const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Please add text to your comment'],
        },
        post: {
            type: mongoose.Types.ObjectId,
            ref: "Post",
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;