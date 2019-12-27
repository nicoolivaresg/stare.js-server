'use strict';

const scrapper = require('../scrapper');
const fs = require('fs');
const documentsPath = './docs';

const LanguageDetect = require('languagedetect');
const hyphenopoly = require("hyphenopoly")

const lngDetector = new LanguageDetect();
const silabas = hyphenopoly.config({
  sync: true,
  require: ['es', 'en-us'],
  hyphen: '-'
});

const langs = {
  // 'en-us'
  english: {
    code: 'en-us',
    val: (words, syllables) => 207-0.623*syllables-1.05*words
  },
  // 'es'
  spanish: {
    code: 'es',
    val: (words, syllables) => 207-0.623*syllables-words
  },
  // 'fr'
  french: {
    code: 'fr',
    val: (words, syllables) => 207-0.724*syllables-0.962*words
  }
};

function cleanString(str) {
  return str.replace(/[.,()\[\]{}\-\@\'\"]/gi,"");
}
function splitWords(str) {
  return cleanString(str).split(" ");
}

function syllables(str, lang = "es") {
  return silabas.get(lang)(cleanString(str)).replace(" ","-").split("-").length;
}

function words(str) {
  const numberOfWords = splitWords(str).length * 1.0;
  const numberOfPhrases = str.split(".").length * 1.0;
  return numberOfWords / numberOfPhrases;
}

// 'Public'

/**
 * Calculates the perpiscuity (ease to read/understand) of the document.
 * @param {Object} stareDocument
 * @param {Object} opts
 * @returns {Promise}
 */
function calculate(stareDocument, opts) {
  return new Promise((resolve, reject) => {
    let filePath = `${documentsPath}.txt`;

    fs.readFile(input, (err, data) => {
      if (err) {
        reject(err);
        return err;
      }
      data = data.toString();

      let language = langs[lngDetector.detect(stareDocument.snippet, 1)[0][0]];
      let value = language.val(words(data), syllables(data, language.code))

      value = Math.round(value);
      if (value < 0) {
        value = 0;
      }

      if (value > 207) {
        value = 207;
      }

      resolve({
        name: 'perpiscuity',
        index: opts.index,
        value: value
      });
      reject(false);
    });
  });
};

module.exports = exports = calculate;
