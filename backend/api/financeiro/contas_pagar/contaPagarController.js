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
        produto,
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
      const contasPagar = await ContaPagar.find();
      return res.json(contasPagar);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  async findOne(req, res) {
    try {
      const contaPagar = await ContaPagar.findOne({ _id: req.params.id });
      if (!contaPagar) {
        return res.status(400).json({ error: "Contas a pagar not found" });
      }

      return res.json(contaPagar);
    } catch (error) {
      return res.status(500).json({ error: "Find contas a pagar failed" });
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

  async getFornecedor(req, res) {
    try {
      const contasPagar = await ContaPagar.find({
        fornecedor: req.params.id
      });

      if (!contasPagar) {
        return res
          .status(500)
          .json({ error: "Contas a Pagar not found" + req.params.id });
      }

      return res.json(contasPagar);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Search contas-a-pagar failed" });
    }
  }

  async quitarParcela(req, res) {
    try {
      const { valor, data } = req.body;
      const contaApagar = await ContaPagar.findOne(
        {
          "parcelas._id": req.params.id
        },
        function(err, docs) {
          docs.parcelas.forEach(doc => {
            if (doc._id == req.params.id) {
              doc.quitacao = { ok: true };
              console.log(doc);
              return res.json({ parcela: doc });
            }
          });
        }
      );
      //

      return res.json({ contaApagar });

      const updateContaPagar = await ContaPagar.findOneAndUpdate(
        { parcelas: { _id: req.params.id } },
        {
          quitacao: {
            valor_pago: valor,
            data
          }
        }
      );

      return res.json({ updateContaPagar });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed" });
    }
  }
}

module.exports = new contaPagarController();
