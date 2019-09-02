const _ = require("lodash");
const Pedido = require("./pedido");

// Mais uma função middleware
function getPedidos(req, res) {
  Pedido.aggregate(
    {
      $lookup: {
        from: "clientes",
        localField: "telefone",
        foreignField: "telefone",
        as: "cliente"
      }
    },
    {
      $sort: { numPedido: -1 }
    },
    {
      $skip: req.query.skip
    },
    {
      $limit: req.query.limit
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

module.exports = { getPedidos };
