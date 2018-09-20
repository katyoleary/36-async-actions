'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('recipe:list-router');
const List = require('../model/list.js');
const createError = require('http-errors');
const listRouter = module.exports = new Router();

listRouter.get('/api/list/:listId', function(req, res, next) {
  debug('GET: /api/list/:listId');

  List.findById(req.params.listId)
    .populate('recipes')
    .then( list => res.json(list))
    .catch( err => {
      createError(404, err.message);
      next();
    });
});

listRouter.get('/api/list', function(req, res, next) {
  List.find({})
    .then( list => res.json(list))
    .catch( err => {
      createError(500, err.message);
      next();
    });
});

listRouter.post('/api/list', jsonParser, function(req, res, next) {
  debug('POST: /api/list');

  console.log(req.body);

  if (!req.body.name) next(createError(400, 'Bad request'));

  req.body.timestamp = new Date();
  new List(req.body).save()
    .then( list => res.json(list))
    .catch( err => {
      createError(404, err.message);
      next();
    });
});

listRouter.put('/api/list/:listId', jsonParser, function(req, res, next) {
  debug('PUT: /api/list/:listId');

  if (!req.body.name) next(createError(400, 'Bad request'));

  List.findByIdAndUpdate(req.params.listId, req.body, {new: true})
    .then( list => res.json(list))
    .catch( err => {
      if (err.name === 'ValidationError') return next(err);
      next(createError(404, err.message));
    });
});

listRouter.delete('/api/list/:listId', function(req, res, next) {
  debug('DELETE: /api/list/:listId');

  List.findByIdAndRemove(req.params.listId)
    .then( () => res.status(200).send())
    .catch( err => next(createError(404, err.message)));
});