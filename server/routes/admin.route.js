const {
  dashBoard,
  addUser,
  postUser,
  userView,
  editUser,
  putUser,
  deleteUser,
  search,
  postSearch,
  // about,
} = require("../controllers/admin.controller");

const router = require("express").Router();
//
//
// Home route for admin dashboard
router.get("/", dashBoard);
// router.get("/about", about);
//
//
// Add user get route
router.get("/add", addUser);
//
//
router.post("/add", postUser);
//
//
//
router.get("/view/:id", userView);
//
//
// User data editor page
router.get("/edit/:id", editUser);
//
//
// Update user data
router.put("/edit/:id", putUser);
//
//
//
// Delete user
router.delete("/edit/:id", deleteUser);
//
//
//search user get route
router.get("/search", search);
//
//search user post route
router.post("/search", postSearch);
//
//
//
module.exports = router;
