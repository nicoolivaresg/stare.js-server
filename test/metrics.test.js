'use strict';

const path  = require('path');
const language = require('../lib/metrics/language');
const length = require('../lib/metrics/length');
const perspicuity = require('../lib/metrics/perspicuity');
const ranking = require('../lib/metrics/ranking');

/* Same SERP response for every test */
const stareDocument = {
  title: 'StArE.js — Search engine visuAlization packagE - Usach',
  link: 'https://starejs.informatica.usach.cl/',
  snippet: 'StArE.js: An extensible open source toolkit for visualizing search engine results. ... Supervised by González-Ibáñez, R. Departamento de Ingeniería Informática, ...',
  image: null
};

const opts = {
  searchInfo: {
    totalResults: '1',
    searchTerms: 'Testing query',
    numberOfItems: 1,
    startIndex: 1
  },
  index: 1
};

/* Features / Metrics */
test(`Feature 'language' from default object`, () => {
  return language(stareDocument, opts).then(data => {
    expect(data).toMatchObject({
      'name': 'language',
      'index': 1,
      'value': expect.any(String)
    });
  });
});

// test(`Feature 'length' from default object`, () => {
//   return length(stareDocument, opts).then(data => {
//     expect(data).toMatchObject({
//       'name': 'length',
//       'index': 1,
//       'value': expect.any(Number)
//     });
//     expect(data.value).toBeGreaterThan(-1);
//   });
// });

// test(`Feature 'perspicuity' from default object`, () => {
//   return perspicuity(stareDocument, opts).then(data => {
//     expect(data).toMatchObject({
//       'name': 'perspicuity',
//       'index': 1,
//       'value': expect.any(Number)
//     });
//   });

//   expect(data.value).toBeGreaterThanOrEqual(0);
//   expect(data.value).toBeLessThanOrEqual(207);
// });

test(`Feature 'ranking' from default object`, () => {
  return ranking(stareDocument, opts).then(data => {
    expect(data).toMatchObject({
      'name': 'ranking',
      'index': 1,
      'value': 2
    });
  });
});