require("./config/db");
require("./config/passport");
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cors = require("cors");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");

// requiring all routers
const adminRoute = require("./server/routes/admin.route");
const userRouter = require("./server/routes/user.route");
const app = express();

//middle ware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(methodOverride("_method"));
//
//
//
//Static file
app.use(express.static("public"));
//
//
// Express session
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat", // session secret
    resave: false,
    saveUninitialized: true,
    cookie: { _expires: 600000 }, // expires after 60 seconds
    store: MongoStore.create({
      mongoUrl: process.env.USER_MONGODB, // MongoDB connection URI
      collectionName: "sessions",
      expires: 600, // set the expiration time for the session to 60 seconds
    }),
  })
);
//
// Initializing passport and using express-session middleware
app.use(passport.initialize());
app.use(passport.session());
//
//
// Flash Messages
app.use(flash({ sessionKeyName: "flashMessage" }));
//
//
//Template engine
app.use(expressLayout);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");
//
//
//
//Routes
app.use("/admin", adminRoute);
app.use("/", userRouter);
//
//
//
//

app.use("*", (req, res) => {
  res.status(404).send(" <h1>404 Error</h1>");
});
//
//
//
module.exports = app;
