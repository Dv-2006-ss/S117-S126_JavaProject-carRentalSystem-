const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected:", conn.connection.host);

  } catch (err) {
    console.error("❌ MongoDB Connection Error:");
    console.error(err.message);

    // retry instead of crash
    console.log("🔁 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;