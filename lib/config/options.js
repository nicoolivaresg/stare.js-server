'use strict';

/**
 * @global
 */
global.stareOptions = {
  /* Temporal files path, where the documents html/text will be saved as an html/txt file. Must be relative path. */
  tempFilesPath: './temp/',
  /* Metrics modules/function created by the user */
  personalMetrics: {},
  resultsPerPage: 10,
  /* Google API */
  googleApiKey: process.env.GOOGLE_API_KEY || '',
  googleApiCx: process.env.GOOGLE_API_CX || '',
  /* Bing API */
  bingServiceKey: process.env.BING_SERVICE_KEY || '',
  /* ElasticSearch config */
  elasticsearch: {
    baseUrl: 'http://localhost:9200',
    _index: '_all',
    _source: '_source',
    titleProperty: 'title',
    snippetProperty: 'snippet',
    imageProperty: 'image'
  }
};