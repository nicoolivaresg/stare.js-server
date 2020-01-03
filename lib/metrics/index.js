const language = require('./language');
const length = require('./length');
const perpiscuity = require('./perpiscuity');
const ranking = require('./ranking');


async function getMetrics(serpResponse, metrics) {
  let promises = [];
  // There is no metrics to calculate.
  if (metrics.length === 0) {
    return Promise.all(promises);
  }

  // let availableMetrics = global.stareOptions.personalMetrics;

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
    // Define which info each of the metrics will require
    for (let metric of metrics) {
      let metricAsFunction = eval(metric);
      promises.push(metricAsFunction(serpResponse.documents[index], opts));
    }
  }

  return Promise.all(promises);
};

module.exports = exports = getMetrics;