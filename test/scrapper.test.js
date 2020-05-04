'use strict';

const scrapper = require('../lib/scrapper/');

const stareUrl = 'https://starejs.informatica.usach.cl/';

describe('Scrapper', () => {
  test(`Succesfully get html`, () => {
    html(stareUrl).then(data => {
      expect(data).toBeCalledWith(expect.any(String));
    });
  });

  test(`Failed to get html`, () => {
    expect(html(`not-a-valid-url`)).toThrow();
  });

  test(`Succesfully get text`, () => {
    text(stareUrl).then(data => {
      expect(data).toBeCalledWith(expect.any(String));
    });
  });

   test(`Failed to get text`, () => {
    expect(text(`not-a-valid-url`)).toThrow();
  });
});