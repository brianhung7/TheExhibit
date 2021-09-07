const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");

//User profile route
router.get("/:id", async (req, res, next) => {
    try {
        const userPosts = await Post.find({ user: req.params.id }).populate("user");
        const foundUser = await User.findById(req.params.id);
        let allLikes = [];
        for (let i = 0; i < userPosts.length; i++) {
            let foundLike = await Like.findOne({ post: `${userPosts[i]._id}` });
            allLikes.push(foundLike);
        }
        const context = {
            posts: userPosts,
            userProfile: foundUser,
            likes: allLikes,
        };
        res.render("users/profile", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});



module.exports = router;