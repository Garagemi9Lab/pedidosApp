const _ = require('lodash')
const Cliente = require('./cliente')

function getByName(req, res) {
  Cliente.find({
    'nome': new RegExp(req.query.nome,'i')
  },
  (error, result) => {
    if(error) {
      res.status(500).json({errors: [error]})
    } else {
      res.json(result)
    }
  })
}

module.exports = { getByName }
