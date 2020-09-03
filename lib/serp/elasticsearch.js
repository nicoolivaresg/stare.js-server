'use strict';

const debug = require('debug')('stare.js:server/serp/elasticsearch');
const _ = require('lodash');

try {
  const stareOptions = global.stareOptions;
  if (! _.has(stareOptions, 'elasticsearch')
      || ! _.has(stareOptions.elasticsearch, 'baseUrl')
      || ! _.has(stareOptions.elasticsearch, '_index')
      || ! _.has(stareOptions.elasticsearch, '_source')
      || ! _.has(stareOptions.elasticsearch, 'titleProperty')
      || ! _.has(stareOptions.elasticsearch, 'snippetProperty')
      || ! _.has(stareOptions.elasticsearch, 'imageProperty')) {
    throw new Error("NO_ELASTICSEARCH_OPTIONS");
  }
} catch(e) {
  debug("ElasticSearch options not correctly configurated");
  process.exit(e.code);
}

const rp = require('request-promise');
const qs = require('qs');

const BASE_URL = global.stareOptions.elasticsearch.baseUrl;
const _INDEX = global.stareOptions.elasticsearch._index;
const _SOURCE = global.stareOptions.elasticsearch._source;
const TITLE_PROPERTY = global.stareOptions.solr.titleProperty;
const BODY_PROPERTY = global.stareOptions.solr.bodyProperty;
const LINK_PROPERTY = global.stareOptions.solr.linkProperty;
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
    
    debug(`Elastic Search url [${searchUrl}]`);
    rp({
      uri: searchUrl,
      json: true
    })
      .then(
        elasticResult => {
          let formattedResponse = {
            totalResults: elasticResult.hits.total,
            searchTerms: '',
            numberOfItems: elasticResult.hits.hits.length,
            startIndex: queryParams.from + 1,
            documents: []
          };

          // Extract the documents relevant info for Stare.js
          formattedResponse.documents = elasticResult.hits.hits.map(item => ({
            title: _.get(item, TITLE_PROPERTY),
            link: _.get(item, LINK_PROPERTY, null),
            body: _.get(item, BODY_PROPERTY, null),
            snippet: _.get(item, SNIPPET_PROPERTY),
            image: _.get(item, IMAGE_PROPERTY)
          }));

          resolve(formattedResponse);
        },
        err => reject(err))
      .catch(err => reject(err));
  });
}

module.exports = exports = getResultPages;
