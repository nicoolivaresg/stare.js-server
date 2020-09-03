'use strict';
var debug = require('debug')('stare.js:server/metrics/links');
const scrapper = require('../scrapper');
const cheerio = require('cheerio');
const url = require('url');
const psl = require('psl');

const _ = require('lodash');

function getHostname(source) {
  try {
    if (_.isEmpty(source) || source === '#') {
      return null;
    }

    let urlParsed = url.parse(source);
    let hostname = _.get(urlParsed, 'hostname');
    let pslParsed = psl.parse(hostname);
    return _.get(pslParsed, 'domain');
  } catch (err) {
    return null;
  }
}

const TAG_MAPPING = {
  'a': 'href',
  'img': 'src', // TODO: support for srcset
  'video': 'src',
  'audio': 'src',
  'iframe': 'src',
  'source': 'src'
};

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
    scrapper.html(stareDocument)
      .then(data => {
        const $ = cheerio.load(data);

        let anchors = []
        let hostname = '';
        let tag, source, attrs;
        
        anchors.push(getHostname(_.get(stareDocument, 'link', '')));

        $('a, img, video, audio, iframe, source').each((i, el) => {
          tag = _.get(el, 'name');
          source = _.get(el, ['attribs', TAG_MAPPING[tag]]);
          hostname = getHostname(source);

          if ( ! _.isEmpty(hostname) && anchors.indexOf(hostname) == -1) {
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
          value: -1
        });
      });
  });
};

module.exports = exports = calculate;
