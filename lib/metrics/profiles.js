'use strict';

const _ = require('lodash');

/**
 * Calculates associated profiles from stareDocument.
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
  let associated_profiles = undefined;
  return new Promise((resolve, reject) => {
    if(_.has(stareDocument, 'body') && stareDocument.body !== null && stareDocument.body.length !== null){
      if (_.has(stareDocument.body, 'Perfiles Asociados')) {
        associated_profiles = _.get(stareDocument.body, 'Perfiles Asociados','');
      }
    }
    resolve({
      name: 'profiles',
      index: opts.index,
      value: associated_profiles
    });
  });
};

module.exports = exports = calculate;
