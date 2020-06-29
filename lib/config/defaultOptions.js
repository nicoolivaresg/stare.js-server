'use strict';

/**
 * @global
 */
global.stareOptions = {
  /* required SERP, each must fullfill a condition to be properly used */
  engines: [],
  /* Metrics modules/function created by the user */
  personalMetrics: {},
  /* Default number of results to get from the SERP */
  numberOfResults: 10,
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
  },
  /* Number of characters before breaking the line */
  lineMaxLength: 100
};