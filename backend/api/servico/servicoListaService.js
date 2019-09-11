const _ = require("lodash");
const Servico = require("./servico");

function getServicos(req, res) {
  Servico.find(
    {
      peca: req.query.peca
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

function getValor(req, res) {
  Servico.find(
    {
      peca: req.query.peca,
      descricao: req.query.servico
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

function getPecas(req, res) {
  Servico.distinct("peca", (error, result) => {
    if (error) {
      res.status(500).json({ errors: [error] });
    } else {
      res.json(result);
    }
  });
}

module.exports = { getServicos, getPecas, getValor };
