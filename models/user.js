// const { required } = require('joi');
// const mongoose = require('mongoose');
// const schema = mongoose.Schema;
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new schema({
//   email:{
//     type: String,
//     required: true,
//   },
// });


// userSchema.plugin(passportLocalMongoose);

// module.exports = mongoose.model("User",userSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  // Username will be auto-managed by passport-local-mongoose
});

// Add username + hashed password fields + methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
