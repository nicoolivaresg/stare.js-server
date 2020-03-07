const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const debug = require('debug')('simple-express-server');

const cors = require('cors');

app.use(cors());
app.options('*', cors());

const myMetrics = {
  a: require('./my-metrics/a'),
  b: require('./my-metrics/b')
};

const stare = require('../..')({
  tempFilesPath: './my-personal-temp',
  personalMetrics: myMetrics
});

app.get('/:engine', (request, response) => {
  let engine = request.params.engine;
  let { query, pageNumber } = request.query;

  let metrics = ['language', 'ranking', 'language', 'perspicuity', 'a', 'b'];

  stare(engine, query, pageNumber, metrics)
    .then(result => {
      response.json(result);
    })
    .catch(err => {
      debug(`Error: %O`, err);
      response.status(500).json(err);
    });
});

app.listen(process.env.SERVER_PORT, () => {
  debug(`simple-express-server app listening on port http://localhost:${process.env.SERVER_PORT}!`);
});