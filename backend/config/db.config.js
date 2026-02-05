const mongoose = require("mongoose");

const connectDb = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    if (!MONGO_URI) throw new Error("Mongo URI is not defined");
    await mongoose.connect(MONGO_URI);
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
