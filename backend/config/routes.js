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
  //router.use(sessionController.authenticate);

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
  router.get("/cliente/list", clienteListaService.list);
  router.get("/cliente/count", clienteListaService.count);
  router.post("/cliente/store", clienteListaService.store);
  router.put("/cliente/update/:id", clienteListaService.update);

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

  const produtoListaService = require("../api/produto/produtoListaService");
  router.post("/produto/create", produtoListaService.store); //Cria o produto
  router.get("/produto/lista", produtoListaService.allProdutos);
  router.get("/produto/getProdutos", produtoListaService.getProdutos);

  //File
  const fileController = require("../api/files/fileController");
  router.post("/file", upload.single("file"), fileController.store);

  const servicoListaService = require("../api/servico/servicoListaService");
  router.route("/servico/getServicos").get(servicoListaService.getServicos);
  router.route("/servico/getPecas").get(servicoListaService.getPecas);
  router.route("/servico/getValor").get(servicoListaService.getValor);

  const providerController = require("../api/fornecedor/fornecedorController");
  router.get("/provider/list", providerController.list);
  router.post("/provider/create", providerController.store);
  router.get("/provider/count", providerController.count);
  router.get("/provider/byName", providerController.getByName);
  router.put("/provider/update/:id", providerController.update);
  router.get("/provider/:codigo", providerController.findOne);
  router.get("/provider/:codigo/produtos", providerController.getProdutos);
};
