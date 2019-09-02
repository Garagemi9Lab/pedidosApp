const restful = require("node-restful");
const mongoose = restful.mongoose;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  createdAt: { type: String, default: Date.now() }
});

module.exports = restful.model("User", userSchema);
