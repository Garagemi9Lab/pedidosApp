const _ = require("lodash");
const Produto = require("./produto");
const Cliente = require("../cliente/cliente");

async function store(req, res) {
  try {
    const campos = req.body;

    let prodsFornecedorCount = (await Produto.find({ cliente: campos.cliente }))
      .length;

    //Coloca 0 a esquerda
    let codigoCliente = String(("0000" + campos.cliente.codigo).slice(-4));
    let cp = String(("0000" + (prodsFornecedorCount + 1)).slice(-4));
    campos.codigo = `${codigoCliente}.${cp}`;

    const produto = await Produto.create(campos);
    if (produto) {
      return res.json(produto);
    } else {
      return res.status(400).json({ error: ["Falha no cadastro"] });
    }
  } catch (error) {
    return res.status(500).json({ error: ["Falha na solicitação"] });
  }
}

//Consulta produtos pelo titulo
function getProdutos(req, res) {
  const { codigo } = req.query;
  Produto.find({ codigo })
    .populate({ path: "cliente", model: Cliente, select: "nome cpf telefone" })
    .exec((error, produto) => {
      if (error) {
        res.status(500).json({ errors: [error] });
      } else {
        res.json(produto);
      }
    });
}

//AllProdutos
function allProdutos(req, res) {
  const { limit = null, skip = null } = req.query;
  Produto.find()
    .limit(limit)
    .skip(skip)
    .populate({ path: "cliente", model: Cliente, select: "nome cpf telefone" })
    .exec((error, produto) => {
      if (error) {
        res.status(500).json({ errors: [error] });
      } else {
        res.json(produto);
      }
    });
}

//Consulta valor do produto
function getValor(req, res) {
  Produto.find(
    {
      titulo: req.query.titulo,
      descricao: req.query.descricao
    },
    {
      _id: 0,
      valor: 1
    },
    (error, result) => {
      if (error) {
        res.status(500).json({ errors: [error] });
      } else {
        res.json(result);
      }
    }
  );
}

//Consulta titulos
function getTitulos(req, res) {
  Produto.distinct("titulo", (error, result) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      res.json(result);
    }
  });
}

module.exports = { getProdutos, getTitulos, getValor, allProdutos, store };
