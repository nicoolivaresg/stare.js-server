# Stare.js

StArE.js is an open source project intended to facilitate developers the creation of alternative visualizations of search engine results page (SERP). Stare.js provides a modular and extensible processing pipeline capable of (1) transforming SERP, (2) extracting features from individual search results, and (3) visualizing SERP in multiple ways.

  - Extensible
  - Modular
  - Potentially Scalable
  - Open Source
  - Reduce your Codelines

## Resources

* [npm package](https://www.npmjs.com/package/stare.js)
* [Examples](/examples/)

## Extensions

Stare.js is currently extended with the following plugins, all of them developed as part of the proof of concept.

| Plugin | Function |
| ------ | ------ |
| Perpiscuity | Reading Ease for English and Perpiscuity for Spanish|
| Language | Detect the most probable language for a document
| Length of Documents | Calculate the length in characters of a Document
| Support for Google SERPs | Handler for SERPs obtained through the Google Custom Search JSON API
| Support for Bing SERPs | Handler for SERPs obtained through the Bing web search API
| Support for Ecosia SERPs | Handler for SERPs obtained from ecosia through a web scrapper

## Installation

```bash
npm install stare-js
```
## How to use

```js
const stare = require('stare-js');


// stare(searchEngine = '', query = '', pageNumber = 1, metrics = [], callback = function);
stare('google', 'What is hello world?', 1, ['ranking', 'language'], (result, err) => {
    if (err) {
      throw err;
    }
    console.log(result);
  });
````

You can find the most basic full example in the [examples folder](/examples/).

## Documentation

Please see the documentation [here](/docs/README.md).

## Contributors

- Roberto González-Ibáñez
- Camila Márquez
- Daniel Gacitúa
- Franz Farbinger
- Diego Salazar S.

## License
[Attribution 3.0 Chile (CC BY 3.0 CL)](https://creativecommons.org/licenses/by/3.0/cl/)
