const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require('../utils/wrapAsync.js');
const listingController = require('../controllers/listings.js');
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const {validateReview} = require("../middleware.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
 const upload = multer({storage})
// Get all listings


router.route("/").get( wrapAsync(listingController.allListingPage))
 .post(isLoggedIn,upload.single('image'),  validateListing,wrapAsync(listingController.newCreateedList));








router.get('/new',isLoggedIn, listingController.newListingForm);

router.route("/:id")
.get( wrapAsync(listingController.showListingDetail))
.put(isLoggedIn,isOwner, upload.single('image'),validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))




router.get('/:id/edit', isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));


module.exports = router;
