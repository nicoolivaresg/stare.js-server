'use strict';

const bing = require('../lib/serp/bing');
const ecosia = require('../lib/serp/ecosia');
const elasticsearch = require('../lib/serp/elasticsearch');
const google = require('../lib/serp/google');
const solr = require('../lib/serp/solr');
const searchcloud = require('../lib/serp/searchcloud');

function toBeStareDocument(data) {
  expect(data).toHaveProperty('totalResults', expect.any(String));
  expect(data).toHaveProperty('searchTerms', expect.any(String));
  expect(data).toHaveProperty('numberOfItems', expect.any(Number));
  expect(data).toHaveProperty('startIndex', expect.any(Number));
  expect(data).toHaveProperty('documents', expect.any(Array));

  if (data.documents.length > 0) {
    expect(data).toHaveProperty(['documents', 0, 'title']);
    expect(data).toHaveProperty(['documents', 0, 'link']);
    expect(data).toHaveProperty(['documents', 0, 'snippet']);
    expect(data).toHaveProperty(['documents', 0, 'image']);
  }
}

describe('SERP bing', () => {
  test(`Succesfully get 'bing' results for query=jest and pageNumber=1`, () => {
    return bing('jest', 1).then(data => toBeStareDocument);
  });

  test(`Failed to get 'bing' results for query=jest and pageNumber=1`, () => {
    return expect(bing(null, 1)).rejects.toThrow();
  });

  test(`No bing.serviceKey setted`, () => {
    global.stareOptions.bing.serviceKey = null;
    return expect(bing('jest', 1)).rejects.toThrow();
  });
});

describe('SERP ecosia', () => {
  test(`Succesfully get 'ecosia' results for query=jest and pageNumber=1`, () => {
    return ecosia('jest', 1).then(data => toBeStareDocument);
  });
});

describe('SERP elasticsearch', () => {
  test(`Failed to get 'elasticsearch' results for query=jest and pageNumber=1`, () => {
    return expect(elasticsearch(null, 1)).rejects.toThrow();

  });

  test(`No stareOptions.elasticsearch setted`, () => {
    global.stareOptions.elasticsearch = null;
    return expect(elasticsearch('jest', 1)).rejects.toThrow();
  });
});

describe('SERP google', () => {
  test(`Succesfully get 'google' results for query=jest and pageNumber=1`, () => {
    return google('jest', 1).then(data => toBeStareDocument);
  });

  test(`Failed to get 'google' results for query=jest and pageNumber=1`, () => {
    return expect(google(null, 1)).rejects.toThrow();
  });

  test(`No google.apiKey setted`, () => {
    global.stareOptions.google.apiKey = null;
    return expect(google('jest', 1)).rejects.toThrow();
  });

  test(`No google.apiCx setted`, () => {
    global.stareOptions.google.apiCx = null;
    return expect(google('jest', 1)).rejects.toThrow();
  });
});

describe('SERP solr', () => {
  test(`Failed to get 'solr' results for query=jest and pageNumber=1`, () => {
    return expect(solr(null, 1)).rejects.toThrow();
  });

  // test(`No stareOptions.solr setted`, () => {
  //   global.stareOptions.solr = null;
  //   return expect(solr('jest', 1)).rejects.toThrow();
  // });
});

describe('SERP AWS Search cloud', () => {
  test(`Failed to get 'searchcloud' results for query=jest and pageNumber=1`, () => {
    return expect(searchcloud(null, 1)).rejects.toThrow();
  });

  test(`No stareOptions.searchcloud setted`, () => {
    global.stareOptions.searchcloud = null;
    return expect(searchcloud('jest', 1)).rejects.toThrow();
  });
});
