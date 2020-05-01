'use strict';

const rp = require('request-promise');
const cheerio = require('cheerio');
var debug = require('debug')('stare.js:server/scrapper');

/**
 * Gets the body tag text content for an HTML string code
 *
 * @param {string} htmlCode HTML file as a string.
 * @returns {string} The body text from the html code.
 */
function stripTags(htmlCode) {
  const $ = cheerio.load(htmlCode);
  // TODO: Remove <script> & <style> tags in between?
  return $('body').text().trim();
}

 /**
 * Get HTML code from an url and saves it in the temp folder
 *
 * @async
 * @param {string} url Documents url.
 * @returns {Promise<object>} Promise object with the html code 
 */
function html(url) {
  return new Promise((resolve, reject) => {

    rp(url)
      .then(data => {
        let htmlCode = data.toString();
        resolve(htmlCode);
      })
      .catch(err => reject(err));
  });
};

 /**
 * Get text from an url.
 *
 * @async
 * @param {string} url Documents url.
 * @returns {Promise<object>} Promise object with the text
 */
function text(url) {
  return new Promise((resolve, reject) => {
    html(url)
      .then(htmlCode => {
        let text = stripTags(htmlCode);
        resolve(text);
      })
      .catch(err => reject(err));
  });
};

module.exports = exports = {
  html,
  text
};
