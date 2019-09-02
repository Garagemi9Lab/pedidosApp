const express = require("express");
const multer = require("multer");
const multerConfig = require("../config/multer");

module.exports = function(server) {
  // API routes
  const router = express.Router();
  const upload = multer(multerConfig);
  server.use("/api", router);

  //Rotas da api
  //Sessão
  const sessionController = require("../api/session/sessionController");
  router.post("/session", sessionController.store);

  //Usuário
  const userController = require("../api/user/userController");
  router.post("/user", userController.store);

  //Rotas abaixo dessa linha precisam de token.
  router.use(sessionController.authenticate);

  //Pedido
  const pedidoService = require("../api/pedido/pedidoService");
  pedidoService.register(router, "/pedido");

  const pedidoListaService = require("../api/pedido/pedidoListaService");
  router.route("/pedido/lista").get(pedidoListaService.getPedidos);

  //Cliente
  const clienteService = require("../api/cliente/clienteService");
  clienteService.register(router, "/cliente");

  const clienteListaService = require("../api/cliente/clienteListaService");
  router.route("/cliente/byName").get(clienteListaService.getByName);

  //Estoque
  const estoqueService = require("../api/estoque/estoqueService");
  estoqueService.register(router, "/estoque");

  //Prestador
  const prestadorService = require("../api/prestador/prestadorService");
  prestadorService.register(router, "/prestador");

  //Serviços
  const servicoService = require("../api/servico/servicoService");
  servicoService.register(router, "/servico");

  //Produto
  const produtoService = require("../api/produto/produtoService");
  produtoService.register(router, "/produto");

  //File
  const fileController = require("../api/files/fileController");
  router.post("/file", upload.single("file"), fileController.store);

  const servicoListaService = require("../api/servico/servicoListaService");
  router.route("/servico/getServicos").get(servicoListaService.getServicos);
  router.route("/servico/getPecas").get(servicoListaService.getPecas);
  router.route("/servico/getValor").get(servicoListaService.getValor);
};
