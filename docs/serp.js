'use strict';

/* Your imports here */

/**
 * Get the SERP from <yourSerp> and returns an object with the StArE.js standard format.
 *
 * @async
 * @param {string} query The search query.
 * @param {number} pageNumber Number of the SERP to get.
 * @returns {Promise} Promise object with the standarized StArE.js formatted SERP response from <yourSerp>.
 */
function getResultPages(query, pageNumber) {
  
  /* Some stuff here */
  return new Promise((resolve, reject) => {

    /* Get the normal SERP response, for example with and */
    let formattedResponse = {
      totalResults: yourSerpResult.formattedTotalResults,
      searchTerms: yourSerpResult.searchTerms,
      numberOfItems: yourSerpResult.items.length,
      startIndex: yourSerpResult.startIndex,
      documents: []
    };

    /* Extract the documents relevant info for StArE.js */
    formattedResponse.documents = yourSerpResult.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      image: item.image.src
    }));

    /* Resolve the Promise if everything is correct */
    resolve(formattedResponse);
}

module.exports = exports = getResultPages;
