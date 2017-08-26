(function () {
  'use strict';

  
  function BodyweightsListController(BodyweightsService) {
    var vm = this;

    vm.bodyweights = BodyweightsService.query();
  }

  BodyweightsListController.$inject = ['BodyweightsService'];

  angular
    .module('bodyweights')
    .controller('BodyweightsListController', BodyweightsListController);

}());
