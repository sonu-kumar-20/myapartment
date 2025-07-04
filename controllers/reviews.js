const Listing = require('../models/listing.js');

const Review = require("../models/review.js");




module.exports.newReviewAdd = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;


  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success" ,"Your review is added");
  res.redirect(`/listings/${listing._id}`);
}


module.exports.newReviewDelete=async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success" ,"Your review is deleted");
  res.redirect(`/listings/${id}`);
}