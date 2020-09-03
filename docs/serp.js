'use strict';

/* Your imports here */
const rp = require('request-promise');
const _ = require('lodash');

/**
 * Get the SERP from <yourSerp> and returns an object with the StArE.js standard format.
 *
 * @async
 * @param {string} query The search query.
 * @param {number} numberOfResults Number of documents to get from the SERP.
 * @returns {Promise} Promise object with the standarized StArE.js formatted SERP response from <yourSerp>.
 */
function getResultPages(query, numberOfResults) {

  /* Some basic validations */
  if (!query || query.length === 0) {
    return Promise.reject(new Error('Query cannot be null.'));
  }

  numberOfResults = numberOfResults < 0 ? 1 : numberOfResults;
  
  /* Some stuff and logic here */

  let searchUrl = 'Your own search URL here, must have all the query params';

  return new Promise((resolve, reject) => {
    /* Get the normal SERP response with some sort of request */
    rp({
      uri: searchUrl,
      json: true
    })
      .then(
        yourSerpResult => {
          let formattedResponse = {
            totalResults: yourSerpResult.formattedTotalResults,
            searchTerms: yourSerpResult.searchTerms,
            numberOfItems: yourSerpResult.items.length,
            startIndex: yourSerpResult.startIndex,
            documents: []
          };

          /* Extract the documents relevant info for StArE.js */
          formattedResponse.documents = yourSerpResult.items.map(item => ({
            title: String,          // _.get(item, 'title')
            link: String || null,   // _.get(item, 'link', null)
            body: String,           // if link is not defined, then body is required
            snippet: String,
            image: String
          }));

          /* Resolve the Promise if everything is correct */
          resolve(formattedResponse);
        },
        err => reject(err))
      .catch(err => reject(err));
  });
}

module.exports = exports = getResultPages;
