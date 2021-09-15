const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment")
const Like = require("../models/Like");
const User = require('../models/User');
const axios = require('axios');

const handleUploadFile = require('../utils/handleUploadFile');



//gallery view
router.get("/", async (req, res, next) => {
    try {
        //Finding posts by all or by query
        let foundPosts = [];
        let likes = [];
        if (req.query.q) {
            const query = { $text: { $search: `${req.query.q}` } };
            foundPosts = await Post.find(query).populate("user");
            for (let i = 0; i < foundPosts.length; i++) {
                let foundLike = await Like.findOne({ post: `${foundPosts[i]._id}` });
                likes.push(foundLike);
            }
        } else {
            foundPosts = await Post.find().populate("user");
            likes = await Like.find();
        }
        //Finding followings
        let followings = [];
        let foundFollower = {};
        if (req.session.currentUser) {
            let foundUser = await User.findById(req.session.currentUser.id);
            for (let i = 0; i < foundUser.followings.length; i++) {
                foundFollower = await User.findById(foundUser.followings[i]._id);
                followings.push(foundFollower);
            }
        }
        const context = {
            posts: foundPosts,
            searchTerm: req.query.q,
            followings: followings,
            feedMessage: null,
            likes: likes,
        }
        res.render("posts/gallery", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//feed view
router.get("/feed", async (req, res, next) => {
    try {
        //Finding posts by all or by query
        let foundPosts = [];
        //Finding followings
        let followings = [];
        let foundFollower = {};
        let likes = []
        if (req.session.currentUser) {
            let foundUser = await User.findById(req.session.currentUser.id);
            for (let i = 0; i < foundUser.followings.length; i++) {
                foundFollower = await User.findById(foundUser.followings[i]._id);
                followings.push(foundFollower);
            }
            //Finding posts associated with followings
            foundPosts = await Post.find({ user: { $in: foundUser.followings } }).populate("user");
            for (let i = 0; i < foundPosts.length; i++) {
                let foundLike = await Like.findOne({ post: `${foundPosts[i]._id}` });
                likes.push(foundLike);
            }
        }
        if (followings == 0) {
            var feedMessage = "Nothing on your following feed, try following some people first!"
        }
        const context = {
            posts: foundPosts,
            searchTerm: req.query.q,
            followings: followings,
            feedMessage: feedMessage,
            likes: likes,
        }
        res.render("posts/gallery", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})


//museum view
router.get("/museum/:id", async (req, res, next) => {
    try {
        const url = `https://picsum.photos/v2/list?page=${req.params.id}&limit=10`
        const response = await axios(url);
        const data = response.data;
        let followings = [];
        let foundFollower = {};
        if (req.session.currentUser) {
            let foundUser = await User.findById(req.session.currentUser.id);
            for (let i = 0; i < foundUser.followings.length; i++) {
                foundFollower = await User.findById(foundUser.followings[i]._id);
                followings.push(foundFollower);
            }
        }
        if (followings == 0) {
            var feedMessage = "Nothing on your following feed, try following some people first!"
        }
        //blocking going negative pages
        let pageNumber = req.params.id;
        if(req.params.id == 1 ){
            pageNumber = 2;
        }
        let next = parseInt(pageNumber) + 1;
        context = {
            posts:data,
            followings: followings,
            feedMessage: feedMessage,
            searchTerm: null,
            previous: pageNumber - 1,
            next: next,
        }
        res.render("posts/museum",context);
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
router.post("/", handleUploadFile, async (req, res, next) => {
    try {
        req.body.user = req.session.currentUser.id;
        req.body.tags = req.body.tags.split(',')
        const newPost = await Post.create(req.body);
        await Like.create({ post: newPost._id });
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
        const foundLikes = await Like.findOne({ post: req.params.id });
        //checking if current user has liked the post
        let isLiked = false;
        if (req.session.currentUser) {
            for (let i = 0; i < foundLikes.userArr.length; i++) {
                if (req.session.currentUser.id == foundLikes.userArr[i]) {
                    isLiked = true;
                }
            }
        }
        const context = {
            post: foundPost,
            comments: allComments,
            likes: foundLikes,
            isLiked: isLiked,
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
    req.body.tags = req.body.tags.split(',')
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
        await Like.deleteMany({ post: req.params.id });
        return res.redirect("/gallery");
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});



module.exports = router;