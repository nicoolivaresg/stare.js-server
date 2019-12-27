const language = require('./language');
const length = require('./length');
const perpiscuity = require('./perpiscuity');
const ranking = require('./ranking');


async function getMetrics(serpResponse, metrics) {
  // There is no metrics to calculate.
  if (metrics.length === 0) {
    return false;
  }

  let promises = [];
  
  // Either the metric uses serp or not is easier to load this info now than 
  // conditionally decide it after.
  let opts = {
    searchInfo: {
      totalResults: serpResponse.totalResults,
      searchTerms: serpResponse.searchTerms,
      numberOfItems: serpResponse.numberOfItems,
      startIndex: serpResponse.startIndex
    }
  };

  for (let index = 0; index < serpResponse.numberOfItems; index++) {
    // Define which info each of the metrics will require
    opts.index = index;

    for (let metric of metrics) {
      let metricAsVariable = eval(metric);

      // Get & set the value of the metric as a new property inside the document.
      promises.push(metricAsVariable.calculate(serpResponse.documents[index], opts));
    }
  }

  return Promise.all(promises);
};

module.exports = exports = getMetrics;