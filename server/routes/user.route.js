const User = require("../models/user.model");

const {
  profile,
  login,
  register,
  registerPost,
  loginPost,
  home,
  logout,
  userapi,
} = require("../controllers/user.controller");

const userRouter = require("express").Router();
//
//
//
userRouter.get("/", home);
userRouter.get("/user", userapi);
// 
//
//
userRouter.get("/profile", profile);
//
//
//
userRouter.get("/login", login);
userRouter.post("/login", loginPost);

userRouter.get("/register", register);
userRouter.post("/register", registerPost);
//
//
userRouter.get("/logout", logout);
//
//
//
module.exports = userRouter;
