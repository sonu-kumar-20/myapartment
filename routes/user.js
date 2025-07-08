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

  // ✅ Generate 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  // Remove old OTPs if any
  await Otp.deleteMany({ email });

  // Save new OTP in DB
  await Otp.create({ email, otp, expiresAt });

  // ✅ Professional, branded email content
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #333;">Welcome to <span style="color:#007bff;">MyApartment</span>!</h2>
      <p>Your one-time password (OTP) for email verification is:</p>
      <h1 style="background-color: #f2f2f2; padding: 10px; width: fit-content;">${otp}</h1>
      <p style="color: #555;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
      <br/>
      <p>Thanks,<br/>The <strong>MyApartment</strong> Team</p>
    </div>
  `;

  // Send email
  await sendMail(email, "Verify your email - MyApartment", html);

  // Store form data temporarily in session
  req.session.signupData = { username, email, password };

  // Render OTP input page
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
