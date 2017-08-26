'use strict';

/**
 * Module dependencies
 */
var bodyweightsPolicy = require('../policies/bodyweights.server.policy'),
  bodyweights = require('../controllers/bodyweights.server.controller');

module.exports = function(app) {
  // Bodyweights Routes
  app.route('/api/bodyweights').all(bodyweightsPolicy.isAllowed)
    .get(bodyweights.list)
    .post(bodyweights.create);

  app.route('/api/bodyweights/:bodyweightId').all(bodyweightsPolicy.isAllowed)
    .get(bodyweights.read)
    .put(bodyweights.update)
    .delete(bodyweights.delete);

  // Finish by binding the Bodyweight middleware
  app.param('bodyweightId', bodyweights.bodyweightByID);
};
