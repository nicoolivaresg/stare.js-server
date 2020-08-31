'use strict';

const scrapper = require('../lib/scrapper/');

const stareUrl = 'https://starejs.informatica.usach.cl/';

describe('Scrapper', () => {
  test(`Succesfully get html`, () => {
    return scrapper.html(stareUrl).then(data => {
      expect(data).toBe(expect.any(String));
    });
  }, 10000);

  test(`Failed to get html`, () => {
    return expect(scrapper.html(null)).rejects.toThrow();
  });

  test(`Succesfully get text`, () => {
    return expect(scrapper.text(stareUrl)).resolves.toBe(expect.any(String));
  }, 10000);

   test(`Failed to get text`, () => {
    return expect(scrapper.text(null)).rejects.toThrow();
  });
});