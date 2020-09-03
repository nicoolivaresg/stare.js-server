'use strict';

const scrapper = require('../lib/scrapper/');

const VALID_URL = 'https://starejs.informatica.usach.cl/';
const INVALID_URL = null;

describe('Scrapper', () => {
  test(`Succesfully get html`, () => {
    return expect(scrapper.html(VALID_URL).then(html => (typeof html).toLowerCase())).resolves.toBe("string");
  }, 10000);

  test(`Failed to get html`, () => {
    return expect(scrapper.html(INVALID_URL)).rejects.toThrow();
  });

  test(`Succesfully get text`, () => {
    return expect(scrapper.text(VALID_URL).then(text => (typeof text).toLowerCase())).resolves.toBe("string");
  }, 10000);

   test(`Failed to get text`, () => {
    return expect(scrapper.text(INVALID_URL)).rejects.toThrow();
  });
});