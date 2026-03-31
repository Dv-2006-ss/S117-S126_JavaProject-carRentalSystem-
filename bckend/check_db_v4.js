require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, { password: 1, email: 1 });
    console.log("EMAILS IN DB:", JSON.stringify(users, null, 2));
  } catch (err) { }
  process.exit();
}

check();
