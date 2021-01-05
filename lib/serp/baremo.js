'use strict';

const debug = require('debug')('stare.js:server/serp/baremo');
const _ = require('lodash');

try {
  const stareOptions = global.stareOptions;
  if (!_.has(stareOptions, 'baremo')
    || !_.has(stareOptions.baremo, 'baseUrl')
    || !_.has(stareOptions.baremo, '_index')
    || !_.has(stareOptions.baremo, '_source')
    || !_.has(stareOptions.baremo, 'titleProperty')
    || !_.has(stareOptions.baremo, 'snippetProperty')
    || !_.has(stareOptions.baremo, 'imageProperty')) {
    throw new Error("NO_ELASTICSEARCH_OPTIONS");
  }
} catch (e) {
  debug("Baremo options not correctly configurated");
  process.exit(e.code);
}

const rp = require('request-promise');
const qs = require('qs');

const BASE_URL = global.stareOptions.elasticsearch.baseUrl;
const _INDEX = global.stareOptions.elasticsearch._index;
const _SOURCE = global.stareOptions.elasticsearch._source;
const TITLE_PROPERTY = global.stareOptions.elasticsearch.titleProperty;
const BODY_PROPERTY = global.stareOptions.elasticsearch.bodyProperty;
const LINK_PROPERTY = global.stareOptions.elasticsearch.linkProperty;
const SNIPPET_PROPERTY = global.stareOptions.elasticsearch.snippetProperty;
const IMAGE_PROPERTY = global.stareOptions.elasticsearch.imageProperty;

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

    debug(`Baremo Search url [${searchUrl}]`);
    rp({
      uri: searchUrl,
      json: true
    })
      .then(
        baremoResult => {
          let formattedResponse = {
            totalResults: baremoResult.hits.total,
            searchTerms: query,
            numberOfItems: baremoResult.hits.hits.length,
            startIndex: queryParams.from + 1,
            documents: []
          };

          // Extract the documents relevant info for Stare.js
          formattedResponse.documents = baremoResult.hits.hits.map(item => ({
            title: _.get(item[_SOURCE], TITLE_PROPERTY),
            link: _.get(item[_SOURCE], LINK_PROPERTY, null),
            body: _.get(item[_SOURCE], BODY_PROPERTY, null),
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
