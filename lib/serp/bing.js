'use strict';

const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');

if (global.stareOptions.bingServiceKey === null) {
  throw `You must define your Azure Cognitive Services for WebSearch key (bingServiceKey) on your .env file to continue.`;
}

const credentials = new CognitiveServicesCredentials(global.stareOptions.bingServiceKey);
const webSearchApiClient = new WebSearchAPIClient(credentials);

const RESULTS_PER_PAGE = 10;

function getResultPages(query, pageNumber) {
   /**
   * Documentation for the second parameter in:
   * https://docs.microsoft.com/en-us/javascript/api/@azure/cognitiveservices-websearch/websearchoptionalparams?view=azure-node-latest
   */
  let opts = {
    count: 10,
    offset: (global.stareOptions.resultsPerPage * (pageNumber - 1))
  };

  return new Promise((resolve, reject) => {
    webSearchApiClient.web.search(query, opts)
      .then(bingResult => {
        let formattedResponse = {
          totalResults: Number(bingResult.webPages.totalEstimatedMatches).toLocaleString().replace(/,/g, '.'),
          searchTerms: bingResult.queryContext.originalQuery,
          numberOfItems: bingResult.webPages.value.length,
          startIndex: null,  // ?
          documents: []
        };

        // Append the documents with the standard format
        formattedResponse.documents = bingResult.webPages.value.map(item => ({
          title: item.name,
          link: item.url,
          snippet: item.snippet,
          image: item.image
        }));

        resolve(formattedResponse);
      })
      .catch(err => {
        reject(err);
      });
    });
}

module.exports = exports = getResultPages;
