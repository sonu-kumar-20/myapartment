const mongoose = require('mongoose');


const Review = require('./review.js');
const User = require('./user.js');

const { Schema } = mongoose; // Destructure Schema from mongoose

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
<<<<<<< HEAD
  country: { type: String, required: true },
=======
  city: { type: String, required: true },
>>>>>>> faf72e3 (Initial commit to new repo)
  image: {
   url: String,
   filename: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
   type: Schema.Types.ObjectId,
   ref: "User",
  },
   geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      
    },
    coordinates: {
      type: [Number],
     
    }
  },
});


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews} });
  }
})

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
