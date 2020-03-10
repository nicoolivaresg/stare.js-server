# SERP extensions

Even if you don't interact directly with each SERP extension, you still need to configure whatever they need to work

## Currently supported SERP extensions

<a name="google"></a>
### Google

For the Google SERP StArE.js uses the customsearch API provided by Google for Node.js, you can find all the official info on the [Google website for the API](https://developers.google.com/custom-search/v1/cse/list).

For that you will need to set the API Key and CX in the .env file of your project:

```env
GOOGLE_API_KEY=<you API key here>
GOOGLE_API_CX=<you CX here>
```

or in the options when you import StArE.js

```js
const stare = require('stare.js')({
  googleApiKey: '<you API key here>',
  googleApiCx: '<you CX here>'
});
```

<a name="bing"></a>
### Bing
In the same way as before, for Bing you musst provide an API key for [Azure Cognitive Services (Bing Web Seach)](https://docs.microsoft.com/en-us/javascript/api/@azure/cognitiveservices-websearch/?view=azure-node-latest).

And in the same way, you must provide the key via the .env file of your project:

```env
BING_SERVICE_KEY=<you API service key here>
```

or in the optiosn when you import StArE.js

```js
const stare = require('stare.js')({
  bingServiceKey: '<you API service key here>'
});
````
<a name="ecosia"></a>
### Ecosia

Ecosia on the other hand uses a webscrapper, so your only problem here could be that Ecosia blocks your IP for suspicious activity.

<a name="ElasticSearch"></a>
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
    snippetProperty: 'body',
    imageProperty: ''
  }
});
````

<a name="create-your-own-extensions"></a>
## Create your own extensions

To create your own extensions just use the boilerplate in this same folder, file called [serp.js](./serp.js) and complete it as you see it fit, but you must follow the export function signature.


---
Powered by [jsdoc](https://jsdoc.app/)

