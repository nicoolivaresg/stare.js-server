# SERP extensions

Even if you don't interact directly with each SERP extension, you still need to configure whatever they need to work

## Currently supported SERP extensions

<a name="google"></a>
### Google

For the Google SERP StArE.js uses the customsearch API provided by Google for Node.js, you can find all the official info on the [Google website for the API](https://developers.google.com/custom-search/v1/cse/list).

For that you will need to set up the API Key and CX in the options when you import StArE.js

```js
const stare = require('stare.js')({
  google: {
    apiKey: '<you API key here>',
    apiCx: '<you CX here>'
  }
});
```

<a name="bing"></a>
### Bing
In the same way as before, for Bing you musst provide an API key for [Azure Cognitive Services (Bing Web Seach)](https://docs.microsoft.com/en-us/javascript/api/@azure/cognitiveservices-websearch/?view=azure-node-latest).

And in the same way, you must provide the key on the options when you import StArE.js

```js
const stare = require('stare.js')({
  bing: {
    serviceKey: '<you API service key here>'
  }
});
```
<a name="ecosia"></a>
### Ecosia

Ecosia on the other hand uses a webscrapper, so your only problem here could be that Ecosia blocks your IP for suspicious activity.

<a name="elasticsearch"></a>
### ElasticSearch

For ElasticSearch, at the current state, StArE.js only supports 1 host, which means that clusters in different host/ports won't be allowed to work simultaneosly.

In this case, you must provide all the info of your ElasticSearch host/index on the options when importing StArE.js:

```js
const stare = require('stare.js')({
  elasticsearch: {
    baseUrl: '<your host here>',
    _index: '<your search index here>',
    _source: '<your source document property here>',
    titleProperty: '<your title property here>',
    bodyProperty: '<your body property here>',
    snippetProperty: '<your snippet property here>',
    imageProperty: '<your image property here>'
  }
});

/* example */
const stare = require('stare.js')({
  elasticsearch: {
    baseUrl: 'http://localhost:9200',
    _index: '_myIndex',
    _source: '_source',
    titleProperty: 'filename',
    bodyProperty: 'body',
    snippetProperty: 'snippet',
    imageProperty: 'myImage'
  }
});
```

<a name="solr"></a>
### Solr

For Solr is the same case as ElasticSearch, you must provide all the info of your Solr host/index on the options when importing StArE.js:

```js
const stare = require('stare.js')({
  solr: {
    baseUrl: '<your host here>',
    core: '<your core here>,
    titleProperty: '<your title property here>',
    bodyProperty: '<your body property here>',
    snippetProperty: '<your snippet property here>',
    imageProperty: '<your image property here>'
  }
});

/* example */
const stare = require('stare.js')({
  solr: {
    baseUrl: 'http://localhost:8983',
    core: '',
    titleProperty: 'title',
    bodyProperty: 'body',
    snippetProperty: 'snippet',
    imageProperty: 'image'
  }
});
```

<a name="searchcloud"></a>
### AWS Search Cloud

For AWS Search Cloud is the same case as ElasticSearch/Solr, you must provide all the info on the options when importing StArE.js:

```js
const stare = require('stare.js')({
  searchcloud: {
    searchEndpoint: '<your search endpoint here>',
    apiVersion: '<your api version here>',
    titleProperty: '<your title property here>',
    bodyProperty: '<your body property here>',
    snippetProperty: '<your snippet property here>',
    imageProperty: '<your image property here>'
  }
});

/* example */
const stare = require('stare.js')({
  searchcloud: {
    searchEndpoint: 'http://search-movies-y6gelr4lv3jeu4rvoelunxsl2e.us-east-1.cloudsearch.amazonaws.com/',
    apiVersion: '2013-01-01',
    titleProperty: 'fields.title',
    bodyProperty: 'fields.plot',
    snippetProperty: 'fields.plot',
    imageProperty: 'fields.image_url'
  }
});
```
<a name="Baremo"></a>
### Baremo

For Baremo is the same case as ElasticSearch/Solr, you must provide all the info of your host/index and properties names 
```js
const stare = require('stare.js')({
  elasticsearch: {
    baseUrl: '<your host here>',
    _index: '<your search index here> (default: jurisprudencia)',
    _source: '<your source document property here>',
    titleProperty: '<your title property here>',
    bodyProperty: '<your body property here> (default: _source)',
    snippetProperty: '<your snippet property here>',
    imageProperty: '<your image property here>'
  }
});

/* example */
const stare = require('stare.js')({
  elasticsearch: {
    baseUrl: 'http://localhost:9200',
    _index: 'jurisprudencia',
    _source: '_source',
    titleProperty: 'filename',
    bodyProperty: '_source',
    snippetProperty: 'snippet',
    imageProperty: 'myImage'
  }
});
```



<a name="create-your-own-extensions"></a>
## Create your own extensions

To create your own extensions just use the boilerplate in this same folder, file called [serp.js](./serp.js) and complete it as you see it fit, but you must follow the export function signature.


---
Powered by [jsdoc](https://jsdoc.app/)

