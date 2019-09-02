const restful = require('node-restful')
const mongoose = restful.mongoose

const estoqueSchema = new mongoose.Schema({
  codigo: {type: String, required: true},
  descricao: {type: String, required: true},
  quantidade: {type: Number, required: true, min: 0},
  unMedida: {type: String, required: true},
  vlrUnitario: {type: Number, required: true}
})

module.exports = restful.model('Estoque', estoqueSchema)
