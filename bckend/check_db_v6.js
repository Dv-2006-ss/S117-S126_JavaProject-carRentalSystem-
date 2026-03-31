require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  console.log("USERS:", JSON.stringify(users.map(u => ({ email: u.email, name: u.name })), null, 2));
  process.exit();
}

check();
