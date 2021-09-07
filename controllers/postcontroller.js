const express = require("express");
const router = express.Router();
const Post = require("../models/Post");


//gallery view
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

//create post GET route
router.get("/new", (req, res) => {
    let context = {};
    if (!req.session.currentUser) {
        context = {
            error: { message: "You need to login" },
        };
        return res.render("404", context);
    }
    return res.render("posts/new", context);
});

//create post POST route
router.post("/", async (req, res, next) => {
    try {
        req.body.user = req.session.currentUser.id;
        const newPost = await Post.create(req.body);
        return res.redirect(`/gallery/${newPost.id}`);
    } catch (error) {
        const context = {
            error,
        };
        return res.render("posts/new", context);
    }
});




module.exports = router;