'use strict';

var debug = require('debug')('stare-js:server/metrics/');

const availableMetrics = {
  language: require('./language'),
  length: require('./length'),
  perspicuity: require('./perspicuity'),
  ranking: require('./ranking')
};

for (const metric in global.stareOptions.personalMetrics) {
  availableMetrics[metric] = global.stareOptions.personalMetrics[metric];
}

async function getMetrics(serpResponse, metrics) {
  let promises = [];
  // There is no metrics to calculate.
  if (metrics.length === 0) {
    return Promise.all(promises);
  }

  for (let index = 0; index < serpResponse.numberOfItems; index++) {
    // Either the metric uses serp or not is easier to load this info now than 
    // conditionally decide it after.
    let opts = {
      searchInfo: {
        totalResults: serpResponse.totalResults,
        searchTerms: serpResponse.searchTerms,
        numberOfItems: serpResponse.numberOfItems,
        startIndex: serpResponse.startIndex
      },
      index: index
    };
    // Define which info each metric will require
    for (let metric of metrics) {
      let metricAsFunction = eval(availableMetrics[metric]);
      
      if (typeof metricAsFunction === 'function') {
        promises.push(metricAsFunction(serpResponse.documents[index], opts));
      } else {
        debug(`Metric '${metric}' is not a function.`);
      }
    }
  }

  return Promise.all(promises);
};

module.exports = exports = getMetrics;