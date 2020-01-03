'use strict';

const fs = require('fs');
const LanguageDetect = require('languagedetect');
const hyphenopoly = require('hyphenopoly')
const scrapper = require('../scrapper');
var debug = require('debug')('stare-js:server/metrics/length');

const lngDetector = new LanguageDetect();
const hyphenator = hyphenopoly.config({
  sync: true,
  require: ['es', 'en-us'],
  hyphen: '-'
});

const langs = {
  'english': {
    hyphenatorCode: 'en-us',
    // Flesh 1984
    val: (words, syllables) => 207 - 0.623 * syllables - 1.05 * words
  },
  'spanish': {
    hyphenatorCode: 'es',
    // Szigriszt 1992
    val: (words, syllables) => 207 - 0.623 * syllables - words
  },
  'french': {
    hyphenatorCode: 'fr',
    // Szigriszt 1992
    val: (words, syllables) => 207 - 0.724 * syllables - 0.962 * words
  }
};

function cleanString(text) {
  return text.replace(/[.,()\[\]{}\-\@\'\"]/gi,"");
}

function splitWords(text) {
  return cleanString(text)
            .split(" ")
            .filter(word => word !== "");
}

async function syllables(text, lang) {
  lang = lang || 'en-us';
  let hyphenateText = await hyphenator.get(lang);
  return hyphenateText(cleanString(text))
            .replace(' ', '-')
            .split('-')
            .length;
}

function words(text) {
  const numberOfWords = splitWords(text).length * 1.0;
  const numberOfPhrases = text.split(".").length * 1.0;
  return numberOfWords / numberOfPhrases;
}

/**
 * Calculates the document's perpiscuity (ease to read/understand).
 * @param {Object} stareDocument
 * @param {Object} opts
 * @returns {Promise}
 */
function calculate(stareDocument, opts) {
  return new Promise((resolve, reject) => {
    scrapper.text(stareDocument.link)
      .then(data => {
        console.log(data.text);
        try {
          let language = langs[lngDetector.detect(stareDocument.snippet, 1)[0][0]];
          let value = language.val(words(data.text), syllables(data.text, language.hyphenatorCode))
          
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
        } catch(err) {
          console.log(err);
        }
      })
      .catch(err => {
        debug(`perpiscuity metric error: ${stareDocument.link}`);
        resolve({
          name: 'perpiscuity',
          index: opts.index,
          value: -1
        });
      });
  });
};

module.exports = exports = calculate;
