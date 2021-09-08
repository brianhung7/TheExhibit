require("../config/db.connection");
// require mongoose
const mongoose = require("mongoose");
// set up schema
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

// use schema in model
const Message = mongoose.model("Message", messageSchema);
// export out model
module.exports = Message;