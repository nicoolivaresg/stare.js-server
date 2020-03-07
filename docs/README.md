## StArE.js Server documentation.

## Stare web search

```js
 /**
 * Makes a request to the specified search engine which returns (callback),
 * the SERP with the calculated metrics.

 * @param {string} engine
 * @param {string} query
 * @param {number} pageNumber
 * @param {array} metrics
 */
function webSearch(engine, query, pageNumber, metrics);
````

## Current available options

```js
var configurableOptions = {
  /* Path where the temporal html/txt files will be saved to use to calculate metrics */
  tempFilesPath: './temp/',
  /* Create your own metrics and include them in the array so they can be use */
  personalMetrics: []
};
````

## Current available metrics

### Language
Returns the language of the document. [Uses the Node Language Detect package](https://www.npmjs.com/package/languagedetect).

### Length
Length of the document which considers only the number of characters in the text of the document.

### Perspicuity
Perspicuity or Reading Ease (English) the document based on Flesh 1984 (en) and Szigriszt 1992 (es).

### Ranking
Ranking of the document in the query results pages (SERP), considering all the documents.

## Create your own extensions

### SERP

Your own SERP must have at least the next two functions, this are called by the main stare function, so must be called the same as in the follow boilerplate.

```js
'use strict';

/* Your requires and extra functions here */

/**
 * Get the SERP baeed on a webscrapper or and API.
 * return {promise}
 */
function getResultPages(query, pageNumber) {
  /* Do stuff and returns a Promise */
  return new Promise();
}

/**
 * @param {Object} resultPages - The result pages obtained in the function above.
 * return {Object}
 */
function processAndFormat(resultPages) {
  /* Must return the following format */
  return {
    totalResults: string,
    searchTerms: string,
    numberOfItems: number,
    startIndex: number,
    documents: array [
      {
        title: string,
        link: string,
        snippet: string,
        image: string
      }
    ]
  };
}

module.exports = {
  getResultPages,
  processAndFormat
};
````

### Metrics


- Each metric must be on his own separate file.
- Must return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and we recommend follow this boilerplate. 

```js
'use strict';

/* Your requires and extra functions here */

/**
 * Metrics documentation.
 * @param {object} stareDocument
 * @param {object} opts
 * @returns {promise}
 */
function calculate(stareDocument, opts) {
  return new Promise((resolve, reject) => {
    
    /* Do some stuff */
    
    resolve({
      name: /* metric name, mustn't hace spaces */,
      index: opts.index,
      value: /* final value goes here */
    });
  })
};

module.exports = exports = calculate;
````