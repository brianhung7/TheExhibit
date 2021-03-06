//Server info

/* SECTION External modules */
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const multer = require('multer');
const upload = multer({dest: 'uploads/'});
require("dotenv").config();

/* SECTION module instance */
const app = express();

/* SECTION PORT  */
const PORT = process.env.PORT || 4000;


/* STRIPE SETUP */
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());




/* SECTION Internal Modules */
// const controllers = require("./controllers");
const postCtrl = require("./controllers/postcontroller.js");
const commentCtrl = require("./controllers/commentcontroller.js");
const authCtrl = require("./controllers/authcontroller");
const usersCtrl = require("./controllers/usercontroller");
const likesCtrl = require("./controllers/likecontroller");
const conversationCtrl = require("./controllers/conversationcontroller");

/* SECTION App Config */

app.set("view engine", "ejs");

//session controller
app.use(
  session({
    // this will store the cookies in the mongodb database
    // store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/theexhibit' }),
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    // secret key will sign the cookie for validation
    secret: process.env.SECRET,
    // secret: "safe password",
    resave: false,
    saveUninitialized: false,
    // cookie config
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // two weeks
    },
  })
);

/* SECTION Middleware */


// // NOTE this will add a variable called user to EVERY EJS file
app.use((req, res, next) => {
  res.locals.user = req.session.currentUser;
  return next();
});

// // create a location for our nav links
app.use(require("./utils/navlinks"));

app.use(express.static("public"));

app.use(upload.single('image'));

// // NOTE allow body data for all routes
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));




/* !SECTION */

// /* SECTION Routes */
app.use("/", authCtrl);
app.use("/gallery", postCtrl);
app.use("/comments", commentCtrl);
app.use("/users", usersCtrl);
app.use("/likes", likesCtrl);
app.use("/conversation", conversationCtrl);



app.get("/", (req, res, next) => {
  res.render("splash/splash");
})

// 404
app.get("/*", (req, res) => {
  const context = {
    error: req.error,
  };

  res.render("404", context);
});

app.listen(PORT, () =>
  console.log(`Listening for client requests on port ${PORT}`)
);