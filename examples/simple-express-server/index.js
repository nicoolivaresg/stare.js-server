'use strict';

require('dotenv').config();
const debug = require('debug')('simple-express-server');
const app = require('express')();
const cors = require('cors');

app.use(cors());
app.options('*', cors());

const myMetrics = {
  a: require('./my-metrics/a'),
  b: require('./my-metrics/b')
};

const stare = require('../..')({
  engines: ['google'],
  personalMetrics: myMetrics,
  google: {
    apiKey: process.env.GOOGLE_API_KEY,
    apiCx: process.env.GOOGLE_API_CX
  }
});

app.get('/:engine', (request, response) => {
  let engine = request.params.engine;
  let { query, numberOfResults } = request.query;

  let metrics = ['ranking', 'keywords-position'];

  stare(engine, query, numberOfResults, metrics)
    .then(result => response.status(200).json(result))
    .catch(err => response.status(500).json(err));
});

app.listen(process.env.SERVER_PORT, () => {
  debug(`app listening on [http://localhost:${process.env.SERVER_PORT}]!`);
  console.log(`app listening on [http://localhost:${process.env.SERVER_PORT}]!`);
});