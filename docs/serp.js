'use strict';

/* Your imports here */
const rp = require('request-promise');

/**
 * Get the SERP from <yourSerp> and returns an object with the StArE.js standard format.
 *
 * @async
 * @param {string} query The search query.
 * @param {number} numberOfResults Number of documents to get from the SERP.
 * @returns {Promise} Promise object with the standarized StArE.js formatted SERP response from <yourSerp>.
 */
function getResultPages(query, numberOfResults) {
  
  /* Some stuff and logic here */

  return new Promise((resolve, reject) => {
    /* Get the normal SERP response with some sort of request */
    rp({
      uri: searchUrl,
      json: true
    })
      .then(
        solrResult => {
          let formattedResponse = {
            totalResults: yourSerpResult.formattedTotalResults,
            searchTerms: yourSerpResult.searchTerms,
            numberOfItems: yourSerpResult.items.length,
            startIndex: yourSerpResult.startIndex,
            documents: []
          };

          /* Extract the documents relevant info for StArE.js */
          formattedResponse.documents = yourSerpResult.items.map(item => ({
            title: String,
            link: String || Object,
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
