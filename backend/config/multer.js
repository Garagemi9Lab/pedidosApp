const multer = require("multer");
const crypto = require("crypto");
const Path = require("path");

const varExport = {
  storage: multer.diskStorage({
    destination: Path.resolve(__dirname, "..", "tmp", "uploads"),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString("hex") + Path.extname(file.originalname));
      });
    }
  })
};

module.exports = varExport;
