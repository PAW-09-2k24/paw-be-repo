// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === "development") {
      await mongoose.connect(process.env.MONGODB_URI);
    } else if (process.env.NODE_ENV === "production") {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  } catch (err) {
    console.error(err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
