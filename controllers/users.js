
const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
 const { saveRedirectUrl } = require('../middleware.js');


module.exports.signupUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser,(err)=>{
      if(err){
        return next(err);
      }
<<<<<<< HEAD
        req.flash("success", "Welcome to Wanderlust!");
=======
        req.flash("success", "Welcome to My Home Please don't share otp with any one");
>>>>>>> faf72e3 (Initial commit to new repo)
    res.redirect("/listings");
    })
  
  } catch (e) {
    req.flash("error", e.message);
    res.redirect('/signup');
  }
}

module.exports.loginUser = async (req, res) => {
<<<<<<< HEAD
  req.flash("success", "Welcome to WanderLust");
=======
  req.flash("success", "Welcome to My Home");
>>>>>>> faf72e3 (Initial commit to new repo)
  let redirectUrl = res.locals.redirectUrl || "/listings";

  res.redirect(redirectUrl);
}

module.exports.logoutUser  = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out successfully.");
    res.redirect("/listings");
  });
}