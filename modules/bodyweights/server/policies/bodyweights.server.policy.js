'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Bodyweights Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/bodyweights',
      permissions: '*'
    }, {
      resources: '/api/bodyweights/:bodyweightId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/bodyweights',
      permissions: ['get', 'post']
    }, {
      resources: '/api/bodyweights/:bodyweightId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/bodyweights',
      permissions: ['get']
    }, {
      resources: '/api/bodyweights/:bodyweightId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Bodyweights Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Bodyweight is being processed and the current user created it then allow any manipulation
  if (req.bodyweight && req.user && req.bodyweight.user && req.bodyweight.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
