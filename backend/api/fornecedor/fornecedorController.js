const Provider = require("../cliente/cliente");
const Produtos = require("../produto/produto");
const filter = {
  $or: [
    { tipo: ["provider"] },
    { tipo: ["customer", "provider"] },
    { tipo: ["provider", "customer"] }
  ]
};

class FornecedorController {
  async store(req, res) {
    try {
      let campos = req.body;
      campos.codigo = (await Provider.find()).length + 1;
      const provider = await Provider.create(campos);

      return res.json(provider);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Create provider failed" });
    }
  }

  async list(req, res) {
    try {
      const providers = await Provider.find(filter);
      return res.json(providers);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async findOne(req, res) {
    try {
      const provider = await Provider.findOne({ codigo: req.params.codigo });
      if (!provider) {
        return res.status(400).json({ error: "Provider not found" });
      }

      return res.json(provider);
    } catch (error) {
      return res.status(500).json({ error: "Find provider failed" });
    }
  }

  async count(req, res) {
    await Provider.count(filter, (error, value) => {
      if (error) {
        return res.status(500).json({ error: [error] });
      } else {
        return res.json({ value });
      }
    });
  }

  async update(req, res) {
    try {
      const { __v, ...data } = req.body;

      console.log(data);
      const provider = await Provider.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { upsert: true }
      );

      return res.json(provider);
    } catch (err) {
      return res.status(500).json({ errors: "Update provider failed" });
    }
  }

  async getProdutos(req, res) {
    try {
      const fornecedor = await Provider.findOne({ _id: req.params.codigo });

      if (!fornecedor) {
        return res
          .status(500)
          .json({ error: "Provider not found" + req.params.codigo });
      }

      const produtos = await Produtos.find({ cliente: fornecedor._id });
      return res.json(produtos);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Search products failed" });
    }
  }

  async getByName(req, res) {
    try {
      const providers = await Provider.find()
        .where({
          nome: new RegExp(req.query.nome, "i")
        })
        .or([
          { tipo: ["provider"] },
          { tipo: ["customer", "provider"] },
          { tipo: ["provider", "customer"] }
        ]);

      return res.json(providers);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Search providers failed" });
    }
  }
}

module.exports = new FornecedorController();
