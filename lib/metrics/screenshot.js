'use strict';
var debug = require('debug')('stare.js:server/metrics/screenshot');
const fs = require('fs');
const captureWebsite = require('capture-website');
const _ = require('lodash');

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
    captureWebsite.buffer(stareDocument.link)
      .then(img => {
        fs.writeFileSync(`${__dirname}/document-${opts.index}.png`, img);
        console.log(`open ${__dirname}/document-${opts.index}.png`);
        
        // let base64Img = Buffer.from(img, 'binary').toString('base64');
        
        resolve({
          name: 'screenshot',
          index: opts.index,
          value: 'done'
          // value: base64Img
        });
      })
      .catch(err => {
        debug(err);
        resolve({
          name: 'screenshot',
          index: opts.index,
          value: -1
          // value: base64Img
        });
      });
  });
};

module.exports = exports = calculate;
