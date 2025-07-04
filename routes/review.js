

const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require('../utils/wrapAsync.js');
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reivewController = require('../controllers/reviews.js');

// ✅ Prevent 404 error if user tries to GET the review URL
router.get('/', (req, res) => {
  res.redirect(`/listings/${req.params.id}`);
});

// Add new review
router.post('/', validateReview, isLoggedIn, wrapAsync(reivewController.newReviewAdd));

// Delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reivewController.newReviewDelete));

module.exports = router;
