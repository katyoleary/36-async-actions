'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('recipe:server');
const listRouter = require('./router/list-router.js');
const recipeRouter = require('./router/recipe-router.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/recipesdb';

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(listRouter);
app.use(recipeRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server listening on port ${PORT}`);
});

server.isRunning = true;