'use strict';

const fs = require('fs');
const path = require('path');
var debug = require('debug')('stare-js:server');

const {
  bing,
  ecosia,
  google
} = require('./serp');

// Same as above
const supportedEngines = [
  'bing',
  'ecosia',
  'google'
];

const getMetrics = require('./metrics');


/**
 * This callback type is called `requestCallback` and is displayed as a global symbol.
 *
 * @callback requestCallback
 * @param {Object} formattedResponse
 * @param {string} errorMessage
 */

 /**
 * Makes a request to the specified search engine which returns (callback),
 * the SERP with the calculated metrics.

 * @param {string} engine
 * @param {string} query
 * @param {number} pageNumber
 * @param {array} metrics
 * @param {requestCallback} callback
 */
function webSearch(engine, query, pageNumber, metrics) {
  return new Promise((resolve, reject) => {
    debug(`Starting webSearch`);
    if (supportedEngines.indexOf(engine) === -1) {
      debug(`Search Engine '${engine}' not supported.`);
      reject(`Search Engine '${engine}' not supported.`);
    }

    metrics = metrics || [];

    let searchEngine = eval(engine);
    
    debug(`Sending search engine promise`);
    searchEngine.getResultPages(query, pageNumber)
      .then(response => {
        debug(`Getting SERP response: %o`, response);
        let formattedResponse = searchEngine.processAndFormat(response);
        
        debug(`Getting metrics for formatted response: %o`, formattedResponse);
        getMetrics(formattedResponse, metrics)
          .then(values => {
            for (let response of values) {
              formattedResponse.documents[response.index][response.name] = response.value;
            }
            resolve(formattedResponse);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
    });
}

global.stareOptions = {
  /* Temporal files path, where the documents html/text will be saved as an html/txt file */
  tempFilesPath: '/temp/',
  /* Metrics modules/function created by the user */
  personalMetrics: []
};

/**
 * Module exports a constructor with the optional StArE.js parameters
 * as an argument.
 * @param {Object} [opts = {}] - Optional configurations for StArE.js
 */
module.exports = exports = (opts) => {

  opts = opts || {};
  debug(`Optionals: %o`, opts);

  for (let key in global.stareOptions) {
    if (opts.hasOwnProperty(key)) {
      global.stareOptions[key] = opts[key];
    }
  }

  /* Create forlder if needed */
  global.stareOptions.tempFilesPath = path.join(__dirname, global.stareOptions.tempFilesPath);
  if (!fs.existsSync(global.stareOptions.tempFilesPath)) {
    fs.mkdirSync(global.stareOptions.tempFilesPath);
  }

  return webSearch;
};