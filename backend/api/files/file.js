const restful = require("node-restful");
const mongoose = restful.mongoose;

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = restful.model("File", fileSchema);
