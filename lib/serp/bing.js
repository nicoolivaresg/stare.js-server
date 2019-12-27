'use strict';

const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');

if (process.env.BING_SERVICE_KEY === null) {
  throw `You must define your Azure Cognitive Services for WebSearch key (BING_SERVICE_KEY) on your .env file to continue.`;
}

const credentials = new CognitiveServicesCredentials(process.env.BING_SERVICE_KEY);
const webSearchApiClient = new WebSearchAPIClient(credentials);

const RESULTS_PER_PAGE = 10;

function getResultPages(query, pageNumber) {
   /**
   * Documentation for the second parameter in:
   * https://docs.microsoft.com/en-us/javascript/api/@azure/cognitiveservices-websearch/websearchoptionalparams?view=azure-node-latest
   */
  let opts = {
    count: 10,
    offset: (RESULTS_PER_PAGE * (pageNumber - 1))
  };

  return webSearchApiClient.web.search(query, opts);
}

function processAndFormat(bingResult) {
  // return bingResult;
  var formattedResponse = {
    totalResults: Number(bingResult.webPages.totalEstimatedMatches).toLocaleString().replace(/,/g, '.'),
    searchTerms: bingResult.queryContext.originalQuery,
    numberOfItems: bingResult.webPages.value.length,
    startIndex: null,  // ?
    documents: []
  };

  // Append the documents with the standard format
  // for (const item of bingResult.webPages.value) {
  formattedResponse.documents = bingResult.webPages.value.map(item => ({
    title: item.name,
    link: item.url,
    snippet: item.snippet,
    image: item.image
  }));

  return formattedResponse;
};

module.exports = {
  getResultPages,
  processAndFormat
};