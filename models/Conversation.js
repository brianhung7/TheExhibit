require("../config/db.connection");
// require mongoose
const mongoose = require("mongoose");
// set up schema
const conversationSchema = new mongoose.Schema(
    {
        userArr: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
    },
    { timestamps: true }
);

// use schema in model
const Conversation = mongoose.model("Conversation", conversationSchema);
// export out model
module.exports = Conversation;