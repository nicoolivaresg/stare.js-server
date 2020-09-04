'use strict';

const LanguageDetect = require('languagedetect');
const hyphenopoly = require('hyphenopoly')
const _ = require('lodash');
const scrapper = require('../scrapper');
var debug = require('debug')('stare.js:server/metrics/perspicuity');

const lngDetector = new LanguageDetect();
const hyphenator = hyphenopoly.config({
  require: ['es', 'en-us', 'fr'],
  hyphen: '-',
  sync: true
});

/*
* Supported languages, consists of a key for the language name (in english)
* and the value is string for the hyphenopoly code and a function to calculate the perspicuity.
*/
const SUPPORTED_LANGUAGES = {
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

/**
 * Clean a string removing symbol characters
 *
 * @param {string} text The string to clean
 * @returns {string} The same text without the symbols.
 */
function cleanString(text) {
  return text.replace(/[.,()\[\]{}\-\@\'\"]/gi,"");
}

/**
 * Separates a long text string removing 'empty' words/spaces
 *
 * @param {string} text The string to split.
 * @returns {array} Array of strings with the words of the text
 */
function splitWords(text) {
  return cleanString(text)
            .split(" ")
            .filter(word => word !== "");
}

/**
 * Gets the number of syllables in the text variable.
 *
 * @param {string} text String text
 * @param {string} lang Language code for hyphenopoly
 * @returns {number} Number of syllables
 */
function syllables(text, lang) {
  let hyphenateText = hyphenator.get(lang);
  return hyphenateText(cleanString(text))
          .replace(' ', '-')
          .split('-')
          .length;
}

/**
 * Get ratio between words and phrases in the text.
 * 
 * @param {string} text String text
 * @returns {number} Ratio between words and phrases
 */
function words(text) {
  const numberOfWords = splitWords(text).length * 1.0;
  const numberOfPhrases = text.split(".").length * 1.0;
  return numberOfWords / numberOfPhrases;
}

/**
 * Calculates the document's perspicuity (ease to read/understand).
 *
 * @async
 * @param {Object} stareDocument  The Document data with stare format
 * @param {string} stareDocument.title  Document title
 * @param {string} stareDocument.link  Document link
 * @param {string} stareDocument.snippet  Document snippet
 * @param {string} stareDocument.image  Document image
 * @param {Object} opts  Optional parameters to calculate the metric 
 * @param {Object} opts.searchInfo  Search info for the query associated to the document
 * @param {string} opts.searchInfo.totalResults  Total documents that generates the query (formatted with dots '.' in the thousands)
 * @param {string} opts.searchInfo.searchTerms  Query string
 * @param {integer} opts.searchInfo.numberOfItems  Number of documents that contains this page result
 * @param {integer} opts.searchInfo.startIndex  Start document ranking for this page result.
 * @returns {Promise}
 */
function calculate(stareDocument, opts) {
  return new Promise((resolve, reject) => {
    scrapper.text(stareDocument)
      .then(text => {
        let language = _.get(SUPPORTED_LANGUAGES, lngDetector.detect(text, 1)[0][0], null);

        if (! language) {
          resolve({
            name: 'perspicuity',
            index: opts.index,
            value: {
              code: -1,
              message: 'Language not supported'
            }
          });
          return;
        }

        let value = language.val(words(text), syllables(text, language.hyphenatorCode))

        value = Math.round(value);
        
        if (value < 0) {
          value = 0;
        }

        resolve({
          name: 'perspicuity',
          index: opts.index,
          value: value
        });
      })
      .catch(err => {
        resolve({
          name: 'perspicuity',
          index: opts.index,
          value: {
            code: _.get(err, 'statusCode', -1),
            message: 'Error getting text.'
          }
        });
      });
  });
};

module.exports = exports = calculate;
