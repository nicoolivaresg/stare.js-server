'use strict';

const { google } = require('googleapis');
const customsearch = google.customsearch('v1');

if (global.stareOptions.googleApiKey === null) {
  throw `You must define your Google API KEY (GOOGLE_API_KEY) on your .env file to continue.`;
}

if (global.stareOptions.googleApiCx === null) {
  throw `You must define your Google API CX (GOOGLE_API_CX) on your .env file to continue.`;
}

/**
 *
 * return {Promise}
 */
function getResultPages(query, pageNumber) {
  /**
   * Documentation for the function customsearch.cse.list() in:
   * https://developers.google.com/custom-search/v1/cse/list
   */
  const opts = {
    cx: global.stareOptions.googleApiCx,
    q: query,
    auth: global.stareOptions.googleApiKey,
    start: (pageNumber - 1) * global.stareOptions.resultsPerPage + 1,
    num: global.stareOptions.resultsPerPage
  }

  return new Promise((resolve, reject) => {
    customsearch.cse.list(opts)
      .then(googleResult => {
        googleResult = googleResult.data;

        let formattedResponse = {
          totalResults: googleResult.searchInformation.formattedTotalResults,
          searchTerms: googleResult.queries.request[0].searchTerms,
          numberOfItems: googleResult.queries.request[0].count,
          startIndex: googleResult.queries.request[0].startIndex,
          documents: []
        };

        // Extract the documents relevant info for Stare.js
        formattedResponse.documents = googleResult.items.map(item => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          image: (((item.pagemap || {}).cse_image || {})[0] || {}).src
        }));

        resolve(formattedResponse);
      })
      .catch(err => {
        reject(err);
      });
    });
}

module.exports = exports = getResultPages;
