'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Recipe = require('./recipe.js');
const debug = require('debug')('recipe:list');
const createError = require('http-errors');

const listSchema = Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'recipe' }],
});

const List = module.exports = mongoose.model('list', listSchema);

List.findByIdAndAddRecipe = function(id, recipe) {
  debug('findByIdAndAddRecipe');

  return List.findById(id)
    .then( list => {
      recipe.listId = list._id;
      this.tempList = list;
      return new Recipe(recipe).save();
    })
    .then( recipe => {
      this.tempList.recipes.push(recipe._id);
      this.tempRecipe = recipe;
      return this.tempList.save();
    })
    .then( () => {
      return this.tempRecipe;
    })
    .catch( err => Promise.reject(createError(404, err.message)));
};