require("../config/db.connection");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please Provide a Title."],
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        image: {
            type: String,
            require: true,
        },
        description: {
            type: String,
        },
        tags:[{
            type: String,
        }],
        numComments:{
            type: Number,
            min: 0,
            default: 0,
        },
        price: {
            type: Number,
            min: 0,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);
postSchema.index({'$**': 'text'});
const Post = mongoose.model("Post", postSchema);

module.exports = Post;