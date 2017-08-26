// Bodyweights service used to communicate Bodyweights REST endpoints
(function () {
  'use strict';

  function BodyweightsService($resource) {
    return $resource('api/bodyweights/:bodyweightId', {
      bodyweightId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
  
  BodyweightsService.$inject = ['$resource'];

  angular
    .module('bodyweights')
    .factory('BodyweightsService', BodyweightsService);

}());
