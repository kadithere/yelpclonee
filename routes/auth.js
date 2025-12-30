const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("auth/register");
});

// membuat user register
// router.post(
//   "/register",
//   WrapAsync(async (req, res) => {
//     try {
//       const { email, username, password } = req.body;
//       const user = new User({ email, username });
//       const registerUser = await User.register(user, password);
//       req.login(registerUser, (err) => {
//         if (err) return next(err);
//         req.flash("success_msg", "You are registered and can logged in");
//         res.redirect("/places");
//       });
//     } catch (error) {
//       req.flash("error_msg", error.message);
//       res.redirect("/register");
//     }
//   })
// );

router.post(
  "/register",
  WrapAsync(async (req, res, next) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);

    req.login(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success_msg", "You are registered and logged in");
      res.redirect("/places");
    });
  })
);

// user login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// if password and username user invalid and throw an error
// if valid redirect to places
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: {
      type: "error_msg",
      msg: "Invalid Username or Passowrd",
    },
  }),
  (req, res) => {
    req.flash("success_msg", "You are logged in");
    res.redirect("/places");
  }
);

// membuat routes logout
// jika user logout redirect ke halaman login
// router.post("/logout", (req, res) => {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     req.flash("success_msg", "You are logged out");
//     res.redirect("/login");
//   });
// });

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "You are logged out");
    res.redirect("/login");
  });
});

module.exports = router;
