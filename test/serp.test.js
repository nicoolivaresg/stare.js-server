'use strict';

const bing = require('../lib/serp/bing');
const ecosia = require('../lib/serp/ecosia');
const elasticsearch = require('../lib/serp/elasticsearch');
const google = require('../lib/serp/google');
const solr = require('../lib/serp/solr');

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
    return bing(null, 1).then(data => toBeStareDocument);
  });

  // test(`No ms-rest-azure installed`, () => {
  //   return bing('jest', 1).then(data => toBeStareDocument);
  // });

  // test(`No azure-cognitiveservices-websearch installed`, () => {
  //   return bing('jest', 1).then(data => toBeStareDocument);
  // });

  test(`No BING_SERVICE_KEY setted`, () => {
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
  // test(`Succesfully get 'elasticsearch' results for query=jest and pageNumber=1`, () => {
  //   return elasticsearch('jest', 1).then(data => toBeStareDocument);
  // });

  test(`Failed to get 'elasticsearch' results for query=jest and pageNumber=1`, () => {
    return elasticsearch(null, 1).then(data => toBeStareDocument);
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
    return google(null, 1).then(data => toBeStareDocument);
  });

  // test(`No googleapis installed`, () => {
  //   return google('jest', 1).then(data => toBeStareDocument);
  // });

  test(`No GOOGLE_API_KEY setted`, () => {
    global.stareOptions.google.apiKey = null;
    return expect(google('jest', 1)).rejects.toThrow();
  });

  test(`No GOOGLE_API_CX setted`, () => {
    global.stareOptions.google.apiCx = null;
    return expect(google('jest', 1)).rejects.toThrow();
  });
});

describe('SERP solr', () => {
  // test(`Succesfully get 'solr' results for query=jest and pageNumber=1`, () => {
  //   return solr('jest', 1).then(data => toBeStareDocument);
  // });

  test(`Failed to get 'solr' results for query=jest and pageNumber=1`, () => {
    return solr(null, 1).then(data => toBeStareDocument);
  });

  test(`No stareOptions.solr setted`, () => {
    global.stareOptions.solr = null;
    return expect(solr('jest', 1)).rejects.toThrow();
  });
});
