# StArE.js Server version documentation.

## Stare web search

<a name="stare"></a>

Only public function exported from this package, follows this signature:

### stare(engine, query, pageNumber, metrics) ⇒ <code>Promise</code>
Makes a request to the specified search engine which returns (callback),
the SERP with the calculated metrics.

**Kind**: global function  
**Returns**: <code>Promise</code> - An object with the standardized result page (SERP)  

| Param | Type | Description |
| --- | --- | --- |
| engine | <code>string</code> | SERP to use [google\|bing\|ecosia\|elasticsearch] |
| query | <code>string</code> | Search query |
| pageNumber | <code>number</code> | Page number in the result pages, starts at 1 |
| metrics | <code>array</code> | Array with the name of the metrics to calculate |

The way to call the function is as follows:

```js
stare(engine, query, pageNumber, metrics);

/* Example */
stare('google', 'What is love?', 1, ['length', 'perspicuity']);
```

## Options

```js
let stareOptions = {
  /* Temporal files path, where the documents html/text 
  will be saved as an html/txt file. Must be relative path. */
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
```

| Property | Type | Description |
| --- | --- | --- |
| tempFilesPath | <code>string</code> | Path to the user temporal folder |
| personalMetrics | <code>array</code> | Array of metric functions |
| googleApiKey | <code>string</code> | Google API Key for Custom Search |
| googleApiCx | <code>string</code> | Google API CX for Custom Search |
| bingServiceKey | <code>string</code> | Bing Service Key for Web Search |
| elasticsearch | <code>object</code> | ElasticSearch properties |

## Metrics Extensions

| Metric | Description | Docs |
| --- | --- | --- |
| <code>language</code> | The language of the document | [See docs](/docs/METRICS.md#language) |
| <code>length</code> | Length of the document which considers only the number of characters in the text of the document. | [See docs](/docs/METRICS.md#length) |
| <code>perspicuity</code> | Perspicuity or Reading Ease (English) the document based on Flesh 1984 (en) and Szigriszt 1992 (es). | [See docs](/docs/METRICS.md#perspicuity) |
| <code>ranking</code> | Ranking of the document in the query results pages (SERP), considering all the documents. | [See docs](/docs/METRICS.md#ranking) |

For details on currently supported feature extractor/metrics extensions or how to create you own, [see the docs for metrics](/docs/METRICS.md).

## SERP Extensions

| SERP | Name | Requires API key | Docs |
| --- | --- | --- | --- |
| Google | <code>google</code> | Yes | [See docs](/docs/SERP.md#google) |
| Bing | <code>bing</code> | Yes | [See docs](/docs/SERP.md#bing) |
| Ecosia | <code>ecosia</code> | No | [See docs](/docs/SERP.md#ecosia) |
| ElasticSearch | <code>elasticsearch</code> | No | [See docs](/docs/SERP.md#elasticsearch) |

For details on currently supported SERP extensions or how to create you own, [see the docs for SERP](/docs/SERP.md).

---
Powered by [jsdoc](https://jsdoc.app/)
