const mongoose = require('mongoose');

const connectDB = async (dbUrl) => {
  try {
    await mongoose.connect(dbUrl);

  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB;
