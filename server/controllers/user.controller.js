const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const path = require("path");
//
//
//

const myPath = path.join(
  __dirname + "../../../views/Portfolio-Ryan/index.html"
);
const home = (req, res) => {
  res.sendFile(myPath);
};
const userapi = (req, res) => {
  res.render("home");
};
//
//
//
const profile = (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user; // retrieve user object from session
    return res.render("users/profile", { user });
  }
  res.redirect("/login");
};

// login get route
const login = (req, res) => {
  const messages = req.flash("info");
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  res.render("login", {
    messages,
  });
};

// Longin post route
const loginPost = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!user) {
      console.log(info.message);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log(err);
        return next(err);
      }

      return res.redirect("/profile"); // Redirect to user's profile page
    });
  })(req, res, next);
};

//
//Register get route
const register = (req, res) => {
  res.render("register");
};
//
//
//Register post route User
const registerPost = async (req, res) => {
  try {
    // Checking if user already exists
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(202).send("User is exist");
    // Password hashing
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      password: hashedPassword,
      details: req.body.details,
    });
    // await newUser.save();
    // res.status(201).send(newUser);
    await User.create(newUser);
    await req.flash("info", "Congrats! you successfully registerted");
    res.redirect("/login");
    //
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "User not created",
      data: error.message,
    });
  }
};

const logout = (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }
        res.clearCookie(); // Clear the cookie containing the user's token
        res.redirect("/login"); // Redirect to registration page after logout
      });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  home,
  userapi,
  profile,
  login,
  loginPost,
  register,
  registerPost,
  logout,
};
