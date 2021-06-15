'use strict';

const _ = require('lodash');


/**
 * Defines the injurie origin of the stare-format document based
 * on the body.
 *
 * @async
 * @param {Object} stareDocument  The Document data with stare format
 * @param {string} stareDocument.title  Document title
 * @param {string} stareDocument.link  Document link
 * @param {string} stareDocument.snippet  Document snippet
 * @param {string} stareDocument.image  Document image
 * @param {Object} opts  Optional parameters to calculate the metric 
 * @param {Object} opts.searchInfo  Search info for the query associated to the document
 * @param {string} opts.searchInfo.totalResults  Total documents that generates the query (formatted with dots '.' in the thousands)
 * @param {string} opts.searchInfo.searchTerms  Query string
 * @param {integer} opts.searchInfo.numberOfItems  Number of documents that contains this page result
 * @param {integer} opts.searchInfo.startIndex  Start document ranking for this page result.
 * @returns {Promise}
 */
function calculate(stareDocument, opts) {
  return new Promise((resolve, reject) => {
    let incapacity = null;
    
    if (_.has(stareDocument, 'body.porcentajeIncapacidad')) {
        incapacity = _.get(stareDocument, 'body.porcentajeIncapacidad');
        incapacity = incapacity.replace("%", "");
        incapacity = incapacity.replace(",", ".");
        incapacity = parseFloat(incapacity)
    }else{
        incapacity = parseFloat("0");
    }

    resolve({
      name: 'incapacity',
      index: opts.index,
      value: incapacity
    });
  })
};

module.exports = exports = calculate;