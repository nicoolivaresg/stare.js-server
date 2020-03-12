'use strict';

const bing = require('../lib/serp/bing');
const ecosia = require('../lib/serp/ecosia');
const elasticsearch = require('../lib/serp/elasticsearch');
const google = require('../lib/serp/google');

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

test(`SERP 'bing' for query=jest and pageNumber=1`, () => {
  return bing('jest', 1).then(data => toBeStareDocument);
});

test(`SERP 'ecosia' for query=jest and pageNumber=1`, () => {
  return ecosia('jest', 1).then(data => toBeStareDocument);
});

test(`SERP 'elasticsearch' for query=jest and pageNumber=1`, () => {
  return elasticsearch('jest', 1).then(data => toBeStareDocument);
});

test(`SERP 'google' for query=jest and pageNumber=1`, () => {
  return google('jest', 1).then(data => toBeStareDocument);
});