require("../config/db.connection");
const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Please add text to your comment'],
        },
        conversation: {
            type: mongoose.Types.ObjectId,
            ref: "Conversation",
        },
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        receiver: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;