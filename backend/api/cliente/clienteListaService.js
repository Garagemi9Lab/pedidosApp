const _ = require("lodash");
const Cliente = require("./cliente");

const filter = {
  $or: [
    { tipo: ["customer"] },
    { tipo: ["customer", "provider"] },
    { tipo: ["provider", "customer"] },
    { tipo: null },
    { tipo: [] }
  ]
};

function getByName(req, res) {
  Cliente.find(
    {
      nome: new RegExp(req.query.nome, "i")
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

async function list(req, res) {
  try {
    const { skip = null, limit = 10 } = req.query;
    const clientes = await Cliente.find(filter, null, {
      limit: limit,
      skip: skip
    });
    return res.json(clientes);
  } catch (error) {
    return res.status(500).json({ errors });
  }
}

async function count(req, res) {
  await Cliente.count(filter, (error, value) => {
    if (error) {
      return res.status(500).json({ errors: [error] });
    } else {
      return res.json({ value });
    }
  });
}

async function store(req, res) {
  try {
    let campos = req.body;
    campos.codigo = (await Cliente.find()).length + 1;
    campos.tipo = ["customer"];

    const customer = await Cliente.create(campos);
    return res.json(customer);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: ["Create customer failed"] });
  }
}

async function update(req, res) {
  try {
    const customer = await Cliente.findOne({ _id: req.params.id });

    if (!customer) {
      return res.status(400).json({ errors: ["Customer not found"] });
    }

    let campos = req.body;
    let filtro = {
      $or: [
        { tipo: ["customer"] },
        { tipo: ["customer", "provider"] },
        { tipo: ["provider", "customer"] }
      ]
    };
    if (
      !customer.codigo ||
      customer.codigo == null ||
      customer.codigo == undefined
    ) {
      campos.codigo = (await Cliente.find(filtro)).length + 1;
    }

    if (!campos.tipo || campos.tipo == null || campos.tipo.length == 0) {
      campos.tipo = ["customer"];
    }

    const update = await Cliente.updateOne({ _id: req.params.id }, campos);
    return res.json({ update });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: ["Update customer failed"] });
  }
}

module.exports = { getByName, list, count, store, update };
