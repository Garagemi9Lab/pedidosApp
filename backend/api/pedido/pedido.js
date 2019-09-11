const restful = require("node-restful");
const produto = require("../produto/produto");
const mongoose = restful.mongoose;

const pagamentoSchema = new mongoose.Schema({
  tipo: { type: String },
  valor: { type: Number }
});

const financeiroSchema = new mongoose.Schema({
  creditos: [pagamentoSchema],
  debitos: {
    frete: { type: Number, min: 0, default: 0 },
    valorPedido: { type: Number, min: 0, required: true, default: 0 }
  },
  subTotal: { type: Number, required: true, min: 0, default: 0 },
  valorPago: { type: Number, required: true, min: 0, default: 0 },
  valorFinal: { type: Number, required: true, min: 0, default: 0 },
  creditosPagar: { type: Number, min: 0 },
  status: {
    type: String,
    required: true,
    uppercase: true,
    enum: ["PAGO", "PENDENTE"]
  },
  vencimento: { type: Date, required: true }
});

const itemSchema = new mongoose.Schema({
  peca: { type: String, required: false },
  servicos: [
    {
      descricao: { type: String, required: true },
      valor: { type: Number, required: true, min: 0 },
      status: { type: String, enum: ["PENDENTE", "CONCLUÍDO"] }
    }
  ],
  produto: { type: mongoose.Schema.ObjectId, ref: produto },
  statusItem: { type: String, enum: ["PENDENTE", "CONCLUÍDO"] },
  valorTotal: { type: Number, required: true, min: 0 },
  marca: { type: String },
  codigo: { type: String },
  titulo: { type: String },
  cor: { type: String },
  dataEntrega: { type: Date, required: true }
});

const pedidoSchema = new mongoose.Schema({
  numPedido: { type: Number, min: 0, unique: true, required: true },
  dataPedido: { type: Date, required: true },
  endEntrega: { type: String, required: true },
  observacao: { type: String },
  status: {
    type: String,
    required: true,
    uppercase: true,
    enum: ["EM ABERTO", "CONCLUÍDO", "CANCELADO"]
  },
  itens: { type: [itemSchema], required: true },
  telefone: { type: String, required: true },
  financeiro: { type: financeiroSchema, required: true },
  tipo: { type: String, enum: ["SERVIÇO", "PRODUTO"], default: "SERVIÇO" }
});

module.exports = restful.model("Pedido", pedidoSchema);
