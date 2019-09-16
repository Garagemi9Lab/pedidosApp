(function() {
  angular.module("pedidosApp").component("paginator", {
    bindings: {
      url: "@",
      pages: "@"
    },
    controller: [
      "$location",
      function($location) {
        this.$onInit = function() {
          const pages = parseInt(this.pages) || 1;
          this.pagesArray = Array(pages)
            .fill(0)
            .map((e, i) => i + 1);

          this.current = parseInt($location.search().page) || 1;
          this.needPagination = this.pages > 1;
          this.hasPrev = this.current > 1;
          this.hasNext = this.current < this.pages;

          this.isCurrent = function(i) {
            return this.current == i;
          };
        };
      }
    ],
    template: `
    <ul ng-if="$ctrl.needPagination" class="pagination pagination-sm no-margin pull-right">

      <li ng-if="$ctrl.hasPrev" ng-class="{active: $ctrl.isCurrent(0)}" >
        <a href="{{ $ctrl.url }}?page={{ 0 }}">Primeiro</a>
      </li>
      <li ng-if="$ctrl.hasPrev">
        <a href="{{ $ctrl.url }}?page={{ $ctrl.current - 1 }}">Anterior</a>
      </li>

      
      

      <li ng-if="$ctrl.current-1 > 0" ng-class="{active: $ctrl.isCurrent($ctrl.current-1)}" >
        <a href="{{ $ctrl.url }}?page={{ $ctrl.current-1 }}">{{ $ctrl.current-1 }}</a>
      </li>

      <li ng-class="{active: $ctrl.isCurrent($ctrl.current)}" >
        <a href="{{ $ctrl.url }}?page={{ $ctrl.current }}">{{ $ctrl.current }}</a>
      </li>

      <li ng-if="$ctrl.current+1 <= $ctrl.pages" ng-class="{active: $ctrl.isCurrent($ctrl.current+1)}" >
        <a href="{{ $ctrl.url }}?page={{ $ctrl.current+1 }}">{{ $ctrl.current+1 }}</a>
      </li>

     
     

      <li ng-if="$ctrl.hasNext">
        <a href="{{ $ctrl.url }}?page={{ $ctrl.current + 1 }}">Próximo</a>
      </li>

      <li ng-if="$ctrl.hasNext" ng-class="{active: $ctrl.isCurrent($ctrl.pages)}" >
        <a href="{{ $ctrl.url }}?page={{ $ctrl.pages }}">Último</a>
      </li>
    </ul>
    `
  });
})();
