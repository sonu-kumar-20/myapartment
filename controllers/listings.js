console.log("🔑 MAP_TOKEN:", process.env.MAP_TOKEN);

const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geoCodingClient = mbxGeocoding({ accessToken: mapToken });

// GET all listings with optional fuzzy search
module.exports.allListingPage = async (req, res) => {
  const { search } = req.query;
  let allListings = [];

  if (search) {
    console.log("we are in fuzzy Atlas Search");

    allListings = await Listing.aggregate([
      {
        $search: {
          index: "default", // Replace with your actual index name if different
          text: {
            query: search,
            path: ["title", "location", "city"],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 1,
            }
          }
        }
      }
    ]);
  } else {
    console.log("we are in else block (no search)");
    allListings = await Listing.find({});
  }

  res.render('listings/index.ejs', { allListings, search });
};

// GET form for creating new listing
module.exports.newListingForm = async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to add listings");
    return res.redirect("/login");
  }
  res.render('listings/new.ejs');
};

// POST to create a new listing
module.exports.newCreateedList = async (req, res) => {
  let response = await geoCodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  const features = response.body.features;

  if (features.length === 0) {
    console.log("No features found.");
    req.flash("error", "Location not found.");
    return res.redirect("/listings/new");
  }

  const geometry = features[0].geometry;

  const url = req.file.path;
  const filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = geometry;

  await newListing.save();

  req.flash("success", "New Listing is added");
  res.redirect('/listings');
};

// GET form to edit a listing
module.exports.editListingForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render('listings/edit.ejs', { listing });
};

// PUT update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Your listing is updated");
  res.redirect(`/listings/${id}`);
};

// DELETE listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing is deleted");
  res.redirect('/listings');
};

// GET single listing detail page
module.exports.showListingDetail = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Your listing does not exist");
    return res.redirect('/listings');
  }

  res.render('listings/show.ejs', { listing });
};
