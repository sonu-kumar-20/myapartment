require('dotenv').config(); // Always first

const express = require('express');
const app = express();

// 🌟 TRUST PROXY (for Render)
app.set('trust proxy', 1);

const path = require('path');

const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const session = require('express-session');
const dbUrl = process.env.MONGO_ATLASURL
const mongoStore = require('connect-mongo')
// i added this line


const flash = require("connect-flash");
const passport = require('./config/passport');
const ExpressError = require('./utils/ExpressError');

// Import routes
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');



// View engine and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = mongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  // i changed here true to false
  saveUninitialized: false,
  cookie: {
  expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ✅ this is important
  sameSite: 'lax'
}

};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  next();
});

// Flash and user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {

  res.redirect('/listings');
});


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render('listings/error.ejs', { message });
});

module.exports = app;









