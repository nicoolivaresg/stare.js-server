'use strict';

const { reject } = require('lodash');
const debug = require('debug')('stare.js:server/metrics/qualification-level')
const _ = require('lodash');
const natural = require('natural');

/**
 * Defines the process to obtain the qualification level from a plan
 * @param {Array<object>} stareDocument 
 * @returns {Array<string>}
 */
function process(stareDocument) {
    let level='';
    return new Promise((resolve, reject) => {
        try {
            let tmp = stareDocument.split("NIVEL CUALIFICACION Nivel ");
            level =  tmp[1] ?  `NIVEL ${tmp[1].split('\n')[0]}` : '-'
            resolve(level.trim());
        } catch (error) {
            debug('Error ' + error);
            reject(level);
        }
    });
}


/**
 * Defines qualification level from the stare-format document based
 * on tSENCE plan.
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
        var level = null

        if (_.has(stareDocument, 'body.attachment.content')) {

            try {
                level = await process(_.get(stareDocument, 'body.attachment.content'));                
            } catch (error) {
                reject(error);
            }
            
        }

        resolve({
            name: 'qualification-level',
            index: opts.index,
            value: level
        });
    })
}

module.exports = exports = calculate;