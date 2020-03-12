# StArE.js (Node.js Server version)

![npm](https://img.shields.io/npm/v/stare.js)
![npm](https://img.shields.io/npm/dm/stare.js)
[![Build Status](https://travis-ci.com/d-salazar-se/stare-server.svg?branch=master)](https://travis-ci.com/d-salazar-se/stare-server)
[![Coverage Status](https://coveralls.io/repos/github/d-salazar-se/stare.js-server/badge.svg?branch=master)](https://coveralls.io/github/d-salazar-se/stare.js-server?branch=master)
![NPM](https://img.shields.io/npm/l/stare.js)


## Description
StArE.js is an open source project intended to facilitate developers the creation of alternative visualizations of search engine results page (SERP). StArE.js provides a modular and extensible processing pipeline capable of (1) transforming SERP, (2) extracting features from individual search results, and (3) visualizing SERP in multiple ways.

## Installation

```bash
npm install stare.js
```
## How to use

```js
const stare = require('stare.js')(...options);

// stare(searchEngine = '', query = '', pageNumber = 1, metrics = []);
stare('google', 'What is love?', 1, ['ranking', 'language'])
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });
```

You can find the most basic full example in the [examples folder](/examples/).

## Resources

* [npm package](https://www.npmjs.com/package/stare.js)
* [Documentation](/docs/)
* [Examples](/examples/)

## Extensions

StArE.js is currently extended with the following plugins:

| SERP | Function name | Description | Documentation |
| ------ | ------ | ------ | ------ |
| Google | <code>google</code> | Handler for SERPs obtained through the Google Custom Search JSON API | [See docs](/docs/SERP.md#google) |
| Bing | <code>bing</code> | Handler for SERPs obtained through the Bing web search API | [See docs](/docs/SERP.md#bing) |
| Ecosia | <code>ecosia</code> | Handler for SERPs obtained from ecosia through a web scrapper | [See docs](/docs/SERP.md#ecosia) |
| ElasticSearch | <code>elasticsearch</code> | Handler for SERPs obtained from ElasticSearch (only basic support) via request-promise | [See docs](/docs/SERP.md#elasticsearch) |


| Metrics | Metric name | Description | Documentation |
| ------ | ------ | ------ | ------ |
| Perspicuity | <code>perspicuity</code> | Reading Ease for English and Perspicuity for Spanish | [See docs](/docs/METRICS.md#perspicuity) |
| Language | <code>language</code> | Detect the most probable language for a document | [See docs](/docs/METRICS.md#language) |
| Length of Documents | <code>length</code> | Calculate the length in characters of a Document | [See docs](/docs/METRICS.md#length) |
| Ranking | <code>ranking</code> | Calculate the length in characters of a Document | [See docs](/docs/METRICS.md#ranking) |

As is explained in the docs you can create your own extensions for [SERP](/docs/SERP.md#create-your-own-extensions) and [metrics](/docs/METRICS.md#create-your-own-extensions) support.

Please see the full documentation [here](/docs/INDEX.md).

## Debug / Logging

StArE.js is powered by [debug](https://github.com/visionmedia/debug).
In order to see all the debug output, run your app with the environment variable
`DEBUG` including the desired scope.

To see the output from all of StArE.js's debugging scopes you can use:

```
DEBUG=stare.js
```

## Contributors

- [Roberto González-Ibáñez](https://github.com/rgonzal/)
- [Camila Márquez](https://github.com/bellyster/)
- [Daniel Gacitúa](https://github.com/dgacitua/)
- [Franz Farbinger](https://github.com/DarkAnimat/)
- [Diego Salazar S.](https://github.com/d-salazar-se/)

## License
[MIT](LICENSE)

## Todo
- Documentation
- More examples
- Travis-CI integration
- Test script
- metrics/perspicuity Support for languages other than ['en-us', 'es', 'fr']
- personal SERP support (like metrics)
