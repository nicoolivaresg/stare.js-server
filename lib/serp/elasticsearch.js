'use strict';

const debug = require('debug')('stare.js:server/serp/elasticsearch');
const rp = require('request-promise');
const fs = require('fs');

const BASE_URL = global.stareOptions.elasticsearch.baseUrl;
const _INDEX = global.stareOptions.elasticsearch._index || '_all';
const _SOURCE = global.stareOptions.elasticsearch._source || '_source';
const TITLE_PROPERTY = global.stareOptions.elasticsearch.titleProperty || 'title';
const SNIPPET_PROPERTY = global.stareOptions.elasticsearch.snippetProperty || 'snippet';
const IMAGE_PROPERTY = global.stareOptions.elasticsearch.imageProperty || 'image';

/**
 *
 * return {Promise}
 */
function getResultPages(query, pageNumber) {

  let queryParams = {
    from: (pageNumber - 1) * global.stareOptions.resultsPerPage,
    rest_total_hits_as_int: true,
    size: global.stareOptions.resultsPerPage,
    track_scores: true,
    track_total_hits: true
  };

  let queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');

  return new Promise((resolve, reject) => {
    let searchUrl = `${BASE_URL}/${_INDEX}/_search?q=${query}&${queryString}`;
    debug(`Search url [${searchUrl}]`);
    rp({
      uri: searchUrl,
      json: true
    })
      .then(
        elasticResult => {
          console.log({_SOURCE, TITLE_PROPERTY, SNIPPET_PROPERTY, IMAGE_PROPERTY});
          
          let formattedResponse = {
            totalResults: elasticResult.hits.total,
            searchTerms: '',
            numberOfItems: elasticResult.hits.hits.length,
            startIndex: queryParams.from + 1,
            documents: []
          };

          // Extract the documents relevant info for Stare.js
          formattedResponse.documents = elasticResult.hits.hits.map(item => ({
            title: item[_SOURCE][TITLE_PROPERTY] || '',
            link: `${BASE_URL}/${item._index}/${item._type}/${item._id}`,
            snippet: item[_SOURCE][SNIPPET_PROPERTY] || '',
            image: item[_SOURCE][IMAGE_PROPERTY] || ''
          }));

          resolve(formattedResponse);
        },
        err => {
          reject(err);
        })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = exports = getResultPages;
