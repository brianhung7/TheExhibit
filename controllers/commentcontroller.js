const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const Comment = require("../models/Comment");

// create POST route

router.post("/", async (req, res, next) => {
    try {
        //If user is logged in, use their id, otherwise use anonymous user
        if (req.session.currentUser) {
            req.body.user = req.session.currentUser.id;
        } else {
            return res.render("404");
        }
        let foundPost = await Post.findById(req.body.post);
        let addPostCount = ++foundPost.numComments;
        foundPost = await Post.findByIdAndUpdate(req.body.post,
            { numComments:addPostCount },
            { new: true },
        );
        
        await Comment.create(req.body, (error, createdComment) => {
            if (error) {
                console.log(error);
                req.error = error;
                return next();
            }
            return res.redirect(`/gallery/${req.body.post}`);
        });
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});


module.exports = router;