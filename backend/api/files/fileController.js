const File = require("../files/file");

class FileController {
  async store(req, res) {
    try {
      const { originalname: name, filename: path } = req.file;

      const file = await File.create({
        name,
        path
      });

      return res.json(file);
    } catch (err) {
      return res.status(500).json({ error: "Import file failed" });
    }
  }
}

module.exports = new FileController();
