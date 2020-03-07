global.stareOptions = {
  /* SERP API keys */
  // Google API
  googleApiKey: process.env.GOOGLE_API_KEY || 'Your Google API Key',
  googleApiCx: process.env.GOOGLE_API_CX || 'Your Google Cx Key',
  // Bing API
  bingServiceKey: process.env.BING_SERVICE_KEY || 'Your Bing Service Key',
  /* Temporal files path, where the documents html/text will be saved as an html/txt file. Must be relative path. */
  tempFilesPath: './temp/',
  /* Metrics modules/function created by the user */
  personalMetrics: {},
  resultsPerPage: 10,
  elasticsearch: {
    baseUrl: 'http://localhost:9200',
    _index: '_all',
    _source: '_source',
    titleProperty: 'firstname',
    snippetProperty: 'email',
    imageProperty: 'state'
  }
};