const restful = require('node-restful')
const mongoose = restful.mongoose

const prestadorSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  telefone: {type: String},
  funcao: [{type: String, required: true}]
})

module.exports = restful.model('Prestador', prestadorSchema)
