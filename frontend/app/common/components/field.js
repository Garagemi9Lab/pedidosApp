(function() {
  angular.module('pedidosApp').component('field', {
    bindings: {
      id: '@',
      label: '@',
      grid: '@',
      placeholder: '@',
      type: '@',
      model: '=',
      readonly: '<',
      min: '@',
      c: '@'
    },
    controller: [
      'gridSystem',
      function(gridSystem) {
        this.$onInit = () => this.gridClasses = gridSystem.toCssClasses(this.grid)
      }
    ],
    template:
      `
      <div class="{{ $ctrl.gridClasses}}">
        <div class="form-group">
          <label for="{{ $ctrl.id }}">{{ $ctrl.label }}</label>
          <input type="{{ $ctrl.type }}" placeholder="{{ $ctrl.placeholder }}" id="{{ $ctrl.id }}" class="form-control {{$ctrl.c}}" ng-model="$ctrl.model" ng-readonly="$ctrl.readonly" min="{{$ctrl.min}}"/>
        </div>
      </div>
      `
  })
})()
