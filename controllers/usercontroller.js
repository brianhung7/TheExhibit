const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Likes = require("../models/Like")

//Cart PUT route (add new item)
router.put("/cart/:id", async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.currentUser.id);
        foundUser.cart.push(req.params.id);
        await User.findByIdAndUpdate(
            req.session.currentUser.id,
            { 
             cart: foundUser.cart,
            },
            { new: true },
        )
        // console.log(`PUSHED ${req.params.id} into ${foundUser}`);
        res.render("shopping/cart");
    }
    catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})


//Cart GET view route
router.get("/cart", async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.currentUser.id);

        let cartContents = [];
        for(let i =0;i<foundUser.cart.length;i++){
            let foundPost = await Post.findById(foundUser.cart[i])
            cartContents.push(foundPost);
        }
        // console.log(`USER: ${foundUser}`);
        const context = {
            cart: cartContents
        }
        // console.log(`context: ${context.cart}`);
        res.render("shopping/cart", context);

    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//Purchases PUT route (move cart items into purchases array||ALSO have to move cart items into other SELLERS SALES array)
router.put("/purchases", async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.currentUser.id);
        //pushing all user cart array items into purchases array
        for(let i = 0;i<foundUser.cart.length;i++){
            foundUser.purchases.push(foundUser.cart[i]);
        }
        //empty the cart array
        foundUser.cart = [];
        await User.findByIdAndUpdate(
            req.session.currentUser.id,
            { 
             purchases: foundUser.purchases,
             cart: foundUser.cart,
            },
            { new: true },
        )
        console.log(`PUSHED ${foundUser.cart} into ${foundUser}`);
        res.redirect("/users/purchases");
    }
    catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//Purchases GET view route
router.get("/purchases", async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.currentUser.id);

        let purchaseContents = [];
        for(let i =0;i<foundUser.purchases.length;i++){
            let foundPost = await Post.findById(foundUser.purchases[i])
            purchaseContents.push(foundPost);
        }
        // console.log(`USER: ${foundUser}`);
        const context = {
            purchases: purchaseContents
        }
        // console.log(`context: ${context.purchases}`);
        res.render("shopping/purchases", context);

    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})


//Sales GET view route
router.get("/sales", async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.currentUser.id);

        let saleContents = [];
        for(let i =0;i<foundUser.sales.length;i++){
            let foundPost = await Post.findById(foundUser.sales[i])
            saleContents.push(foundPost);
        }
        // console.log(`USER: ${foundUser}`);
        const context = {
            sales: saleContents,
        }
        // console.log(`context: ${context.purchases}`);
        res.render("shopping/sales", context);

    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

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