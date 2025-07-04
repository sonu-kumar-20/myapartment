const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geoCodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.allListingPage = async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index.ejs', { allListings });
}

module.exports.newListingForm =async(req, res) => {
  if(!req.isAuthenticated()){
    req.flash("error","You must be logged for add listings");
    return  res.redirect("/login");
  }
  res.render('listings/new.ejs')
 
 
}

module.exports.newCreateedList =async (req, res) => {

let response = await geoCodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send()

const features = response.body.features;

if (features.length > 0) {
  const geometry = features[0].geometry;
  // console.log("Geometry object:", geometry);
  // console.log("Coordinates:", geometry.coordinates);
} else {
  console.log("No features found.");
}




  let url = req.file.path;
  let filename = req.file.filename;
//console.log(url,".....",filename);
  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;
  newListing.image = {url,filename};

  newListing.geometry = response.body.features[0].geometry;
  
 let savedListing =  await newListing.save();
   
  req.flash("success" ,"New Listing is added");
  res.redirect('/listings');
}

module.exports.editListingForm = async (req, res) => {
   
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error","Listing you requested is not exist");
    res.redirect("/listings");
  }
 

  res.render('listings/edit.ejs', { listing });
}

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
 let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });


 if( typeof req.file !== "undefined"){
     let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();
 }

  req.flash("success" ,"Your listing is Updated");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success" ," Listing is deleted");
  res.redirect('/listings');
}

module.exports.showListingDetail = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path: "reviews",
    populate:{
      path: "author",
    }
  }).populate("owner");
  if (!listing) {
   req.flash("error","your listing does not exist")
   res.redirect('/listings')
  }
  res.render('listings/show.ejs', { listing });
}