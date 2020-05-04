'use strict';
var debug = require('debug')('stare.js:server/metrics/links');
const scrapper = require('../scrapper');
const cheerio = require('cheerio');
const url = require('url');

function getHostname(href, i) {
  try {
    if (typeof href === undefined || href === '#') {
      return null;
    }

    let anchorUrl = url.parse(href);

    return anchorUrl.hostname;
  } catch (err) {
    return null;
  }
}

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
    scrapper.html(stareDocument.link)
      .then(data => {
        const $ = cheerio.load(data);
        let anchors = []
        let hostname = '';
        // $('a, img, video, audio')
        $('a').attr('href', (i, el) => {
          hostname = getHostname(el, opts.index);
          if (hostname !== null && anchors.indexOf(hostname) == -1) {
            anchors.push(hostname);
          }
        });

        resolve({
          name: 'links',
          index: opts.index,
          value: anchors
        });
      })
      .catch(err => {
        resolve({
          name: 'links',
          index: opts.index,
          value: -1 // error
        });
      });
  });
};

module.exports = exports = calculate;
