'use strict';

const scrapper = require('../lib/scrapper/');

const stareUrl = 'https://starejs.informatica.usach.cl/';

describe('Scrapper', () => {
  test(`Succesfully get html`, () => {
    expect(scrapper.html(stareUrl)).resolves.toBe(expect.any(String));
  });

  test(`Failed to get html`, () => {
    expect(scrapper.html(null)).rejects.toThrow();
  });

  test(`Succesfully get text`, () => {
    expect(scrapper.text(stareUrl)).resolves.toBe(expect.any(String));
  });

   test(`Failed to get text`, () => {
    expect(scrapper.text(null)).rejects.toThrow();
  });
});