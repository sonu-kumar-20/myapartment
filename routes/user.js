const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const  wrapAsync= require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const sendMail = require("../utils/sendMail.js");

const userController = require('../controllers/users.js'); // ✅ Corrected

const Otp = require("../models/otp");
const otpGenerator = require("otp-generator");

// Signup Page ka route h ye 

router.route('/signup')
.get( (req, res) => {
res.render("users/signup.ejs");
})
.post( wrapAsync(userController.signupUser));




// Send OTP Route
router.post("/send-otp", async (req, res) => {
  const { username, email, password } = req.body;
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false });
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.deleteMany({ email });
  await Otp.create({ email, otp, expiresAt });

  const html = `<h3>Your WanderLust OTP is <b>${otp}</b></h3><p>Valid for 5 minutes</p>`;
  await sendMail(email, "Verify your email", html);

  // Save form data in session
  req.session.signupData = { username, email, password };

  res.render("users/enterOtp", { email });
});

// Verify OTP Route
router.post("/verify-otp", async (req, res, next) => {
  const { email, otp } = req.body;
  const signupData = req.session.signupData;

  if (!signupData) {
    req.flash("error", "Session expired. Please signup again.");
    return res.redirect("/signup");
  }

  const found = await Otp.findOne({ email });

  if (!found || found.otp !== otp || found.expiresAt < new Date()) {
    req.flash("error", "Invalid or expired OTP");
    return res.redirect("/signup");
  }

  await Otp.deleteMany({ email });

  try {
    const newUser = new User({ email: signupData.email, username: signupData.username });
    const registeredUser = await User.register(newUser, signupData.password);

    req.login(registeredUser, err => {
      if (err) return next(err);
      delete req.session.signupData; // Clear session data
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    next(err);
  }
});


//login route h ye
router.route('/login')
.get((req, res) => {
  res.render("users/login.ejs");
})
.post( saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true,
}), userController.loginUser)


// Logout Route
router.get("/logout", userController.logoutUser);

module.exports = router;
