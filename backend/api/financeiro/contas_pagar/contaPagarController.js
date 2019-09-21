const Fornecedor = require("../../cliente/cliente");
const Produto = require("../../produto/produto");
const ContaPagar = require("./contaPagar");
const { addDays, parseISO } = require("date-fns");
const filter = {
  $or: [
    { tipo: ["provider"] },
    { tipo: ["customer", "provider"] },
    { tipo: ["provider", "customer"] }
  ]
};

class contaPagarController {
  async store(req, res) {
    try {
      const {
        fornecedor,
        produto,
        descricao = "Item a pagar",
        data_emissao = new Date(),
        valor,
        qtde_parcelas
      } = req.body;

      const vlrParcela = Number(valor) / Number(qtde_parcelas);
      //Criar parcelas
      const parcelas = [];
      for (let i = 1; i <= Number(qtde_parcelas); i++) {
        parcelas.push({
          data_vencimento: addDays(parseISO(data_emissao), i * 30),
          valor: vlrParcela.toFixed(2),
          quitacao: null
        });
      }

      //Cria conta-a-pagar
      const contaApagar = await ContaPagar.create({
        fornecedor,
        descricao,
        data_emissao,
        valor,
        parcelas
      });

      return res.json(contaApagar);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Create conta-a-pagar failed" });
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
      const provider = await Provider.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          upsert: true
        }
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

module.exports = new contaPagarController();
