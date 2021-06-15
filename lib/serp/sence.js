'use strict';

const debug = require('debug')('stare.js:server/serp/sence');
const _ = require('lodash');
const rp = require('request-promise');
const qs = require('qs');

const BASE_URL = 'https://sistemas.sence.cl/sipfor/Planes/Catalogo.aspx';

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
    let searchUrl = `${BASE_URL}`;

    debug(`SENCE Search url [${searchUrl}]`);
    
    rp({
      uri: searchUrl
    })
      .then(        
        html  => {
          let formattedResponse = {
            totalResults: 0,
            searchTerms: query,
            numberOfItems: 0,
            startIndex: queryParams.from + 1,
            documents: []
          };

          // Extract the documents relevant info for Stare.js
          // formattedResponse.documents = senceResult.hits.hits.map(item => ({
          //   title: _.get(item[_SOURCE], TITLE_PROPERTY),
          //   link: _.get(item[_SOURCE], LINK_PROPERTY, null),
          //   body: _.get(item, _SOURCE),
          //   snippet: _.get(item[_SOURCE], SNIPPET_PROPERTY),
          //   image: _.get(item[_SOURCE], IMAGE_PROPERTY)
          // }));

          resolve(formattedResponse);
        },
        err => reject(err))
      .catch(err => reject(err));
  });
}

module.exports = exports = getResultPages;
