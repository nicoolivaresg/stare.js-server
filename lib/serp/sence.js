'use strict';

const debug = require('debug')('stare.js:server/serp/sence');
const _ = require('lodash');

try {
  const stareOptions = global.stareOptions;
  if (!_.has(stareOptions, 'sence')
    || !_.has(stareOptions.sence, 'baseUrl')
    || !_.has(stareOptions.sence, '_index')
    || !_.has(stareOptions.sence, '_source')
    || !_.has(stareOptions.sence, 'titleProperty')
    || !_.has(stareOptions.sence, 'snippetProperty')
    || !_.has(stareOptions.sence, 'imageProperty')) {
    throw new Error("NO_SENCE_OPTIONS");
  }
} catch (e) {
  debug("SENCE options not correctly configurated");
  process.exit(e.code);
}

const rp = require('request-promise');
const qs = require('qs');

const BASE_URL = global.stareOptions.sence.baseUrl;
const _INDEX = global.stareOptions.sence._index;
const _SOURCE = global.stareOptions.sence._source;
const TITLE_PROPERTY = global.stareOptions.sence.titleProperty;
const BODY_PROPERTY = global.stareOptions.sence.bodyProperty;
const LINK_PROPERTY = global.stareOptions.sence.linkProperty;
const SNIPPET_PROPERTY = global.stareOptions.sence.snippetProperty;
const IMAGE_PROPERTY = global.stareOptions.sence.imageProperty;

/**
 * Get the SERP from ElasticSearch and returns an object with the StArE.js standard format.
 *
 * @async
 * @param {string} query The search query.
 * @param {number} numberOfResults Number of documents to get from the SERP.
 * @returns {Promise} Promise object with the standarized StArE.js formatted SERP response from ElasticSearch.
 */
function getResultPages(query, numberOfResults) {
  if (!query || query.length === 0) {
    return Promise.reject(new Error('Query cannot be null.'));
  }

  let queryParams = {
    q: query,
    from: 0,
    rest_total_hits_as_int: true,
    size: numberOfResults || global.stareOptions.numberOfResults,
    track_scores: true,
    track_total_hits: true
  };

  let queryString = qs.stringify(queryParams);

  return new Promise((resolve, reject) => {
    let searchUrl = `${BASE_URL}/${_INDEX}/_search?${queryString}`;

    debug(`SENCE Search url [${searchUrl}]`);
    rp({
      uri: searchUrl,
      json: true
    })
      .then(
        senceResult => {
          let formattedResponse = {
            totalResults: senceResult.hits.total,
            searchTerms: query,
            numberOfItems: senceResult.hits.hits.length,
            startIndex: queryParams.from + 1,
            documents: []
          };

          // Extract the documents relevant info for Stare.js
          formattedResponse.documents = senceResult.hits.hits.map(item => ({
            title: _.get(item[_SOURCE], TITLE_PROPERTY),
            link: _.get(item[_SOURCE], LINK_PROPERTY, null),
            body: _.get(item, _SOURCE),
            snippet: _.get(item[_SOURCE], SNIPPET_PROPERTY),
            image: _.get(item[_SOURCE], IMAGE_PROPERTY)
          }));

          resolve(formattedResponse);
        },
        err => reject(err))
      .catch(err => reject(err));
  });
}

module.exports = exports = getResultPages;
