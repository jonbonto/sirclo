(function () {
  'use strict';

  // Bodyweights controller
  
  

  function BodyweightsController ($scope, $state, $window, Authentication, bodyweight) {
    var vm = this;

    vm.authentication = Authentication;
    vm.bodyweight = bodyweight;
    vm.error = null;
    vm.form = {};
    vm.bodyweight.date = new Date(vm.bodyweight.date);
    
    function successCallback(res) {
        $state.go('bodyweights.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    // Remove existing Bodyweight
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.bodyweight.$remove($state.go('bodyweights.list'));
      }
    }

    // Save Bodyweight
    function save(isValid) {
      console.log(vm.bodyweight.date);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.bodyweightForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.bodyweight._id) {
        vm.bodyweight.$update(successCallback, errorCallback);
      } else {
        vm.bodyweight.$save(successCallback, errorCallback);
      }

      
    }

    vm.remove = remove;
    vm.save = save;
  }

  BodyweightsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'bodyweightResolve'];
  
  angular
    .module('bodyweights')
    .controller('BodyweightsController', BodyweightsController);

}());
