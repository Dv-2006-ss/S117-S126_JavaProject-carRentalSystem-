require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  console.log("EMAILS:", users.map(u => u.email));
  process.exit();
}

check();
