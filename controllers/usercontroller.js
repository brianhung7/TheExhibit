const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Likes = require("../models/Like")

//User profile route
router.get("/:id", async (req, res, next) => {
    try {
        const userPosts = await Post.find({ user: req.params.id }).populate("user");
        const foundUser = await User.findById(req.params.id);
        
        const context = {
            posts: userPosts,
            userProfile: foundUser,
        };
        res.render("users/profile", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});



module.exports = router;