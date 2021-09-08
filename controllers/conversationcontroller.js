const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


//All Conversations GET
router.get("/", async (req, res, next) => {
    try {


        res.render("conversation/all");
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})


//create message GET
router.get("/message/new/:id", async (req, res, next) => {
    try {
        // console.log(`you are sending a message to ${req.params.id}`);
        // console.log(`you are sending a message FROM ${req.session.currentUser.id}`);
        receiver = await User.findById(req.params.id);
        context = {
            receiver: receiver,
        }


        res.render("conversation/createmessage", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//create message POST
router.post("/message/new/:id", async (req, res, next) => {
    try {
        // console.log(`you are sending a message to ${req.params.id}`);
        // console.log(`you are sending a message FROM ${req.session.currentUser.id}`);
        let foundConversation = [];
        let userArray = [req.session.currentUser.id, req.params.id];
        foundConversation = await Conversation.find({ userArr: userArray });

        if (foundConversation.length === 0) {
            foundConversation = await Conversation.create({ userArr: userArray });
            // console.log(`made new conversation ${foundConversation}`);
        }
        // console.log(req.body);
        let newMessage = await Message.create({
            receiver:req.params.id,
            sender: req.session.currentUser.id,
            conversation: foundConversation._id,
            text:req.body.text, 
        })
        // console.log(foundConversation);
        receiver = await User.findById(req.params.id);
        context = {
            receiver: receiver,
        }


        res.render("conversation/createmessage", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})


module.exports = router;