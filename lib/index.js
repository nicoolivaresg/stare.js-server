'use strict';

require('./config/options');
const fs = require('fs');
const path = require('path');
var debug = require('debug')('stare.js:server');

const {
  bing,
  ecosia,
  google,
  elasticsearch
} = require('./serp');

// Same as above
const supportedEngines = [
  'bing',
  'ecosia',
  'google',
  'elasticsearch'
];

/* Will be used to load the metrics (default + user metrics). */
let getMetrics;

 /**
 * Makes a request to the specified search engine which returns (callback),
 * the SERP with the calculated metrics.
 *
 * @async
 * @function webSearch
 * @param {string} engine SERP to use [google|bing|ecosia|elasticsearch]
 * @param {string} query Search query
 * @param {number} pageNumber Page number in the result pages
 * @param {array} metrics Array with the name of the metrics to calculate
 * @return {Promise<Object>} An object with the standardized result page (SERP)
 */
function webSearch(engine, query, pageNumber, metrics) {
  return new Promise((resolve, reject) => {
    if (supportedEngines.indexOf(engine) === -1) {
      reject(`Search Engine '${engine}' not supported.`);
    }

    metrics = metrics || [];

    let searchEngine = eval(engine);
    
    searchEngine(query, pageNumber)
      .then(formattedResponse => {
        debug(`Getting metrics for formatted response: %O`, formattedResponse);
        getMetrics(formattedResponse, metrics)
          .then(values => {
            for (let response of values) {
              if (typeof formattedResponse.documents[response.index]['metrics'] === 'undefined') {
                formattedResponse.documents[response.index]['metrics'] = {};
              }
              formattedResponse.documents[response.index]['metrics'][response.name] = response.value;
            }
            resolve(formattedResponse);
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
    });
}

/**
 * Module exports a constructor with the optional StArE.js parameters
 * as an argument.
 * @param {Object} [opts = {}] - Optional configurations for StArE.js
 */
module.exports = exports = (opts) => {

  opts = opts || {};
  debug(`Optionals: %O`, opts);

  for (let key in global.stareOptions) {
    if (opts.hasOwnProperty(key)) {
      global.stareOptions[key] = opts[key];
    }
  }

  /* Has to be imported after set the optional "personalMetrics" so all can be indexed */
  getMetrics = require('./metrics');

  /* Set and create temporal folder if needed */
  global.stareOptions.tempFilesPath = path.resolve(process.cwd(), global.stareOptions.tempFilesPath);

  if (!fs.existsSync(global.stareOptions.tempFilesPath)) {
    fs.mkdirSync(global.stareOptions.tempFilesPath);
  }

  return webSearch;
};