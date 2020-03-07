# StArE.js

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

StArE.js is an open source project intended to facilitate developers the creation of alternative visualizations of search engine results page (SERP). StArE.js provides a modular and extensible processing pipeline capable of (1) transforming SERP, (2) extracting features from individual search results, and (3) visualizing SERP in multiple ways.

  - Extensible
  - Modular
  - Potentially Scalable
  - Open Source
  - Reduce your Codelines

## Resources

* [npm package](https://www.npmjs.com/package/stare.js)
* [Examples](/examples/)

## Extensions

StArE.js is currently extended with the following plugins, all of them developed as part of the proof of concept.

| Plugin | Function |
| ------ | ------ |
| Perspicuity | Reading Ease for English and Perspicuity for Spanish|
| Language | Detect the most probable language for a document
| Length of Documents | Calculate the length in characters of a Document
| Support for Google SERPs | Handler for SERPs obtained through the Google Custom Search JSON API
| Support for Bing SERPs | Handler for SERPs obtained through the Bing web search API
| Support for Ecosia SERPs | Handler for SERPs obtained from ecosia through a web scrapper

You can create your own extensions (metrics and serp support) as is explained in the [docs](/docs).

## Installation

```bash
npm install stare-js
```
## How to use

```js
const stare = require('stare-js');

// stare(searchEngine = '', query = '', pageNumber = 1, metrics = []);
stare('google', 'What is hello world?', 1, ['ranking', 'language'])
  .then(result => {
    console.log(result);
  })
  .catch(err => {
    console.error(err);
  });
```

You can find the most basic full example in the [examples folder](/examples/).

## Documentation

Please see the full documentation [here](/docs/README.md).

## Debug / logging

StArE.js is powered by [debug](https://github.com/visionmedia/debug).
In order to see all the debug output, run your app with the environment variable
`DEBUG` including the desired scope.

To see the output from all of StArE.js's debugging scopes you can use:

```
DEBUG=stare-js
```

## Contributors

- Roberto González-Ibáñez
- [Camila Márquez](https://github.com/bellyster/)
- [Daniel Gacitúa](https://github.com/dgacitua/)
- [Franz Farbinger](https://github.com/DarkAnimat/)
- [Diego Salazar S.](https://github.com/d-salazar-se/)

## License
[MIT](LICENSE)

<!-- obviously replace with stare urls -->
[npm-image]: https://img.shields.io/npm/v/body-parser.svg
[npm-url]: https://npmjs.org/package/body-parser
[travis-image]: https://img.shields.io/travis/expressjs/body-parser/master.svg
[travis-url]: https://travis-ci.org/expressjs/body-parser
[coveralls-image]: https://img.shields.io/coveralls/expressjs/body-parser/master.svg
[coveralls-url]: https://coveralls.io/r/expressjs/body-parser?branch=master
[downloads-image]: https://img.shields.io/npm/dm/body-parser.svg
[downloads-url]: https://npmjs.org/package/body-parser

## Todo
- Documentation
- metrics that requires html/text (remove whitespaces produced by scraper)
  - length.js
  - perspicuity.js
