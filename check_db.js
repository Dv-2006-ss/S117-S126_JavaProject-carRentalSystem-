const mongoose = require("mongoose");
const User = require("./bckend/models/User");
require("dotenv").config({ path: "./bckend/.env" });

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({}, { password: 0 });
  console.log("USERS IN DB:", JSON.stringify(users, null, 2));
  process.exit();
}

check();
