(function() {
  angular
    .module("pedidosApp")
    .controller("ClientesCtrl", [
      "$http",
      "$location",
      "msgs",
      "tabs",
      ClientesCtrl
    ]);

  function ClientesCtrl($http, $location, msgs, tabs) {
    const vm = this;
    const url = `http://localhost:3003/api/cliente`;

    vm.refresh = function() {
      const page = parseInt($location.search().page) || 1;
      $http
        .get(`${url}/list?skip=${(page - 1) * 10}&limit=10`)
        .then(function(response) {
          $http.get(`${url}/count`).then(function(response) {
            vm.pages = Math.ceil(response.data.value / 10);
            tabs.show(vm, { tabList: true, tabCreate: true });

            vm.cliente = {
              // endereco: [{}],
              // dependentes: [{}]
            };
            vm.endereco = {};
            vm.endStatus = "";
          });
          vm.clientes = response.data;
        });
    };

    vm.getCliente = function(cpf) {
      if (cpf && cpf.toString().length >= 11) {
        $http.get(`${url}?cpf=${cpf}`).then(function(response) {
          vm.cliente = response.data[0];
        });
      }
    };

    vm.getByCep = function() {
      if (vm.endereco.cep && vm.endereco.cep.toString().length == 8) {
        $http
          .get(`http://viacep.com.br/ws/${vm.endereco.cep}/json/`)
          .then(function(response) {
            const end = response.data;
            vm.endereco.rua = end.logradouro;
            vm.endereco.bairro = end.bairro;
            vm.endereco.cidade = end.localidade;
            vm.endereco.uf = end.uf;
          });
      }
      vm.cliente.endereco;
    };

    vm.addEndereco = function() {
      if (!vm.cliente.endereco) {
        vm.cliente.endereco = [];
      }
      vm.cliente.endereco.splice(vm.cliente.endereco.length, 0, vm.endereco);
      vm.endereco = {};
      vm.endStatus = "";
    };

    vm.deleteEndereco = function(index) {
      if (vm.cliente.endereco.length > 1) {
        vm.cliente.endereco.splice(index, 1);
      }
    };

    vm.updateEndereco = function() {
      vm.endereco = {};
      vm.endStatus = "";
    };

    vm.showAddEndereco = function() {
      vm.endStatus = "Adicionar";
    };

    vm.showUpdateEndereco = function(endereco) {
      vm.endereco = endereco;
      vm.endStatus = "Alterar";
    };

    vm.showTabUpdate = function(cliente) {
      vm.cliente = cliente;
      tabs.show(vm, { tabUpdate: true });
    };

    vm.create = function() {
      $http
        .post(`${url}/store`, vm.cliente)
        .then(function(response) {
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.errors);
        });
    };

    vm.update = function() {
      const updateUrl = `${url}/update/${vm.cliente._id}`;
      $http
        .put(updateUrl, vm.cliente)
        .then(function(response) {
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.error);
        });
    };

    vm.updateFornecedor = function() {
      const updateUrl = `${url}/update/${vm.cliente._id}`;
      vm.cliente.tipo = ["customer", "provider"];
      $http
        .put(updateUrl, vm.cliente)
        .then(function(response) {
          vm.refresh();
          msgs.addSuccess("Operação realizada com sucesso!");
        })
        .catch(function(response) {
          msgs.addError(response.data.error);
        });
    };

    //   vm.convertDate = function(d) {
    //     var date = new Date(d)
    //     return date
    //   }
    //

    //

    //
    //
    //   vm.showTabTicket = function(pedido) {
    //     vm.pedido = pedido
    //     tabs.show(vm, {tabTicket: true})
    //   }
    //
    //   vm.addItem = function(index) {
    //     vm.pedido.itens.splice(index + 1, 0, {})
    //   }
    //
    //   vm.cloneItem = function(index, {cod, descricao, quantidade, valor, observacao}) {
    //     vm.pedido.itens.splice(index + 1, 0, {cod, descricao, quantidade, valor, observacao})
    //     vm.calcitens()
    //   }
    //
    //   vm.addPrestador = function(index) {
    //     vm.pedido.prestadores.splice(index + 1, 0, {})
    //   }
    //
    //   vm.clonePrestador = function(index, {nome, telefone, funcao}) {
    //     vm.pedido.prestadores.splice(index + 1, 0, {nome, telefone, funcao})
    //   }
    //
    //   vm.deletePrestador = function(index) {
    //     if(vm.pedido.prestadores.length > 1) {
    //       vm.pedido.prestadores.splice(index, 1)
    //     }
    //   }
    //
    //   vm.addPagamento = function(index) {
    //     vm.pedido.financeiro.creditos.splice(index + 1, 0, {})
    //   }
    //
    //   vm.clonePagamento = function(index, {tipo, valor}) {
    //     vm.pedido.financeiro.creditos.splice(index + 1, 0, {tipo, valor})
    //     vm.calcPagamentos()
    //   }
    //
    //   vm.deletePagamento = function(index) {
    //     if(vm.pedido.financeiro.creditos.length > 1) {
    //       vm.pedido.financeiro.creditos.splice(index, 1)
    //       vm.calcPagamentos()
    //     }
    //   }
    //
    //
    //   // Funções de calculos de itens, débitos e totais
    //   vm.calcPagamentos = function() {
    //     vm.vlrPagtos = 0
    //
    //     if(vm.pedido.financeiro.creditos.length > 0) {
    //       vm.pedido.financeiro.creditos.forEach(function(value) {
    //         vm.vlrPagtos += !value.valor || isNaN(value.valor) ? 0 : parseFloat(value.valor)
    //       })
    //     }
    //     vm.pedido.financeiro.valorPago = vm.vlrPagtos
    //     vm.calcSubTotal()
    //   }
    //
    //   vm.calcitens = function() {
    //     vm.vlrPedido = 0
    //     if(vm.pedido.itens.length > 0) {
    //       vm.pedido.itens.forEach(function(value) {
    //         vm.vlrPedido += !value.valor || isNaN(value.valor) ? 0 : (parseFloat(value.valor)* value.quantidade)
    //       })
    //     }
    //     vm.pedido.financeiro.debitos.valorPedido = vm.vlrPedido
    //     vm.calcSubTotal()
    //   }
    //
    //   vm.calcSubTotal = function() {
    //     vm.debito = 0
    //
    //     if (vm.pedido) {
    //       vm.debito += !vm.pedido.financeiro.debitos.valorPedido || isNaN(vm.pedido.financeiro.debitos.valorPedido) ? 0 : parseFloat(vm.pedido.financeiro.debitos.valorPedido)
    //       vm.debito += !vm.pedido.financeiro.debitos.jurosMulta || isNaN(vm.pedido.financeiro.debitos.jurosMulta) ? 0 : parseFloat(vm.pedido.financeiro.debitos.jurosMulta)
    //       vm.debito += !vm.pedido.financeiro.debitos.frete || isNaN(vm.pedido.financeiro.debitos.frete) ? 0 : parseFloat(vm.pedido.financeiro.debitos.frete)
    //
    //       vm.pedido.financeiro.subTotal = vm.debito
    //       vm.calculateValues()
    //     }
    //   }
    //
    //   vm.calculateValues = function() {
    //     if (vm.pedido) {
    //       vm.pedido.financeiro.valorFinal = vm.pedido.financeiro.subTotal - vm.pedido.financeiro.valorPago
    //
    //       if(vm.pedido.financeiro.valorFinal == 0) {
    //         vm.pedido.financeiro.status = 'PAGO'
    //       } else {
    //         vm.pedido.financeiro.status = 'PENDENTE'
    //       }
    //     }
    //   }
    //
    //   vm.showTabCancel = function(pedido) {
    //     vm.pedido = pedido
    //     vm.pedido.dataPedido = vm.convertDate(vm.pedido.dataPedido)
    //     vm.pedido.dataEntrega = vm.convertDate(vm.pedido.dataEntrega)
    //     vm.pedido.financeiro.vencimento = vm.convertDate(vm.pedido.financeiro.vencimento)
    //     tabs.show(vm, {tabCancel: true})
    //   }
    //
    //
    //   vm.cancel = function() {
    //     const cancelUrl = `${url}/${vm.pedido._id}`
    //     vm.pedido.status = 'CANCELADO'
    //     $http.put(cancelUrl, vm.pedido).then(function(response) {
    //       vm.refresh()
    //       msgs.addSuccess('Pedido cancelado com sucesso!')
    //     }).catch(function(response) {
    //       msgs.addError(response.data.errors)
    //     })
    //   }
    // //
    // //
    // // vm.addDebt = function(index) {
    // //   vm.billingCycle.debts.splice(index + 1, 0, {})
    // // }
    // //
    // // vm.cloneDebt = function(index, {name, value, status}) {
    // //   vm.billingCycle.debts.splice(index + 1, 0, {name, value, status})
    // //   vm.calculateValues()
    // // }
    // //
    // // vm.deleteDebt = function(index) {
    // //   if(vm.billingCycle.debts.length > 1) {
    // //     vm.billingCycle.debts.splice(index, 1)
    // //     vm.calculateValues()
    // //   }
    // // }
    // //
    //
    vm.refresh();
  }
})();
