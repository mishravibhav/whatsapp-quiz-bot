const config = require('../config/global.config')
const mongoose = require('mongoose');

const connectDB = async () => {

    // console.log(process.env)
  try {
    await mongoose.connect(config.database.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
