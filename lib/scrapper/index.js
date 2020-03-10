'use strict';

const path = require('path');
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const crypto = require('crypto');
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
 * Gets the full path from a file in the temp folder.
 *
 * @param {string} filename Name of the file in the temp folder
 * @retuns {string} Full path for 'filename' from temp file.
 */
function resolveTempFilesPath(filename) {
  return path.resolve(global.stareOptions.tempFilesPath, filename);
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
    let filename = crypto.createHash('md5').update(url).digest('hex');
    let output = `${resolveTempFilesPath(filename)}.html`;

    rp(url)
      .then((data) => {
        let htmlCode = data.toString();
        fs.writeFile(output, htmlCode, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({
            filePath: output,
            htmlCode: htmlCode
          });
        });
      })
      .catch((err) => {
        reject(err);
      });
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
    let filename = crypto.createHash('md5').update(url).digest('hex');
    let input = `${resolveTempFilesPath(filename)}.txt`;

    // text file already exists
    if (fs.existsSync(input)) {
      let text = fs.readFileSync(input, 'utf8');

      resolve({
        filePath: input,
        text: text
      });
      return;
    }

    input = `${resolveTempFilesPath(filename)}.html`;
    let output = `${resolveTempFilesPath(filename)}.txt`;

    let htmlCode;
    // html file exists
    if (fs.existsSync(input)) {
      let htmlCode = fs.readFileSync(input, 'utf8');
      // clear html & create txt file
      let text = stripTags(htmlCode);

      fs.writeFile(output, text, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve({
          filePath: output,
          text: text
        });
        return;
      });
    } else {
      // html file doesn't exists
      html(url)
        .then(data => {
          let text = stripTags(data.htmlCode);
          fs.writeFile(output, text, err => {
            if (err) {
              reject(err);
              return;
            }

            resolve({
              filePath: output,
              text: text
            });
            return;
          });
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};

module.exports = exports = {
  html,
  text
};
