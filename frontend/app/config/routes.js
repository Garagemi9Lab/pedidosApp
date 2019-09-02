angular.module('pedidosApp').config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('dashboard', {
      url: '/dashboard',
      templateUrl: 'dashboard/dashboard.html'
    }).state('pedido', {
      url: '/pedidos?page',
      templateUrl: 'pedido/tabs.html'
    }).state('cliente', {
      url: '/clientes?page',
      templateUrl: 'cliente/tabs.html'
    }).state('servico', {
      url: '/servicos?page',
      templateUrl: 'servico/tabs.html'
    })

    $urlRouterProvider.otherwise('/pedidos')
  }
])
