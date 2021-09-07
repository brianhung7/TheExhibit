require("../config/db.connection");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please Provide An Email Address."],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please Provide A Password"],
        },
        username: { type: String, required: true, unique: true },
        avatar: {
            type: String,
            default:
                "https://i.imgur.com/eYlOXmc.png",
        },
        biography: {
            type: String,
        },
        cart: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        purchases: [{
            type: mongoose.Types.ObjectId,
            ref: "Post"
        }],
        sales: [{
            type: mongoose.Types.ObjectId,
            ref: "Post"
        }],

    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;