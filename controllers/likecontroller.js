const express = require("express");
const router = express.Router();
const Like = require("../models/Like");

//Increase like counter for a post
router.put("/:id", async (req, res, next) => {
    try {
        const foundLikes = await Like.findOne({ post: req.params.id });
        //Checks if user already liked a post
        let userInArray = false
        for (i = 0; i < foundLikes.userArr.length; i++) {
            if (foundLikes.userArr[i] == req.session.currentUser.id) {
                userInArray = true;
            }
        }
        if (!userInArray) {
            foundLikes.numLikes++;
            foundLikes.userArr.push(req.session.currentUser.id);
            await Like.findByIdAndUpdate(
                foundLikes._id,
                {
                    numLikes: foundLikes.numLikes,
                    userArr: foundLikes.userArr,
                },
                { new: true },
            )
        }
        return res.redirect(`/gallery/${req.params.id}`);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});

//Decrease like counter for a post
router.put("/:id/unlike", async (req, res, next) => {
    try {
        const foundLikes = await Like.findOne({ post: req.params.id });
        //Checks if user already liked a post
        let userInArray = false;
        // let userLikeArrIndex = 0;
        for (i = 0; i < foundLikes.userArr.length; i++) {
            if (foundLikes.userArr[i] == req.session.currentUser.id) {
                userInArray = true;
                foundLikes.userArr.splice(i, 1);
            }
        }
        //runs only if user liked the post, can't spam it to keep unliking post
        if (userInArray) {
            foundLikes.numLikes--;
            await Like.findByIdAndUpdate(
                foundLikes._id,
                {
                    numLikes: foundLikes.numLikes,
                    userArr: foundLikes.userArr,
                },
                { new: true },
            )
        }

        return res.redirect(`/gallery/${req.params.id}`);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});


module.exports = router;