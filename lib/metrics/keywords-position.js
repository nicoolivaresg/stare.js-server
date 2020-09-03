'use strict';
var debug = require('debug')('stare.js:server/metrics/keywords-position');
const scrapper = require('../scrapper');

/**
 * Calculates number of multimedia elements of the document.
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
    scrapper.text(stareDocument)
      .then(text => {
        // Remove original line breaks
        text = text.replace(/[^\S ]+/g, '').toLowerCase();
        let keywords = opts.searchInfo.searchTerms.split(' ');

        let positions = {
          documentLength: text.length,
          keywords: {} 
        };

        keywords.forEach(keyword => {
          positions.keywords[keyword] = [];
          let indexPosition = 0;

          while (indexPosition != -1 && indexPosition < text.length) {
            indexPosition = text.indexOf(keyword.toLowerCase(), indexPosition);
            if (indexPosition === -1) {
              break;
            }
            positions.keywords[keyword].push(indexPosition);
            indexPosition++;
          }
        });

        resolve({
          name: 'keywords-position',
          index: opts.index,
          value: positions
        });
      })
      .catch(err => {
        resolve({
          name: 'keywords-position',
          index: opts.index,
          value: -1
        });
      });
  });
};

module.exports = exports = calculate;
