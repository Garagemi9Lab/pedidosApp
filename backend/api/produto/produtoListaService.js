const _ = require("lodash");
const Produto = require("./produto");

//Consulta produtos pelo titulo
function getProdutos(req, res) {
  Produto.find(
    {
      titulo: req.query.titulo
    },
    {
      _id: 0,
      descricao: 1
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

module.exports = { getProdutos, getTitulos, getValor };
