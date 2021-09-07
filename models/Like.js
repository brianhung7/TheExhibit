require("../config/db.connection");
// require mongoose
const mongoose = require("mongoose");
// set up schema
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
// use schema in model
const Like = mongoose.model("Like", likeSchema);
// export out model
module.exports = Like;