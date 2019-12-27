'use strict';

const LanguageDetect = require('languagedetect');

const lngDetector = new LanguageDetect();

/**
 * Defines the language of the stare-format document based
 * on the snippet.
 * @param {Object} stareDocument
 * @param {Object} opts
 * @returns {Promise}
 */
function calculate(stareDocument, opts) {
  return new Promise((resolve, reject) => {
    resolve({
      name: 'language',
      index: opts.index,
      value: lngDetector.detect(stareDocument.snippet, 1)[0][0]
    });
    reject(false);
  })
};

module.exports = exports = calculate;
