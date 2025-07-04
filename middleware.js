const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema ,reviewSchema} = require("./schema.js");
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","you must be logged in ");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{

  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.checkLoggedIn = (req, res, next) => {
  if (req.session.user) { // Assuming you store user info in req.session.user
      req.flash('error', 'You are already logged in.');
      return res.redirect('/dashboard'); // Redirect to a page like the dashboard
  }
  next();
};

module.exports.isOwner = async (req,res,next) =>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the Owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


module.exports.isReviewAuthor = async (req,res,next) =>{
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!res.locals.currUser || !review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the Owner");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
