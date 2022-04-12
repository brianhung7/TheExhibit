const { ObjectId } = require('mongodb');
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const User = require("../models/User");
const Post = require("../models/Post");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message")


let postImageArr = ["https://i.imgur.com/DfjlogK.jpeg", "https://i.imgur.com/HEujk59.jpeg", "https://i.imgur.com/or4cVlW.jpeg", "https://i.imgur.com/cmikV5d.jpeg","https://i.imgur.com/mvoNmjm.jpeg", "https://i.imgur.com/5yeBVeM.jpeg", "https://i.imgur.com/fjXFX93.jpeg", "https://i.imgur.com/k6WuSSw.jpeg", "https://i.imgur.com/1Wl9p9o.jpeg", "https://i.imgur.com/6f6ppuP.jpeg", "https://i.imgur.com/coIwWnF.jpeg", "https://i.imgur.com/PSX4oDf.jpeg", "https://i.imgur.com/oC6yZJc.jpeg", "https://i.imgur.com/NNT4asY.jpeg", "https://i.imgur.com/k2yiwkB.jpeg", "https://i.imgur.com/q7IouSd.jpeg", "https://i.imgur.com/66hCBxb.jpeg", "https://i.imgur.com/5c8J2kJ.jpeg", "https://i.imgur.com/kIT7Oky.jpeg", "https://i.imgur.com/hK4ucjG.jpeg", "https://i.imgur.com/3yoCPY3.jpeg"]
let usernameArr = ["BrianPham2k", "MuseumProcurer", "Exhibiter", "ArtLover", "MrPhotographer"];
let userIdArr = ['11393e18f5782064a676cb85', '21393e18f5782064a676cb85', '31393e18f5782064a676cb85', '41393e18f5782064a676cb85', '51393e18f5782064a676cb85',];
let bioArr = ["Come check out all of my gorgeous artwork! Be sure to follow me for updates!",
    "I love making art, it is a dream of mine to make gorgeous art ever since I was a child.",
    "Welcome to my profile! Please have a look around and leave a like on any piece you enjoy!",
    "I'm a photographer who has over 10 years of experience in the field, my first job was photographing my brother's wedding."];
let avatarArr = ["/resources/avatars/8.jpg", "/resources/avatars/7.png", "/resources/avatars/3.jpeg", "/resources/avatars/4.jpeg", "/resources/avatars/5.jpeg"];
const seedUsers = async () => {
    await User.deleteMany();
    for (let i = 0; i < usernameArr.length; i++) {
        await User.insertMany([
            {
                username: usernameArr[i],
                email: `${usernameArr[i]}@gmail.com`,
                password: 'admin',
                avatar: avatarArr[i],
                biography: bioArr[Math.floor(Math.random() * bioArr.length)],
                _id: ObjectId(userIdArr[i]),

            },
        ],
            function (error, createdUsers) {
                if (error) return console.log(error);
            }
        )

    }
}


let postTitleArr = ["Taste of Life", "Glimpse of Life", "Destiny", "A Dream", "Immersion", "Life in Art", "Artistry", "Art of Life", "The Dream", "Captivation","Motivation","Safe Haven","The Little Things","One Big Leap","The Journey","The Destination","The Beginning","A New Start", "The Dawn","Journey's End","A Fresh Start"];
let postDescriptionArr = ["Please enjoy this piece I have been working on for awhile. It has been a long time in the making and I spent a lot of time on this! I've spent so much effort on this and I'm glad to have shared it with all of you. Have a great day. Leave a like if you enjoyed it!", "I hope you all enjoy this project I've been working on. I drew inspiration from a recent journey I took last summer that was so motivating to me that I had to capture it in this piece. I can't wait take another soul-searching journey again. Please be sure to follow me to keep up to date on my art.", "This work has been the result of innumerable hours of sweat and tears. I hope you all appreciate the imagery and elegance that I have captured with this piece or at least feel some of these emotions that have been the center of my efforts. Thank you. Please look forward to my next work by following me for future updates!", "I made this after a recent vacation trip and I was so inspired by my journey. I had to capture this moment of beauty. I threw myself into my work and this is what I came up with. Thank you for having a look. Please leave a like if you enjoyed this piece and checkout my artist profile for more pieces.", "This piece has been a labor of love for me and I hope to share it with all of you. In between work, life, my relationship and my children finding the time to complete this piece was a struggle. However I'm glad to have finished it and this is what I came up with. If you've enjoyed my work be sure to check out the rest of my work. Thank you.", "This has been a long time in the making, I hope you all find serenity like I have while working on this. I looked deep in myself to find out what spoke to me and this is what I came up with. I hope that you all have some kind of serenity in your own life that will inspire you like I have been inspired."];
let postTagsArr = ["art", "beauty", "photo", "photography", "landscape", "nature", "people", "life", "artistry", "animals", "calm", "vacation", "trip", "awesome", "inspire", "inspiration"];
let numSeedTags = 4;
let numSeedComments = 4;
const seedPosts = async () => {
    try {
        await Post.deleteMany();
        for (let i = 0; i < postImageArr.length; i++) {
            let tagList = [];
            for (let j = 0; j < numSeedTags; j++) {
                randTag = postTagsArr[Math.floor(Math.random() * postTagsArr.length)];
                if (!tagList.includes(randTag)) {
                    tagList.push(randTag);
                }
            }
            const newPosts = await Post.insertMany(
                [
                    {
                        title: postTitleArr[Math.floor(Math.random() * (postTitleArr.length - 1))],
                        image: postImageArr[i],
                        description: postDescriptionArr[Math.floor(Math.random() * postDescriptionArr.length)],
                        user: userIdArr[Math.floor(Math.random() * (userIdArr.length))],
                        tags: tagList,
                        numComments: numSeedComments,
                        price: Math.floor(Math.random() * 500),
                    },

                ],
                function (error, createdPosts) {
                    if (error) return console.log(error);
                }
            )
        }
    } catch (error) {
        console.log(error);
    }
}





let commentArr = ["Wow! This is some amazing work!", "Hey I'm looking to make a purchase, please message me.", "Wow, that's incredible, I'm going to follow you now.", "This is incredible, I look forward to your future work. Followed you my friend!", "I've bought so many works from this artist and I've never been disappointed.", "This is awesome, I just liked it and followed you!", "Keep up the amazing work, just bought one for myself.", "This would look great in my living room, going to make a purchase very soon!", "I bought this and received it last week, it looks amazing in my dining room. Thank you!", "This brings back memories of some of the best times in my life, absolutely amazing how art can make you feel emotions like this.", "An absolutely awe-inspiring piece, I can't wait to see what you come up with next.", "This is some of your finest work yet!", "This shows an incredible mastery of your work, thank you for sharing it with us.", "This is truly breathtaking, I'm going to buy it right now!", "This is a mesmerizing piece, truly gorgeous.", "I can't wait to see what you come up with next!", "I'm jealous of your innate ability for art.", "This is so absolutely cool!", "Wonderful work!", "Tremendous, awe-inspiring, beautiful, gorgeous."];
const seedComments = async () => {
    try {
        await Comment.deleteMany();
        let idAllPosts = await Post.find({}, { _id: 1 });
        let postIdArr = await idAllPosts.map(a => a._id);
        for (let i = 0; i < numSeedComments; i++) {
            for (let i = 0; i < postImageArr.length; i++) {
                await Comment.insertMany(
                    [
                        {
                            content: commentArr[Math.floor(Math.random() * commentArr.length)],
                            post: postIdArr[i],
                            user: userIdArr[Math.floor(Math.random() * userIdArr.length)],
                        },
                    ]
                )
            }
        }
    } catch (error) {
        console.log(error);
    }
}


const seedLikes = async () => {
    try {
        await Like.deleteMany();
        let idAllPosts = await Post.find({}, { _id: 1 });
        let postIdArr = await idAllPosts.map(a => a._id);
        for (let i = 0; i < postImageArr.length; i++) {
            await Like.insertMany(
                [
                    {
                        numLikes: Math.floor(Math.random() * 100),
                        post: postIdArr[i],
                        userArr: userIdArr[Math.floor(Math.random() * (userIdArr.length - 1))],
                    }
                ]
            )
        }

    } catch (error) {
        console.log(error);
    }
}






const seed = async () => {
    try {
        await Message.deleteMany();
        await Conversation.deleteMany();
        await seedUsers();
        await seedPosts();
        await seedComments();
        await seedLikes();
    } catch (error) {
        console.log(error);
    }
}

seed();





