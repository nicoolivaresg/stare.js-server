const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');

app.use(cors());
app.options('*', cors());

const stare = require('stare');

app.use('/serp/:engine', (request, response) => {
  let engine = request.params.engine;
  let { query, pageNumber } = request.query;

  let metrics = ['language', 'ranking'];
  // let metrics = ['language', 'length', 'perpiscuity', 'ranking'];

  stare(engine, query, pageNumber, metrics, (result, err) => {
    if (err) {
      response.status(500).send(err);
    }
    response.send(result);
  });
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Example app listening on port ${process.env.BACKEND_PORT}!`);
});