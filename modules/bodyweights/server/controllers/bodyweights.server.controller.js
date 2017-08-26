'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bodyweight = mongoose.model('Bodyweight'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Bodyweight
 */
exports.create = function(req, res) {
  var bodyweight = new Bodyweight(req.body);
  bodyweight.user = req.user;

  bodyweight.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bodyweight);
    }
  });
};

/**
 * Show the current Bodyweight
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var bodyweight = req.bodyweight ? req.bodyweight.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  bodyweight.isCurrentUserOwner = req.user && bodyweight.user && bodyweight.user._id.toString() === req.user._id.toString();

  res.jsonp(bodyweight);
};

/**
 * Update a Bodyweight
 */
exports.update = function(req, res) {
  var bodyweight = req.bodyweight;

  bodyweight = _.extend(bodyweight, req.body);

  bodyweight.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bodyweight);
    }
  });
};

/**
 * Delete an Bodyweight
 */
exports.delete = function(req, res) {
  var bodyweight = req.bodyweight;

  bodyweight.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bodyweight);
    }
  });
};

/**
 * List of Bodyweights
 */
exports.list = function(req, res) {
  Bodyweight.find().sort('-created').populate('user', 'displayName').exec(function(err, bodyweights) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bodyweights);
    }
  });
};

/**
 * Bodyweight middleware
 */
exports.bodyweightByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bodyweight is invalid'
    });
  }

  Bodyweight.findById(id).populate('user', 'displayName').exec(function (err, bodyweight) {
    if (err) {
      return next(err);
    } else if (!bodyweight) {
      return res.status(404).send({
        message: 'No Bodyweight with that identifier has been found'
      });
    }
    req.bodyweight = bodyweight;
    next();
  });
};
