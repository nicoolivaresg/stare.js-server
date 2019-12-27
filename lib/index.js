'use strict';

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

var configurableOptions = {
  tempFilesPath: '.',
  personalMetrics: []
};

function config(opts) {
  if (typeof opts === null) {
    return configurableOptions;
  }

  for (let key of configurableOptions) {
    if (opts.hasOwnProperty(key)) {
      configurableOptions[key] = opts[key];
    }
  }
}

 /**
 * Makes a request to the specified search engine which returns (callback),
 * the SERP with the calculated metrics.

 * @param {string} engine
 * @param {string} query
 * @param {number} pageNumber
 * @param {array} metrics
 * @param {function} callback
 */
function webSearch(engine, query, pageNumber, metrics, callback) {
  if (supportedEngines.indexOf(engine) === -1) {
    throw `Search Engine '${engine}' not supported.`;
  }

  metrics = metrics || [];

  let searchEngine = eval(engine);
  
  searchEngine.getResultPages(query, pageNumber)
    .then(response => {
      let formattedResponse = searchEngine.processAndFormat(response);
      
      getMetrics(formattedResponse, metrics)
        .then(values => {
          for (let response of values) {
            formattedResponse.documents[response.index][response.name] = response.value;
          }
          callback(formattedResponse);
        });
    })
    .catch(err => {
      console.error(err);
      callback(null, err.message);
    });
}

module.exports = exports = webSearch;