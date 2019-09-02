const restful = require("node-restful");
const cliente = require("../cliente/cliente");
const file = require("../files/file");
const mongoose = restful.mongoose;

const produtoSchema = new mongoose.Schema({
  codigo: { type: Number, min: 0, unique: true, required: true },
  titulo: { type: String, required: true },
  descricao: { type: String, required: true },
  quantidade: { type: Number, default: 1 },
  grupo: { type: String, default: "ROUPAS" },
  valor: { type: Number, default: 1.0 },
  percentualConsignado: { type: Number, required: true, default: 50 },
  pontos: { type: Number },
  ultAlteracao: { type: Date, default: Date.now },
  retiradaDate: { type: Date, default: Date.now },
  cliente: { type: mongoose.Schema.ObjectId, ref: cliente, required: true },
  createdAt: { type: Date, default: Date.now },
  imagemId: { type: mongoose.Schema.ObjectId, ref: file, required: true }
});

module.exports = restful.model("Produto", produtoSchema);
