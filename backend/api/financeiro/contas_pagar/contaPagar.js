const restful = require("node-restful");
const mongoose = restful.mongoose;

const cliente = require("../../cliente/cliente");
const produto = require("../../produto/produto");

const contaPagarParcelaQuitacaoSchema = new mongoose.Schema({
  valor_pago: { type: Number },
  data: { type: Date, required: true }
});

const contaPagarParcelaSchema = new mongoose.Schema({
  data_vencimento: { type: Date },
  valor: { type: Number },
  quitacao: { contaPagarParcelaQuitacaoSchema }
});

const contaPagarSchema = new mongoose.Schema({
  fornecedor: { type: mongoose.Schema.ObjectId, ref: cliente, required: true },
  produto: { type: mongoose.Schema.ObjectId, ref: produto },
  descricao: { type: String, required: true },
  data_emissao: { type: Date, required: true },
  valor: { type: Number },
  parcelas: [contaPagarParcelaSchema]
});

module.exports = restful.model("ContaPagar", contaPagarSchema);
