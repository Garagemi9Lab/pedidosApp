(function() {
  angular
    .module("pedidosApp")
    .controller("ServicosCtrl", [
      "$http",
      "$location",
      "msgs",
      "tabs",
      ServicosCtrl
    ]);

  function ServicosCtrl($http, $location, msgs, tabs) {
    const vm = this;
    const url = `http://localhost:3003/api/servico`;

    vm.refresh = function() {
      const page = parseInt($location.search().page) || 1;
      $http
        .get(`${url}?skip=${(page - 1) * 20}&limit=20`)
        .then(function(response) {
          $http.get(`${url}/count`).then(function(response) {
            vm.pages = Math.ceil(response.data.value / 20);
            tabs.show(vm, { tabList: true, tabCreate: true });
            vm.servico = {};
          });
          vm.servicos = response.data;
        });
    };

    vm.convertDate = function(d) {
      var date = new Date(d);
      return date;
    };

    vm.create = function() {
      $http
        .post(url, vm.servico)
        .then(function(response) {
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.errors);
        });
    };

    vm.update = function() {
      const updateUrl = `${url}/${vm.servico._id}`;
      $http
        .put(updateUrl, vm.servico)
        .then(function(response) {
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.errors);
        });
    };

    vm.showTabUpdate = function(servico) {
      vm.servico = servico;
      vm.servico.ultAlteracao = vm.convertDate(vm.servico.ultAlteracao);
      tabs.show(vm, { tabUpdate: true });
    };

    vm.addItem = function(index) {
      vm.pedido.itens.splice(index + 1, 0, {});
    };

    vm.cloneItem = function(
      index,
      { cod, descricao, quantidade, valor, observacao }
    ) {
      vm.pedido.itens.splice(index + 1, 0, {
        cod,
        descricao,
        quantidade,
        valor,
        observacao
      });
      vm.calcitens();
    };

    vm.deleteItem = function(index) {
      if (vm.pedido.itens.length > 1) {
        vm.pedido.itens.splice(index, 1);
        vm.calcitens();
      }
    };

    vm.refresh();
  }
})();
