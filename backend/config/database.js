const mongoose = require("mongoose");
module.exports = mongoose.connect("mongodb://localhost:27018/db_pedidosapp");

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório";
mongoose.Error.messages.Number.min =
  "O '{VALUE}' informado é menor que o limite mínimo de '{MIN}'";
mongoose.Error.messages.Number.min =
  "O '{VALUE}' informado é maior que o limite máximo de '{MIN}'";
mongoose.Error.messages.String.enum =
  "'{VALUE}' não é válido para o atributo '{PATH}'";
