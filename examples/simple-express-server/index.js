'use strict';

require('dotenv').config();
const debug = require('debug')('simple-express-server');
const app = require('express')();
const cors = require('cors');
const figlet = require('figlet');

app.use(cors());
app.options('*', cors());

const myMetrics = {
  a: require('./my-metrics/a'),
  b: require('./my-metrics/b')
};

const mySERPs = {
  personalSERP: require('./my-serps/my-serp')
};

const stare = require('../..')({
  engines: ['baremo'],
  personalMetrics: myMetrics,
  personalSERPs: mySERPs,
  // google: {
  //   apiKey: process.env.GOOGLE_API_KEY,
  //   apiCx: process.env.GOOGLE_API_CX
  // },
  // bing: {
  //   serviceKey: process.env.BING_SERVICE_KEY
  // }
});

app.get('/:engine', (request, response) => {
  let engine = request.params.engine;
  let { query, numberOfResults } = request.query;

  // let metrics = [];
  let metrics = ['lawsuit-ammount', 'courts'];
  // let metrics = ['keywords-position', 'language', 'length', 'links', 'multimedia', 'perspicuity', 'ranking'];
  stare(engine, query, numberOfResults, metrics)
    .then(result => response.status(200).json(result))
    .catch(err => response.status(500).json(err));
});

app.listen(process.env.SERVER_PORT, () => {
  debug(figlet.textSync('StArE.js-server'));
  debug(`App running on [http://localhost:${process.env.SERVER_PORT}]!`);
});