'use strict';

const debug = require('debug')('stare.js:server/serp/solr');

try {
  // is configuration setted up
} catch(e) {
  debug("Solr options not correctly configurated");
  process.exit(e.code);
}

const rp = require('request-promise');
const fs = require('fs');

const BASE_URL = global.stareOptions.solr.baseUrl;
const _CORE = global.stareOptions.solr.core;
const TITLE_PROPERTY = global.stareOptions.solr.titleProperty;
const SNIPPET_PROPERTY = global.stareOptions.solr.snippetProperty;
const IMAGE_PROPERTY = global.stareOptions.solr.imageProperty;

/**
 * Get the SERP from ElasticSearch and returns an object with the StArE.js standard format.
 *
 * @async
 * @param {string} query The search query.
 * @param {number} pageNumber Number of the SERP to get.
 * @returns {Promise} Promise object with the standarized StArE.js formatted SERP response from ElasticSearch.
 */
function getResultPages(query, pageNumber) {

  let queryParams = {
    start: (pageNumber - 1) * global.stareOptions.resultsPerPage,
    rows: global.stareOptions.resultsPerPage,
    wt: 'json',
    // sort: 'field ASC'
  };

  let queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');

  return new Promise((resolve, reject) => {
    let searchUrl = `${BASE_URL}/solr/${_CORE}/select?q=${query}&${queryString}`;

    debug(`Search url [${searchUrl}]`);
    rp({
      uri: searchUrl,
      json: true
    })
      .then(
        solrResult => {
          let formattedResponse = {
            totalResults: solrResult.response.numFound,
            searchTerms: solrResult.responseHeader.params.q,
            numberOfItems: solrResult.response.docs.length,
            startIndex: solrResult.response.start,
            documents: []
          };

          // Extract the documents relevant info for Stare.js
          formattedResponse.documents = solrResult.response.docs.map(item => ({
            title: item[TITLE_PROPERTY][0] || '',
            link: `${BASE_URL}/${item._index}/${item._type}/${item._id}`,
            snippet: item[SNIPPET_PROPERTY][0] || '',
            image: item[IMAGE_PROPERTY] || ''
          }));

          resolve(formattedResponse);
        },
        err => reject(err))
      .catch(err => reject(err));
  });
}

module.exports = exports = getResultPages;
