'use strict';

const getMetrics = require('../lib/metrics/');
const language = require('../lib/metrics/language');
const length = require('../lib/metrics/length');
const perspicuity = require('../lib/metrics/perspicuity');
const ranking = require('../lib/metrics/ranking');

/* Same SERP response for every test */
const stareValidDocument = {
  title: 'StArE.js — Search engine visuAlization packagE - Usach',
  link: 'https://starejs.informatica.usach.cl/',
  body: '',
  snippet: 'StArE.js: An extensible open source toolkit for visualizing search engine results. ... Supervised by González-Ibáñez, R. Departamento de Ingeniería Informática, ...',
  image: null
};

const stareInvalidDocument = {
  title: 'No good title',
  link: 'no-good-url-either',
  body: null,
  snippet: null,
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

describe(`Feature 'language'`, () => {
  test(`Valid stareDocument object`, () => {
    return language(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'language',
        'index': 1,
        'value': expect.any(String)
      });
    });
  });

  test(`Invalid stareDocument (snippet == '').`, () => {
    return language(stareInvalidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'language',
        'index': 1,
        'value': null
      });
    });
  });
});

describe(`Feature 'length'`, () => {
  test(`Valid stareDocument object`, () => {
    return length(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'length',
        'index': 1,
        'value': expect.any(Number)
      });
      expect(data.value).toBeGreaterThan(-1);
    });
  });

  test(`Feature 'length' with invalid stareDocument object`, () => {
    return length(stareInvalidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'length',
        'index': 1,
        'value': -1
      });
    });
  });
});

describe(`Feature 'perspicuity'`, () => {
  test(`Valid stareDocument object`, () => {
    return perspicuity(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'perspicuity',
        'index': 1,
        'value': expect.any(Number)
      });
    });

    expect(data.value).toBeGreaterThanOrEqual(0);
    expect(data.value).toBeLessThanOrEqual(207);
  });

  test(`Invalid stareDocument object`, () => {
    return perspicuity(stareInvalidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'perspicuity',
        'index': 1,
        'value': expect.any(Object)
      });
    });
  });
});

describe(`Feature 'ranking'`, () => {
  test(`Feature 'ranking' with valid stareDocument object`, () => {
    return ranking(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'ranking',
        'index': 1,
        'value': 2
      });
    });
  });
});

describe(`Function 'getMetrics'`, () => {
  test('Without stareDocument and empty metrics array', () => {
    return getMetrics({}, []).then(data => {
      expect(data).toEqual([]);
    })
  });

  test('Without stareDocument.', () => {
    return getMetrics({}, ['language', 'length', 'perspicuity', 'ranking']).then(data => {
      expect(data.length).toEqual(0);
    })
  });
});