const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

app.use(cors());
app.options('*', cors());

const stare = require('../..')();

app.get('/:engine', (request, response) => {
  let engine = request.params.engine;
  let { query, pageNumber } = request.query;

  // let metrics = ['ranking', 'length'];
  let metrics = ['language', 'length', 'perpiscuity', 'ranking'];

  stare(engine, query, pageNumber, metrics)
    .then(result => {
      response.json(result);
    })
    .catch(err => {
      console.log(`Error: %o`, err);
      response.status(500).json(err);
    });
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`simple-express-server app listening on port http://localhost:${process.env.BACKEND_PORT}!`);
});