require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function check() {
  try {
    console.log("Connecting...");
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, { password: 0 });
    console.log("USERS IN DB (" + users.length + "):", JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
  process.exit();
}

check();
