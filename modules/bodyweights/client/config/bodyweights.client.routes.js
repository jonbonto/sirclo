(function () {
  'use strict';

  
  
  function getBodyweight($stateParams, BodyweightsService) {
    return BodyweightsService.get({
      bodyweightId: $stateParams.bodyweightId
    }).$promise;
  }
  getBodyweight.$inject = ['$stateParams', 'BodyweightsService'];

  

  function newBodyweight(BodyweightsService) {
    return new BodyweightsService();
  }
  newBodyweight.$inject = ['BodyweightsService'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('bodyweights', {
        abstract: true,
        url: '/bodyweights',
        template: '<ui-view/>'
      })
      .state('bodyweights.list', {
        url: '',
        templateUrl: 'modules/bodyweights/views/list-bodyweights.client.view.html',
        controller: 'BodyweightsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Bodyweights List'
        }
      })
      .state('bodyweights.create', {
        url: '/create',
        templateUrl: 'modules/bodyweights/views/form-bodyweight.client.view.html',
        controller: 'BodyweightsController',
        controllerAs: 'vm',
        resolve: {
          bodyweightResolve: newBodyweight
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Bodyweights Create'
        }
      })
      .state('bodyweights.edit', {
        url: '/:bodyweightId/edit',
        templateUrl: 'modules/bodyweights/views/form-bodyweight.client.view.html',
        controller: 'BodyweightsController',
        controllerAs: 'vm',
        resolve: {
          bodyweightResolve: getBodyweight
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Bodyweight {{ bodyweightResolve.name }}'
        }
      })
      .state('bodyweights.view', {
        url: '/:bodyweightId',
        templateUrl: 'modules/bodyweights/views/view-bodyweight.client.view.html',
        controller: 'BodyweightsController',
        controllerAs: 'vm',
        resolve: {
          bodyweightResolve: getBodyweight
        },
        data: {
          pageTitle: 'Bodyweight {{ bodyweightResolve.name }}'
        }
      });
  }
  routeConfig.$inject = ['$stateProvider']; 
  
  angular
    .module('bodyweights')
    .config(routeConfig);
  
}());
