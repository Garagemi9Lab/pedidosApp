const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const tokenConfig = require("../../config/token");
const User = require("../user/user");

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(401)
        .json({ error: "Usuário não encontrado com esse email" });

    //Valida a senha ==============================================
    if (!(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = await jwt.sign({ id: user.id }, tokenConfig.SECRET, {
      expiresIn: tokenConfig.EXPIRES_IN
    });

    return res.json({ user, token: token });
  }

  async authenticate(req, res, next) {
    const stringAuthenticate = req.headers.authorization;

    if (!stringAuthenticate)
      return res.status(401).json({ error: "Token não encontrado!" });

    const [, token] = stringAuthenticate.split(" ");

    if (!token) return res.status(401).json({ error: "Token não encontrado!" });

    try {
      const decoded = jwt.verify(token, tokenConfig.SECRET);
      req.userId = decoded.id;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Token invalido!" });
    }
  }
}

module.exports = new SessionController();
