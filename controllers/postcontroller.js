const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", async (req, res, next) => {
    try {
        let foundPosts = await Post.find().populate("user");
        const context = {
            posts: foundPosts,
            searchTerm: req.query.q,
        }
        res.render("posts/gallery", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }


})


module.exports = router;