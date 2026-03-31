require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function seedUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const email = "Ajay1305@gmail.com";
    const existing = await User.findOne({ email: { $regex: `^${email}$`, $options: "i" } });
    
    if (existing) {
      console.log("User already exists. Updating password...");
      const salt = await bcrypt.genSalt(10);
      existing.password = await bcrypt.hash("Test1234", salt);
      await existing.save();
      console.log("Password updated to: Test1234");
    } else {
      console.log("Creating user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Test1234", salt);
      
      const newUser = new User({
        name: "Dhairya Ajay S",
        companyName: "Velox Enterprise",
        email: email,
        password: hashedPassword
      });

      await newUser.save();
      console.log("✅ User created successfully!");
      console.log("Email: " + email);
      console.log("Password: Test1234");
    }

  } catch (err) {
    console.error("SEEDING FAILED:", err.message);
  }
  process.exit();
}

seedUser();
