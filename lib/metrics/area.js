'use strict';

const { reject } = require('lodash');
const _ = require('lodash');

/**
 * Defines accused company's name from the stare-format document based
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
    return new Promise(async (resolve, reject) => {
        let area = null

        if (_.has(stareDocument, 'body.Área')) {
            area = _.get(stareDocument, 'body.Área');
        } 

        resolve({
            name: 'area',
            index: opts.index,
            value: area
        });
    })
}

module.exports = exports = calculate;