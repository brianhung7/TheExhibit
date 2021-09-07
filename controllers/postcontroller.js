const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment")


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

//show single post
router.get("/:id", async (req, res, next) => {
    try {
        const foundPost = await Post.findById(req.params.id).populate("user");
        const allComments = await Comment.find({ post: req.params.id }).populate("post user");
        const context = {
            post: foundPost,
            comments: allComments,
        }
        return res.render("posts/show", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});

//update GET route
router.get("/:id/update", async (req, res, next) => {
    try {
        const foundPost = await Post.findById(req.params.id);
        const context = {
            post: foundPost,
        }
        //checking if user is not logged in or you are not the user who originally made the post
        if (!req.session.currentUser || foundPost.user != req.session.currentUser.id) {
            const context = {
                error: { message: "You don't belong here" },
            };
            return res.render("404", context);
        }
        return res.render("posts/update", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//update PUT route
router.put("/:id", (req, res, next) => {
    Post.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        {
            new: true,
        },
        (error, updatedPost) => {
            if (error) {
                console.log(error);
                req.error = error;
                return next();
            }
            return res.redirect(`/gallery/${updatedPost.id}`);
        }
    );
})

//delete route
router.delete("/:id", async (req, res, next) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        await Comment.deleteMany({ post: req.params.id });
        return res.redirect("/gallery");
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});



module.exports = router;