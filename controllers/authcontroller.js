const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// register GET
router.get("/register", (req, res) => {
    //if user is logged in, redirect to gallery
    if (req.session.currentUser) {
        return res.redirect("/gallery");
    }
    return res.render("auth/register");
});

// login GET
router.get("/login", (req, res) => {
    //if user is logged in, redirect to gallery
    if (req.session.currentUser) {
        return res.redirect("/gallery");
    }
    return res.render("auth/login");
});

//register POST
router.post("/register", async (req, res) => {
    try {
        // check if user exists
        const foundUser = await User.exists({
            $or: [{ email: req.body.email }, { username: req.body.username }],
        });
        // if user does exist redirect to login
        if (foundUser) {
            // return res.redirect("/login");
            const context = {
                error: { message: "Email/user already exists. Please login." },
            };
            return res.render("auth/login", context);
        }
        //encryption
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        await User.create(req.body);

        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});


//login POST
router.post("/login", async (req, res) => {
    try {
        const foundUser = await User.findOne({ email: req.body.email });
        if (!foundUser) {
            console.log("User not found");
            return res.redirect("/register");
        }
        // NOTE Authentication to check if passwords match
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if (!match) {
            const context = {
                error: { message: "Incorrect Password" },
            };
            return res.render("auth/login", context);
        };

        // NOTE Credentials
        req.session.currentUser = {
            id: foundUser._id,
            username: foundUser.username,
            avatar: foundUser.avatar,
            followings: foundUser.followings,
            followers: foundUser.followers,
            cart: foundUser.cart,
            biography: foundUser.biography,

        };
        return res.redirect("/gallery");
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});

// logout GET
router.get("/logout", async (req, res) => {
    try {
        await req.session.destroy();
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
        return res.send(error);
    }
});



module.exports = router;