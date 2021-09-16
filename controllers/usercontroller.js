const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Like = require("../models/Like");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

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
        res.redirect("/users/cart");
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
        for (let i = 0; i < foundUser.cart.length; i++) {
            let foundPost = await Post.findById(foundUser.cart[i]).populate('user');
            cartContents.push(foundPost);
        }
        //Calculate total price of cart
        let totalCartPrice = 0;
        for (let i = 0; i < cartContents.length; i++) {
            totalCartPrice += cartContents[i].price;
        }
        const context = {
            cart: cartContents,
            key: process.env.STRIPE_PUBLISHABLE_KEY,
            totalCartPrice: totalCartPrice * 100,
        }
        res.render("shopping/cart", context);

    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//Cart delete item 
router.get("/cart/:index/remove", async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.currentUser.id);
        foundUser.cart.splice(req.params.index, 1);
        await User.findByIdAndUpdate(
            req.session.currentUser.id,
            {
                cart: foundUser.cart,
            },
            { new: true },
        )

        res.redirect("/users/cart");
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//STRIPE CHECKOUT
router.post('/payment', async (req, res) => {
    const foundUser = await User.findById(req.session.currentUser.id);
    let cartContents = [];
    for (let i = 0; i < foundUser.cart.length; i++) {
        let foundPost = await Post.findById(foundUser.cart[i]).populate('user');
        cartContents.push(foundPost);
    }
    let totalCartPrice = 0;
    for (let i = 0; i < cartContents.length; i++) {
        totalCartPrice += cartContents[i].price;
    }
    await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: req.session.currentUser.username,
        address: {
            line1: "123 Fake Street",
            postal_code: "90012",
            city: "Los Angeles",
            state: "California",
            country: "United States"
        }
    })
        .then((customer) => {
            return stripe.charges.create({
                amount: totalCartPrice * 100,
                description: 'The Exhibit Purchase',
                currency: 'USD',
                customer: customer.id
            });
        })
        .then(async (charge) => {
            //pushing all user cart array items into purchases array and finding seller associated with each post
            
            for (let i = 0; i < foundUser.cart.length; i++) {
                foundUser.purchases.push(foundUser.cart[i]);
                let soldPost = await Post.findById(foundUser.cart[i]);
                let foundSeller = await User.findById(soldPost.user);
                foundSeller.sales.push(foundUser.cart[i]);
                //Updating seller's sales array
                await User.findByIdAndUpdate(
                    soldPost.user,
                    {
                        sales: foundSeller.sales,
                    },
                    { new: true },
                )
            }
            //setting context for rendering before deleting cart contents
            context = {
                cart: cartContents,
                totalCartPrice: totalCartPrice,
            }
            //empty the cart array
            foundUser.cart = [];
            //updating buyer purchase array and emptying cart array
            await User.findByIdAndUpdate(
                req.session.currentUser.id,
                {
                    purchases: foundUser.purchases,
                    cart: foundUser.cart,
                },
                { new: true },
            )
            res.render("shopping/receipt", context); // If no error occurs 
        })
        .catch((err) => {
            res.send(err)    // If some error occurs 
        });
})


//DEPRECATED AFTER STRIPE SETUP, KEEPING HERE JUST IN CASE
//Purchases PUT route (move cart items into purchases array||ALSO have to move cart items into other SELLERS SALES array)
router.put("/purchases", async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.session.currentUser.id);
        //pushing all user cart array items into purchases array and finding seller associated with each post
        for (let i = 0; i < foundUser.cart.length; i++) {
            foundUser.purchases.push(foundUser.cart[i]);
            let soldPost = await Post.findById(foundUser.cart[i]);
            let foundSeller = await User.findById(soldPost.user);
            foundSeller.sales.push(foundUser.cart[i]);
            //Updating seller's sales array
            await User.findByIdAndUpdate(
                soldPost.user,
                {
                    sales: foundSeller.sales,
                },
                { new: true },
            )
        }
        //empty the cart array
        foundUser.cart = [];
        //updating buyer purchase array and emptying cart array
        await User.findByIdAndUpdate(
            req.session.currentUser.id,
            {
                purchases: foundUser.purchases,
                cart: foundUser.cart,
            },
            { new: true },
        )

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
        for (let i = 0; i < foundUser.purchases.length; i++) {
            let foundPost = await Post.findById(foundUser.purchases[i]).populate('user');
            purchaseContents.push(foundPost);
        }
        const context = {
            purchases: purchaseContents
        }
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
        for (let i = 0; i < foundUser.sales.length; i++) {
            let foundPost = await Post.findById(foundUser.sales[i]).populate('user');
            saleContents.push(foundPost);
        }
        const context = {
            sales: saleContents,
        }
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
        let likes = [];
        for (let i = 0; i < userPosts.length; i++) {
            let foundLike = await Like.findOne({ post: `${userPosts[i]._id}` });
            likes.push(foundLike);
        }
        let isFollowing = false;
        if (req.session.currentUser) {
            for (let i = 0; i < foundUser.followers.length; i++) {
                if (foundUser.followers[i] == req.session.currentUser.id) {
                    isFollowing = true;
                }
            }
        }
        const context = {
            posts: userPosts,
            userProfile: foundUser,
            isFollowing: isFollowing,
            likes: likes,
        };
        res.render("users/profile", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
});

//User liked posts profile route
router.get("/:id/likedposts", async (req, res, next) => {
    try {
        const likedPosts = await Like.find({ userArr: req.params.id });
        const foundUser = await User.findById(req.params.id);
        const postArr = [];
        let allLikes = [];
        let isFollowing = false;
        if (req.session.currentUser) {
            for (let i = 0; i < foundUser.followers.length; i++) {
                if (foundUser.followers[i] == req.session.currentUser.id) {
                    isFollowing = true;
                }
            }
        }
        for (i = 0; i < likedPosts.length; i++) {
            postArr.push(await Post.findById(likedPosts[i].post));
        }
        context = {
            posts: postArr,
            userProfile: foundUser,
            likes: likedPosts,
            isFollowing: isFollowing,
        }
        res.render("users/profile", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//Update User Info GET route
router.get("/:id/update", async (req, res, next) => {
    try {
        const foundUser = await User.findById(req.params.id);
        if (!req.session.currentUser || foundUser._id != req.session.currentUser.id) {
            const context = {
                error: { message: "You don't belong here. You tried to update a profile that wasn't yours." },
            };
            return res.render("404", context);
        }
        const context = {
            user: foundUser,
        }
        return res.render("users/profileupdate", context);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//Update User Info put route
router.put("/:id/update", async (req, res, next) => {
    try {
        let foundUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            });
        req.session.currentUser = {
            id: foundUser._id,
            username: foundUser.username,
            avatar: foundUser.avatar,
            biography: foundUser.biography
        };
        return res.redirect(`/users/${req.params.id}`);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//Follow PUT
router.put("/:id/follow", async (req, res, next) => {
    try {
        //Update current user's following array
        let updatedFollowingsArr = req.session.currentUser.followings;
        updatedFollowingsArr.push(req.params.id);
        await User.findByIdAndUpdate(
            req.session.currentUser.id,
            {
                followings: updatedFollowingsArr,
            },
            {
                new: true,
            }
        )
        //Update followed user's follower array
        let foundUser = await User.findById(req.params.id);
        foundUser.followers.push(req.session.currentUser.id);
        await User.findByIdAndUpdate(
            req.params.id,
            {
                followers: foundUser.followers,
            },
            {
                new: true,
            }
        )
        res.redirect(`/users/${req.params.id}`);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})

//Unfollow PUT
router.put("/:id/unfollow", async (req, res, next) => {
    try {
        //Update current user's following array
        let updatedFollowingsArr = req.session.currentUser.followings;
        let indexFoundUser = updatedFollowingsArr.indexOf(req.params.id);
        updatedFollowingsArr.splice(indexFoundUser, 1);
        await User.findByIdAndUpdate(
            req.session.currentUser.id,
            {
                followings: updatedFollowingsArr,
            },
            {
                new: true,
            }
        )
        //Update followed user's follower array
        let foundUser = await User.findById(req.params.id);
        let indexFoundOtherUser = foundUser.followers.indexOf(req.session.currentUser.id)
        foundUser.followers.splice(indexFoundOtherUser, 1);
        await User.findByIdAndUpdate(
            req.params.id,
            {
                followers: foundUser.followers,
            },
            {
                new: true,
            }
        )
        res.redirect(`/users/${req.params.id}`);
    } catch (error) {
        console.log(error);
        req.error = error;
        return next();
    }
})


module.exports = router;