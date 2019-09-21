(function() {
  angular
    .module("pedidosApp")
    .controller("ProdutosCtrl", [
      "$http",
      "$location",
      "msgs",
      "tabs",
      ProdutosCtrl
    ]);

  function ProdutosCtrl($http, $location, msgs, tabs) {
    const vm = this;
    const url = `http://localhost:3003/api/produto`;

    vm.refresh = function() {
      const page = parseInt($location.search().page) || 1;
      $http
        .get(`${url}/lista?skip=${(page - 1) * 100}&limit=100`)
        .then(function(response) {
          $http.get(`${url}/count`).then(function(response) {
            vm.pages = Math.ceil(response.data.value / 100);
            tabs.show(vm, {
              tabList: true,
              tabCreate: true,
              tabEtiquetas: true
            });
            vm.produto = {
              codigo: null
            };
          });
          vm.produtos = response.data;
        });
    };

    vm.convertDate = function(d) {
      var date = new Date(d);
      return date;
    };

    vm.create = function() {
      $http
        .post(`${url}/create`, vm.produto)
        .then(function(response) {
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.errors);
        });
    };

    vm.listEtiquetas = [];

    vm.addProdList = function(produtoId) {
      let index = vm.listEtiquetas.findIndex(item => item == produtoId);
      if (index < 0) {
        vm.listEtiquetas.push(produtoId);
      } else {
        vm.listEtiquetas.splice(index, 1);
      }
    };

    vm.gerarEtiquetas = function() {
      let etiquetas = vm.listEtiquetas;
      let urlEtiquetas = `${url}/etiquetas`;
      console.log({ produto: etiquetas });
      $http
        .post(
          urlEtiquetas,
          { produto: etiquetas },
          { responseType: "arraybuffer" }
        )
        .then(function(response) {
          console.log(response.data);
          var file = new Blob([response.data], { type: "application/pdf" });
          var fileURL = window.URL.createObjectURL(file);
          var fileName = `etiquetas-${new Date()}.pdf`;
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.style = "display: none";
          a.href = fileURL;
          a.download = fileName;
          a.click();
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.errors);
        });
    };

    vm.update = function() {
      const updateUrl = `${url}/${vm.produto._id}`;
      $http
        .put(updateUrl, vm.produto)
        .then(function(response) {
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.errors);
        });
    };

    vm.showTabUpdate = function(produto) {
      vm.produto = produto;
      vm.produto.ultAlteracao = vm.convertDate(vm.produto.ultAlteracao);
      tabs.show(vm, { tabUpdate: true });
    };

    vm.addItem = function(index) {
      vm.produto.itens.splice(index + 1, 0, {});
    };

    vm.cloneItem = function(
      index,
      { cod, descricao, quantidade, valor, observacao }
    ) {
      vm.produto.itens.splice(index + 1, 0, {
        cod,
        descricao,
        quantidade,
        valor,
        observacao
      });
      vm.calcitens();
    };

    vm.deleteItem = function(index) {
      if (vm.produto.itens.length > 1) {
        vm.produto.itens.splice(index, 1);
        vm.calcitens();
      }
    };

    vm.findCliente = function() {
      const url = `http://localhost:3003/api/provider`;

      if (vm.busca) {
        if (!isNaN(parseFloat(vm.busca)) && isFinite(vm.busca)) {
          vm.addUsuario = false;
          vm.nenhum = null;
          vm.getCliente(vm.busca);
        } else {
          vm.addUsuario = false;
          vm.nenhum = null;
          $http.get(`${url}/byname?nome=${vm.busca}`).then(function(response) {
            vm.listaClientes = response.data;
          });
        }
      }
    };

    vm.getCliente = function(t) {
      vm.busca = "";
      vm.listaClientes = [];
      const url = `http://localhost:3003/api/cliente`;
      const telefone = t ? t : vm.produto.telefone;
      vm.produto.telefone = t ? t : vm.produto.telefone;

      if (telefone) {
        $http.get(`${url}?telefone=${telefone}`).then(function(response) {
          vm.produto.cliente = response.data[0] ? response.data[0] : [];
          vm.nenhum = response.data[0] ? null : "Nenhum usuário encontrado";
          vm.addUsuario = response.data[0] ? false : true;
        });
      }
    };

    vm.refresh();
  }
})();
