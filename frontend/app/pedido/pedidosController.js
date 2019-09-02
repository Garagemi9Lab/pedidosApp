(function() {
  angular.module('pedidosApp')
  .controller('PedidosCtrl', [
    '$http',
    '$location',
    'msgs',
    'tabs',
    PedidosCtrl
  ])
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
      element.bind("keydown keypress", function (event) {
        if (event.which === 13) {
          scope.$apply(function () {
            scope.$eval(attrs.ngEnter)
          });
          event.preventDefault()
        }
      })
    }
  })

  function PedidosCtrl($http, $location, msgs, tabs) {
    const vm = this
    const url = `http://localhost:3003/api/pedido`

    vm.refresh = function() {
      const page = parseInt($location.search().page) || 1
      $http.get(`${url}/lista?skip=${(page - 1) * 10}&limit=10`).then(function(response) {
        $http.get(`${url}/count`).then(function(response) {
          vm.pages = Math.ceil(response.data.value / 10)
          tabs.show(vm, {tabList:true, tabCreate: true})

          vm.pedido = {
            numPedido:response.data.value+1,
            dataPedido: new Date(),
            itens: [],
            status: 'EM ABERTO',
            financeiro: {
              status: 'PENDENTE',
              creditos: [{}],
              debitos: {
                frete: 0,
                valorPedido: 0
              },
              valorPago: 0,
              valorFinal: 0
            },
            cliente: {}
          }
          vm.it = {
            valorTotal: 0,
            dataEntrega: new Date().addDays(2),
            statusItem: 'PENDENTE',
            servicos:[{status:'PENDENTE'}]
          }
          vm.entrega = 'A Retirar'
          vm.addUsuario = false
          vm.getPecasList()
          vm.servicos = []
          vm.statusItem = 'NOVO'
        })
        vm.pedidos = response.data
      })
    }

    Date.prototype.addDays = function(days) {
      var dat = new Date(this.valueOf());
      dat.setDate(dat.getDate() + days);
      return dat;
    }

    vm.getPecasList = function() {
      const url = `http://localhost:3003/api/servico/getPecas`
      $http.get(`${url}`).then(function(response) {
        vm.pecas = response.data
      })
    }

    vm.getServicosList = function(peca, i) {
      const url = `http://localhost:3003/api/servico/getServicos`
      $http.get(`${url}?peca=${peca}`).then(function(response) {
        vm.servicos = Object.keys(response.data).map(function(k) {
          return response.data[k].descricao
        })
        if (i) {vm.pedido.itens[i].valor = 0}
      })
    }

    vm.getValorServico = function(item, i) {
      const url = `http://localhost:3003/api/servico/getValor`
      if (item && item.servicos[i].descricao) {
        let desc = item.servicos[i].descricao
        desc = desc.replace(/\+/, '%2B')
        $http.get(`${url}?peca=${item.peca}&servico=${desc}`)
        .then(function(response) {
          item.servicos[i].valor = response.data[0].valor
          vm.calcServicos()
        })
      }
    }

    vm.print = function() {
      window.print()
    }

    vm.findCliente = function() {
      const url = `http://localhost:3003/api/cliente`

      if (vm.busca) {
        if (!isNaN(parseFloat(vm.busca)) && isFinite(vm.busca)) {
          vm.addUsuario = false
          vm.nenhum = null
          vm.getCliente(vm.busca)
        } else {
          vm.addUsuario = false
          vm.nenhum = null
          $http.get(`${url}/byname?nome=${vm.busca}`).then(function(response) {
            vm.listaClientes = response.data
          })
        }
      }
    }

    vm.getCliente = function(t) {
      vm.busca = ''
      vm.listaClientes = []
      const url = `http://localhost:3003/api/cliente`
      const telefone = t ? t : vm.pedido.telefone
      vm.pedido.telefone = t ? t : vm.pedido.telefone

      if (telefone) {
        $http.get(`${url}?telefone=${telefone}`).then(function(response) {
          vm.pedido.cliente = response.data[0] ? response.data[0] : []
          vm.nenhum = response.data[0] ? null : 'Nenhum usuário encontrado'
          vm.addUsuario = response.data[0] ? false : true
        })
      }
    }

    vm.setEntrega = function(endereco) {
      if (endereco === vm.entrega) {
        vm.pedido.endEntrega = vm.entrega
      } else {
        vm.pedido.endEntrega = `${endereco.rua || ''}, ${endereco.numero || ''} ${endereco.complemento || ''} - ${endereco.bairro || ''} - ${endereco.cidade || ''}/${endereco.uf || ''} - CEP ${endereco.cep || ''}`
      }
    }

    vm.convertDate = function(d) {
      var date = new Date(d)
      return date
    }

    vm.checkStatus = function() {
      let ck = true
      vm.pedido.itens.forEach(function(v) {
        if (v.statusItem == 'PENDENTE') {
          ck = false
        }
      })
      ck == true ? vm.pedido.status = 'CONCLUÍDO' : vm.pedido.status = 'EM ABERTO'
    }

    vm.checkServicoStatus = function() {
      let ck = true
      vm.it.servicos.forEach(function(v) {
        if (v.status == 'PENDENTE') {
          ck = false
        }
      })
      ck == true ? vm.it.statusItem = 'CONCLUÍDO' : vm.it.statusItem = 'PENDENTE'
    }

    vm.create = function() {
      vm.checkStatus()
      $http.post(url, vm.pedido).then(function(response) {
        vm.showTabTicket(vm.pedido)
        msgs.addSuccess('Operação realizada com sucesso!')
      }).catch(function(response) {
        msgs.addError(response.data.errors)
      })
    }

    vm.update = function() {
      vm.checkStatus()
      const updateUrl = `${url}/${vm.pedido._id}`
      $http.put(updateUrl, vm.pedido).then(function(response) {
        vm.refresh()
        msgs.addSuccess('Operação realizada com sucesso!')
      }).catch(function(response) {
        msgs.addError(response.data.errors)
      })
    }

    vm.entregar = function() {
      vm.pedido.entrega = 'REALIZADA'
      vm.update()
    }

    vm.showTabUpdate = function(pedido) {
      vm.pedido = pedido
      vm.getCliente()
      vm.pedido.dataPedido = vm.convertDate(vm.pedido.dataPedido)
      vm.pedido.dataEntrega = vm.convertDate(vm.pedido.dataEntrega)
      vm.pedido.financeiro.vencimento = vm.convertDate(vm.pedido.financeiro.vencimento)
      vm.pedido.itens.forEach(function(v, i) {
        v.dataEntrega = vm.convertDate(v.dataEntrega)
      })
      tabs.show(vm, {tabUpdate: true})
    }

    vm.showTabTicket = function(pedido) {
      vm.pedido = pedido
      if (vm.pedido.cliente) {
        vm.getCliente(vm.pedido.clienteCpf)
      }
      tabs.show(vm, {tabTicket: true})
    }

    vm.addItem = function() {
      if (!vm.it) {
        vm.it = {}
      }
      vm.pedido.itens.splice(vm.pedido.itens.length,0,vm.it)
      vm.it = {
        valorTotal:0,
        dataEntrega: new Date().addDays(2),
        statusItem: 'PENDENTE',
        servicos:[{status:'PENDENTE'}]
      }
      vm.calcItens()
    }

    vm.showUpdateItem = function(item, i) {
      vm.getServicosList(item.peca, i)
      vm.it = item
      vm.statusItem = 'EDIT'
    }

    vm.addServico = function() {
      vm.it.servicos.splice(vm.it.servicos.length,0,{
        status:'PENDENTE'
      })
      vm.checkServicoStatus()
    }

    vm.deleteServico = function(index) {
      if(vm.it.servicos.length > 1) {
        vm.it.servicos.splice(index, 1)
      }
      vm.checkServicoStatus()
    }

    vm.changeItemStatus = function(servico) {
      if (servico.status == 'PENDENTE') {
        servico.status = 'CONCLUÍDO'
      } else {
        servico.status = 'PENDENTE'
      }
      vm.checkServicoStatus()
    }

    vm.updateItem = function(index) {
      vm.it = {
        valorTotal: 0,
        dataEntrega: new Date().addDays(2),
        statusItem: 'PENDENTE',
        servicos:[{status:'PENDENTE'}]
      }
      // vm.calcServicos()
      vm.calcItens()
      vm.statusItem = 'NOVO'
    }

    vm.deleteItem = function(index) {
      if(vm.pedido.itens.length > 1) {
        vm.pedido.itens.splice(index, 1)
        vm.calcItens()
        vm.it = {
          valorTotal: 0,
          dataEntrega: new Date().addDays(2),
          statusItem: 'PENDENTE',
          servicos:[{status:'PENDENTE'}]
        }
        vm.statusItem = 'NOVO'
      }
    }

    vm.addPrestador = function(index) {
      vm.pedido.prestadores.splice(index + 1, 0, {})
    }

    vm.clonePrestador = function(index, {nome, telefone, funcao}) {
      vm.pedido.prestadores.splice(index + 1, 0, {nome, telefone, funcao})
    }

    vm.deletePrestador = function(index) {
      if(vm.pedido.prestadores.length > 1) {
        vm.pedido.prestadores.splice(index, 1)
      }
    }

    vm.addPagamento = function(index) {
      vm.pedido.financeiro.creditos.splice(index + 1, 0, {})
    }

    vm.clonePagamento = function(index, {tipo, valor}) {
      vm.pedido.financeiro.creditos.splice(index + 1, 0, {tipo, valor})
      vm.calcPagamentos()
    }

    vm.deletePagamento = function(index) {
      if(vm.pedido.financeiro.creditos.length > 1) {
        vm.pedido.financeiro.creditos.splice(index, 1)
        vm.calcPagamentos()
      }
    }

    // Funções de calculos de itens, débitos e totais
    vm.calcPagamentos = function() {
      vm.vlrPagtos = 0

      if(vm.pedido.financeiro.creditos.length > 0) {
        vm.pedido.financeiro.creditos.forEach(function(value) {
          vm.vlrPagtos += !value.valor || isNaN(value.valor) ? 0 : parseFloat(value.valor)
        })
      }
      vm.pedido.financeiro.valorPago = vm.vlrPagtos
      vm.calcSubTotal()
    }

    vm.calcServicos = function() {
      vm.it.valorTotal = 0
      if (vm.it.servicos.length > 0) {
        vm.it.servicos.forEach(function(v) {
          vm.it.valorTotal += !v.valor || isNaN(v.valor) ? 0 : parseFloat(v.valor)
        })
      }
    }

    vm.calcItens = function() {
      vm.vlrPedido = 0
      if(vm.pedido.itens.length > 0) {
        vm.pedido.itens.forEach(function(value) {
          vm.vlrPedido += !value.valorTotal || isNaN(value.valorTotal) ? 0 : parseFloat(value.valorTotal)
        })
      }
      vm.pedido.financeiro.debitos.valorPedido = vm.vlrPedido
      vm.calcSubTotal()
    }

    vm.calcSubTotal = function() {
      vm.debito = 0

      if (vm.pedido) {
        vm.debito += !vm.pedido.financeiro.debitos.valorPedido || isNaN(vm.pedido.financeiro.debitos.valorPedido) ? 0 : parseFloat(vm.pedido.financeiro.debitos.valorPedido)
        vm.debito += !vm.pedido.financeiro.debitos.frete || isNaN(vm.pedido.financeiro.debitos.frete) ? 0 : parseFloat(vm.pedido.financeiro.debitos.frete)

        vm.pedido.financeiro.subTotal = vm.debito
        vm.calculateValues()
      }
    }

    vm.calculateValues = function() {
      if (vm.pedido) {
        vm.pedido.financeiro.valorFinal = vm.pedido.financeiro.subTotal - vm.pedido.financeiro.valorPago

        if(vm.pedido.financeiro.valorFinal == 0) {
          vm.pedido.financeiro.status = 'PAGO'
        } else {
          vm.pedido.financeiro.status = 'PENDENTE'
        }
      }
    }

    vm.showTabCancel = function(pedido) {
      vm.pedido = pedido
      vm.pedido.dataPedido = vm.convertDate(vm.pedido.dataPedido)
      vm.pedido.dataEntrega = vm.convertDate(vm.pedido.dataEntrega)
      vm.pedido.financeiro.vencimento = vm.convertDate(vm.pedido.financeiro.vencimento)
      tabs.show(vm, {tabCancel: true})
    }

    vm.cancel = function() {
      const cancelUrl = `${url}/${vm.pedido._id}`
      vm.pedido.status = 'CANCELADO'
      $http.put(cancelUrl, vm.pedido).then(function(response) {
        vm.refresh()
        msgs.addSuccess('Pedido cancelado com sucesso!')
      }).catch(function(response) {
        msgs.addError(response.data.errors)
      })
    }
    vm.refresh()
  }
})()
