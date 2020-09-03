'use strict';

/**
 *
 * @async
 * @param {string} query The search query.
 * @param {number} numberOfResults Number of documents to get from the SERP.
 * @returns {Promise} Promise object with the standarized StArE.js formatted SERP response from <yourSerp>.
 */
function getResultPages(query, numberOfResults) {
  return Promise.resolve({
    totalResults: 1,
    searchTerms: 'Show me an example',
    numberOfItems: 1,
    startIndex: 0,
    documents: [
      {
        title: 'This is an example',
        link: null,
        body: 'This is the body',
        snippet: 'This is the snippet',
        image: null
      }
    ]
  });
}

module.exports = exports = getResultPages;
