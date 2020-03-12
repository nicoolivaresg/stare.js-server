'use strict';

const path  = require('path');
const language = require('../lib/metrics/language');
const length = require('../lib/metrics/length');
const perspicuity = require('../lib/metrics/perspicuity');
const ranking = require('../lib/metrics/ranking');

/* Same SERP response for every test */
const stareDocument = {
  title: 'Testing document',
  link: path.resolve(__dirname, './test-document.txt'),
  snippet: 'This is a testing snippet',
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
      'value': 'english'
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