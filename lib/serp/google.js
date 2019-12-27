'use strict';

const { google } = require('googleapis');
const customsearch = google.customsearch('v1');

if (process.env.GOOGLE_API_KEY === null) {
  throw `You must define your Google API KEY (GOOGLE_API_KEY) on your .env file to continue.`;
}

if (process.env.GOOGLE_API_CX === null) {
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
    cx: process.env.GOOGLE_API_CX,
    q: query,
    auth: process.env.GOOGLE_API_KEY,
    start: (pageNumber - 1) * 10 + 1,
    num: 10 // results per page
  }

  return customsearch.cse.list(opts);
}

/**
 *
 * return {Object}
 */
function processAndFormat(googleResult) {
  googleResult = googleResult.data;

  var formattedResponse = {
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

  return formattedResponse;
}

module.exports = {
  getResultPages,
  processAndFormat
};