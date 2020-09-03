'use strict';

const { html, text } = require('../lib/scrapper/');

const stareValidDocument = {
  link: 'https://starejs.informatica.usach.cl/',
  body: '',
};

const stareInvalidLinkDocument = {
  link: 'https://stare.example.org',
  body: '',
};

const stareEmptyLinkDocument = {
  link: '',
  body: null,
};

const stareNullLinkDocument = {
  link: null,
  body: null,
};

describe('Scrapper', () => {
  test(`Succesfully get html`, () => {
    return expect(html(stareValidDocument).then(html => (typeof html).toLowerCase())).resolves.toBe("string");
  }, 10000);

  test(`Empty link property to get html`, () => {
    return expect(html(stareEmptyLinkDocument)).resolves.toBe(stareEmptyLinkDocument.body);
  });

  test(`Failed to get html, invalid link`, () => {
    return expect(html(stareInvalidLinkDocument)).rejects.toThrow();
  });

  test(`Succesfully get text`, () => {
    return expect(text(stareValidDocument).then(text => (typeof text).toLowerCase())).resolves.toBe("string");
  }, 10000);

   test(`Empty link property to get text`, () => {
    return expect(text(stareEmptyLinkDocument)).resolves.toBe(stareEmptyLinkDocument.body);
  });
});