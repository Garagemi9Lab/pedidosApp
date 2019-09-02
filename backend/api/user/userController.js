const _ = require("lodash");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenConfig = require("../../config/token");
const User = require("./user");

class userController {
  async store(req, res) {
    try {
      const existsUser = await User.findOne({ email: req.body.email });
      if (existsUser)
        return res.status(401).json({ error: "Email já está cadastrado!" });

      //Cria hash da senha
      req.body.password_hash = await bcrypt.hash(req.body.password, 8);

      const user = await User.create(req.body);
      const token = await jwt.sign({ id: user.id }, tokenConfig.SECRET, {
        expiresIn: tokenConfig.EXPIRES_IN
      });
      return res.json({ user, token: token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Falha ao cadastrar usuario" });
    }
  }

  async update(req, res) {
    return res.json();
  }
}

module.exports = new userController();
