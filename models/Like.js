require("../config/db.connection");

const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema(
    {
        numLikes: {
            type: Number,
            min: 0,
            default:0,
        },
        post: {
            type: mongoose.Types.ObjectId,
            ref: "Post",
        },
        userArr: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],

    },
    { timestamps: true }
);

likeSchema.index({'$**': 'text'});
const Like = mongoose.model("Like", likeSchema);
module.exports = Like;