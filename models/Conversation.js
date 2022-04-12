require("../config/db.connection");
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        userArr: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
    },
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;