'use strict';

/**
 * @global
 */
global.stareOptions = {
  /* required SERP, each must fullfill a condition to be properly used */
  engines: [],
  /* Temporal files path, where the documents html/text will be saved as an html/txt file. Must be relative path. */
  tempFilesPath: './temp/',
  /* Metrics modules/function created by the user */
  personalMetrics: {},
  /* Default number of results per page for SERP */
  resultsPerPage: 10,
  /* Google API */
  googleApiKey: '',
  googleApiCx: '',
  /* Bing API */
  bingServiceKey: '',
  /* ElasticSearch config */
  elasticsearch: {
    baseUrl: 'http://localhost:9200',
    _index: '_all',
    _source: '_source',
    titleProperty: 'title',
    snippetProperty: 'snippet',
    imageProperty: 'image'
  },
  /* Solr config */
  solr: {
    baseUrl: 'http://localhost:8983',
    core: '',
    titleProperty: 'title',
    snippetProperty: 'snippet',
    imageProperty: 'image'
  }
};