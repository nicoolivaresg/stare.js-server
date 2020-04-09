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
  snippet: 'StArE.js: An extensible open source toolkit for visualizing search engine results. ... Supervised by González-Ibáñez, R. Departamento de Ingeniería Informática, ...',
  image: null
};

const stareInvalidDocument = {
  title: 'No good title',
  link: 'no-good-url-either',
  snippet: '', // Italian: "Not supported language"
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

describe('Features Happy cases', () => {
  test(`Feature 'language' with valid stareDocument object`, () => {
    return language(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'language',
        'index': 1,
        'value': expect.any(String)
      });
    });
  });

  test(`Feature 'length' with valid stareDocument object`, () => {
    return length(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'length',
        'index': 1,
        'value': expect.any(Number)
      });
      expect(data.value).toBeGreaterThan(-1);
    });
  });

  test(`Feature 'perspicuity' with valid stareDocument object`, () => {
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

describe('Features Sad cases', () => {
  test(`Feature 'language' with invalid stareDocument (snippet == '').`, async () => {
    await expect(language(stareInvalidDocument, opts)).rejects.toThrow();
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

  test(`Feature 'perspicuity' with invalid stareDocument object`, () => {
    return perspicuity(stareInvalidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'perspicuity',
        'index': 1,
        'value': expect.any(Object)
      });
    });
  });

  test('getMetrics() without stareDocument and empty metrics array', () => {
    return getMetrics({}, []).then(data => {
      expect(data).toEqual([]);
    })
  });

  test('getMetrics() without stareDocument.', () => {
    return getMetrics({}, ['language', 'length', 'perspicuity', 'ranking']).then(data => {
      expect(data.length).toEqual(0);
    })
  });

  // test('getMetrics({stuff}, [stuff]) with both valid args', () => {
  //   return getMetrics({}, ['language', 'length', 'perspicuity', 'ranking']).then(data => {
  //     expect(data.length).toEqual(4);
  //   })
  // });
});