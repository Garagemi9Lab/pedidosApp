const restful = require("node-restful");
const mongoose = restful.mongoose;

const dependenteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  documento: { tipo: { type: String }, numero: { type: String } }
});

const enderecoSchema = new mongoose.Schema({
  rua: { type: String },
  numero: { type: Number },
  complemento: { type: String },
  bairro: { type: String },
  cep: { type: Number },
  cidade: { type: String },
  uf: {
    type: String,
    validate: {
      validator: function(v) {
        return /(\w{2})/.test(v);
      }
    }
  },
  complemento: { type: String },
  tipo: {
    type: String,
    uppercase: true,
    enum: ["RESIDENCIAL", "COMERCIAL", "OUTRO"]
  }
});

const creditoSchema = new mongoose.Schema({
  data: { type: Date },
  valor: { type: Number }
});

const clienteSchema = new mongoose.Schema({
  codigo: { type: String, required: true }, //4 digitos
  nome: { type: String, required: true },
  telefone: { type: String, required: true },
  celular: { type: String },
  cpf: {
    type: Number,
    unique: true,
    validate: {
      validator: function(v) {
        if (v.toString().length != 11) return false;
      }
    }
  },
  endereco: [enderecoSchema],
  email: { type: String },
  dependentes: [dependenteSchema],
  creditos: { type: [creditoSchema], saldoCred: { type: Number, min: 0 } }
});

module.exports = restful.model("Cliente", clienteSchema);
