const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


//All Conversations GET
router.get("/", async (req, res, next) => {
    try {
        let foundAllConversations = await Conversation.find({ userArr: req.session.currentUser.id });

        //Removing current user from userArr in Conversation
        for (let i = 0; i < foundAllConversations.length; i++) {
            let currentUserIndex = foundAllConversations[i].userArr.indexOf(req.session.currentUser.id);
            foundAllConversations[i].userArr.splice(currentUserIndex, 1);
        }

        //grabbing user info from Conversation userArr
        let userConversations = [];
        for (let i = 0; i < foundAllConversations.length; i++) {
            let foundUser = await User.findById(foundAllConversations[i].userArr[0]);
            userConversations.push(foundUser);
        }

        context = {
            userConversations: userConversations,
            conversations: foundAllConversations,
        }

        res.render("conversation/all", context);
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

        let userArray = [req.session.currentUser.id, req.params.id];
        let foundConversation = await Conversation.findOne({ userArr: { $all: userArray } });
        // console.log(foundConversation);

        if (!foundConversation) {
            foundConversation = await Conversation.create({ userArr: userArray });
            // console.log(`made new conversation ${foundConversation}`);
        }
        // console.log(req.body);
        let newMessage = await Message.create({
            receiver: req.params.id,
            sender: req.session.currentUser.id,
            conversation: foundConversation._id,
            text: req.body.text,
        })
        // console.log(foundConversation);
        receiver = await User.findById(req.params.id);
        // context = {
        //     receiver: receiver,
        // }


        res.redirect(`/conversation/${foundConversation._id}`);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})


//Single Conversation GET
router.get("/:id", async (req, res, next) => {
    try {
        let foundConversation = await Conversation.findById(req.params.id);
        let foundMessages = await Message.find({ conversation: req.params.id });
        let currentUserMessages = [];
        let otherUserMessages = [];
        for (let i = 0; i < foundMessages.length; i++) {
            if (foundMessages[i].sender == req.session.currentUser.id) {
                currentUserMessages.push(foundMessages[i]);
            } else {
                otherUserMessages.push(foundMessages[i]);
            }
        }
        const currentUser = await User.findById(req.session.currentUser.id);
        //setting other person the user is sending messages to
        let otherUser = {};
        if (foundConversation.userArr[0] != req.session.currentUser.id) {
            otherUser = await User.findById(foundConversation.userArr[0]);
        } else {
            otherUser = await User.findById(foundConversation.userArr[1]);
        }

        //grabbing all user conversations
        let foundAllConversations = await Conversation.find({ userArr: req.session.currentUser.id });
        //Removing current user from userArr in Conversation
        for (let i = 0; i < foundAllConversations.length; i++) {
            let currentUserIndex = foundAllConversations[i].userArr.indexOf(req.session.currentUser.id);
            foundAllConversations[i].userArr.splice(currentUserIndex, 1);
        }
        //grabbing user info from Conversation userArr
        let userConversations = [];
        for (let i = 0; i < foundAllConversations.length; i++) {
            let foundUser = await User.findById(foundAllConversations[i].userArr[0]);
            userConversations.push(foundUser);
        }
        context = {
            allMessages: foundMessages,
            // currentUserMessages: currentUserMessages,
            // otherUserMessages: otherUserMessages,
            currentUser: currentUser,
            otherUser: otherUser,
            userConversations:userConversations,
            conversations:foundAllConversations,
            currentConversationId: req.params.id,
        }


        res.render("conversation/showconversation", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//Single Conversation POST
// router.post("/:id", async (req, res, next) => {
//     try {
//         let foundConversation = await Conversation.findById(req.params.id);

//         let otherUser = {};
//         if (foundConversation.userArr[0] != req.session.currentUser.id) {
//             otherUser = await User.findById(foundConversation.userArr[0]);
//         } else {
//             otherUser = await User.findById(foundConversation.userArr[1]);
//         }

//         let newMessage = await Message.create({
//             receiver: otherUser._id,
//             sender: req.session.currentUser.id,
//             conversation: req.params.id,
//             text: req.body.text,
//         })
//         res.redirect(`/conversation/${req.params.id}`);
//     } catch (error) {
//         console.log(error);
//         req.error = error;
//         return next();
//     }

// })


module.exports = router;