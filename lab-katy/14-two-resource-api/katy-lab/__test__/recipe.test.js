'use strict';

const request = require('superagent');
const List = require('../model/list.js');
const Recipe = require('../model/recipe.js');
const PORT = process.env.PORT || 3000;
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = `http://localhost:${PORT}`;

const exampleRecipe = {
  name: 'Test recipe name',
  prepTime: '20 min',
  cookTime: '30 min',
};

const exampleList = {
  name: 'Test recipe list',
  timestamp: new Date(),
};

describe('Recipe Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('GET: /api/recipe/:recipeId', function() {
    describe('with a valid body', function() {
      beforeEach( done => {
        new List(exampleList).save()
          .then( list => {
            exampleRecipe.listId = list._id;
          })
          .then( () => {
            new Recipe(exampleRecipe).save()
              .then( recipe => {
                this.tempRecipe = recipe;
                done();
              })
              .catch(done);
          })
          .catch(done);
      });
      afterEach( done => {
        if (this.tempRecipe) {
          List.remove({})
            .then( () => done())
            .catch(done);
          return;
        }
        done();
      });
      it('should return a recipe', done => {
        request.get(`${url}/api/recipe/${this.tempRecipe._id}`)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(exampleRecipe.name);
            done();
          });
      });
    });
    describe('without a valid recipe _id', () => {
      it('should return a 404 error', done => {
        request.get(`${url}/api/recipe/12345`)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(res.body.text).toEqual();
            done();
          });
      });
    });
  });

  describe('POST: /api/list/:listId/recipe', function() {
    describe('with a valid list id & recipe body', () => {
      beforeEach( done => {
        new List(exampleList).save()
          .then( list => {
            this.tempList = list;
            done();
          })
          .catch(done);
      });
      afterEach( done => {
        Promise.all([
          List.remove({}),
          Recipe.remove({}),
        ])
          .then( () => done())
          .catch(done);
      });
      it('should return a recipe', done => {
        request.post(`${url}/api/list/${this.tempList._id}/recipe`)
          .send(exampleRecipe)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.name).toEqual(exampleRecipe.name);
            expect(res.body.listId).toEqual(this.tempList._id.toString());
            done();
          });
      });
    });
    describe('without a valid list id', () => {
      it('should return a 404 error', done => {
        request.post(`${url}/api/list/12345/recipe`)
          .send(exampleRecipe)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(res.body.text).toEqual();
            done();
          });
      });
    });
  });

  describe('PUT: /api/recipe/:recipeId', function() {
    describe('with a valid body', function() {
      beforeEach( done => {
        new List(exampleList).save()
          .then( list => {
            exampleRecipe.listId = list._id;
          })
          .then( () => {
            new Recipe(exampleRecipe).save()
              .then( recipe => {
                this.tempRecipe = recipe;
                done();
              })
              .catch(done);
          })
          .catch(done);
      });
      afterEach( done => {
        if (this.tempRecipe) {
          List.remove({})
            .then( () => done())
            .catch(done);
          return;
        }
        done();
      });
      it('should return a recipe', done => {
        exampleRecipe.name = 'Updated recipe';
        request.put(`${url}/api/recipe/${this.tempRecipe._id}`)
          .send(exampleRecipe)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(exampleRecipe.name);
            done();
          });
      });
    });
    describe('without a valid recipe _id', () => {
      it('should return a 404 error', done => {
        request.put(`${url}/api/recipe/12345`)
          .send(exampleRecipe)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(res.body.text).toEqual();
            done();
          });
      });
    });
  });

  describe('DELETE: /api/recipe/:recipeId', function() {
    describe('with a valid body', function() {
      beforeEach( done => {
        new List(exampleList).save()
          .then( list => {
            exampleRecipe.listId = list._id;
          })
          .then( () => {
            new Recipe(exampleRecipe).save()
              .then( recipe => {
                this.tempRecipe = recipe;
                done();
              })
              .catch(done);
          })
          .catch(done);
      });
      it('should delete a recipe', done => {
        request.delete(`${url}/api/recipe/${this.tempRecipe._id}`)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
    describe('without a valid recipe _id', () => {
      it('should return a 404 error', done => {
        request.delete(`${url}/api/recipe/12345`)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(res.body.text).toEqual();
            done();
          });
      });
    });
  });
});