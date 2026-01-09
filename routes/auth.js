const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../utils/WrapAsync");
const AuthController = require("../controllers/auth");
const passport = require("passport");

router
  .route("/register")
  .get(AuthController.registerForm)
  .post(WrapAsync(AuthController.register));

router
  .route("/login")
  .get(AuthController.loginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: {
        type: "error_msg",
        msg: "Invalid Username or Passowrd",
      },
    }),
    AuthController.login
  );

router.post("/logout", AuthController.logout);

module.exports = router;
