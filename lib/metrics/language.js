'use strict';

const LanguageDetect = require('languagedetect');
const _ = require('lodash');

const lngDetector = new LanguageDetect();

/**
 * Defines the language of the stare-format document based
 * on the snippet.
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
    let language = null;
    
    if (_.has(stareDocument, 'body') && stareDocument.body !== null && stareDocument.body.length > 0) {
      language = lngDetector.detect(stareDocument.body, 1)[0][0];
    } else if (_.has(stareDocument, 'snippet') && stareDocument.snippet !== null && stareDocument.snippet.length > 0) {
      language = lngDetector.detect(stareDocument.snippet, 1)[0][0];
    }

    resolve({
      name: 'language',
      index: opts.index,
      value: language
    });
  })
};

module.exports = exports = calculate;
