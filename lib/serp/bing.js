'use strict';

const debug = require('debug')('stare.js:server/serp/bing');
try {
  require.resolve('ms-rest-azure');
  require.resolve('azure-cognitiveservices-websearch');
} catch(e) {
  debug("Package 'ms-rest-azure' or 'azure-cognitiveservices-websearch' is not installed");
  process.exit(e.code);
}

const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');

if (global.stareOptions.bingServiceKey === null) {
  throw `You must define your Azure Cognitive Services for WebSearch key (BING_SERVICE_KEY) on your .env file to continue or the property 'bingServiceKey' in the StArE.js options.`;
}
 
let credentials = new CognitiveServicesCredentials(global.stareOptions.bingServiceKey);
let webSearchApiClient = new WebSearchAPIClient(credentials);

/**
 * Get the SERP from Bing and returns an object with the StArE.js standard format.
 *
 * @async
 * @param {string} query The search query.
 * @param {number} pageNumber Number of the SERP to get.
 * @returns {Promise} Promise object with the standarized StArE.js formatted SERP response from Bing.
 */
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
          startIndex: opts.offset,
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
