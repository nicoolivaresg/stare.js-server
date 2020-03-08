'use strict';

const path = require('path');
const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const crypto = require('crypto');
var debug = require('debug')('stare.js:server/scrapper');

function stripTags(htmlCode) {
  const $ = cheerio.load(htmlCode);
  // TODO: Remove <script> & <style> tags in between
  return $('body').text().trim();
}

function resolveTempFilesPath(filename) {
  return path.resolve(global.stareOptions.tempFilesPath, filename);
}
/**
 *
 * @param {object|string} stareDocument
 * @param {string} output
 * @returns {promise}
 */
function html(url, output) {
  return new Promise((resolve, reject) => {
    let filename = crypto.createHash('md5').update(url).digest('hex');
    output = typeof output === 'string' ? output : `${resolveTempFilesPath(filename)}.html`;

    rp(url)
      .then((data) => {
        let htmlCode = data.toString();
        fs.writeFile(output, htmlCode, (err) => {
          if (err) {
            reject(err);
          }
          resolve({
            filePath: output,
            htmlCode: htmlCode
          });
        });
      })
      .catch((err) => {
        // debug(`[html] Couldn't GET [${filename}.html] for url [${url}]: %s`, err);
        reject(err);
      });
  });
};

function text(url, output) {
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
    output = typeof output === 'string' ? output : `${resolveTempFilesPath(filename)}.txt`;

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
