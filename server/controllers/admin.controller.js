const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
//
//
//
// Home controller
const dashBoard = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user;
      if (user.admin === false) {
        const user = req.user; // retrieve user object from session
        return res.render("users/profile", { user });
      } else {
        const messages = await req.flash("info");
        let perPage = 2;
        let page = req.query.page || 1;
        const users = await User.aggregate([{ $sort: { updatedAt: 1 } }])
          .skip(perPage * page - perPage)
          .limit(perPage)
          .exec();
        const count = await User.count();
        return res.render("index", {
          users,
          current: page,
          pages: Math.ceil(count / perPage),
          messages,
        });
      }
    }
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};
//
//
//
// about
// const about = (req, res) => {
//   res.render("admin/about");
// };
//
//
//
// Add user controller
const addUser = (req, res) => {
  res.render("admin/adduser");
};
//
// Post route to add user controller
const postUser = async (req, res) => {
  // Checking if user already exists
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(202).send("User is exist");
  // Password hashing
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
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
    await req.flash("info", "New user has been added");
    res.redirect("/admin");
    //
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "User not created",
      data: error.message,
    });
  }
};
//
//
//
// View user profile
const userView = async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ _id: req.params.id });
    res.render("admin/view.ejs", {
      user,
    });
  }
  res.redirect("/login");
};
//
//
// //(req, res) => {
//   if (req.isAuthenticated()) {
//     const user = req.user; // retrieve user object from session
//     return res.render("users/profile", { user });
//   }
//   res.redirect("/login");
// };
// user editor page
const editUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  const msg = req.query.msg; // get message from query string
  res.render("admin/edit.ejs", {
    user,
    msg,
  });
};
//
//
// user editor page put route
const putUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details,
        updatedAt: Date.now(),
      }
    );
    await res.redirect(`/admin/edit/${req.params.id}?msg=success`);
  } catch (error) {
    console.log(error);
  }
};
//
//
//
const deleteUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};
//
//
//
const search = async (req, res) => {
  try {
    res.render("search");
  } catch (error) {
    console.log(error);
  }
};
//
//
// Searching user from data base
const postSearch = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const user = await User.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", {
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
//
//
//
module.exports = {
  // about,
  dashBoard,
  addUser,
  postUser,
  userView,
  editUser,
  putUser,
  deleteUser,
  search,
  postSearch,
};
