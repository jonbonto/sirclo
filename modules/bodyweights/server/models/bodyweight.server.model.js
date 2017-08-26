'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bodyweight Schema
 */
var BodyweightSchema = new Schema({
  date: {
    type: Date,
    unique: true,
    default: Date.now,
    required: 'Please fill Bodyweight date'
  },
  max:{
    type: Number,
    default: 0,
    required: 'Please fill Bodyweight max'
  },
  min:{
    type: Number,
    default: 0,
    required: 'Please fill Bodyweight min'
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Bodyweight', BodyweightSchema);
