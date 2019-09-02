(function() {
  angular.module('pedidosApp').factory('tabs', [ TabsFactory ])

  function TabsFactory() {
    function show(owner, {
      tabList = false,
      tabCreate = false,
      tabUpdate = false,
      tabCancel = false,
      tabTicket = false
    }) {
      owner.tabList = tabList
      owner.tabCreate = tabCreate
      owner.tabUpdate = tabUpdate
      owner.tabCancel = tabCancel
      owner.tabTicket = tabTicket
    }

    return { show }
  }
})()
