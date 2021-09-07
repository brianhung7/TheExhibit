require("../config/db.connection");
// require mongoose
const mongoose = require("mongoose");
// set up schema
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

// use schema in model
const Comment = mongoose.model("Comment", CommentSchema);
// export out model
module.exports = Comment;