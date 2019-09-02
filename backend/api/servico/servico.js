const restful = require('node-restful')
const mongoose = restful.mongoose

const servicoSchema = new mongoose.Schema({
  peca: {type: String, required: true},
  descricao: {type: String, required: true},
  grupo: {type: String, default: 'COSTURA'},
  valor: {type: Number},
  pontos: {type: Number},
  ultAlteracao: {type: Date, default: Date.now}
})

module.exports = restful.model('Servico', servicoSchema)
