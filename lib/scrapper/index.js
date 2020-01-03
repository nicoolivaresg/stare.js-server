'use strict';

const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const crypto = require('crypto');
var debug = require('debug')('stare-js:server/scrapper');

function stripTags(htmlCode) {
  const $ = cheerio.load(htmlCode);
  return $('body').text().trim();
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
    output = typeof output === 'string' ? output : `${global.stareOptions.tempFilesPath}${filename}.html`;
    
    rp(url)
      .then((data) => {
        let htmlCode = data.toString();
        fs.writeFile(output, htmlCode, (err) => {
          if (err) {
            debug(`[html] Couldn't write file: ${filename}.html for url: ${url}`);
            reject(err);
          }
          resolve({
            filePath: output,
            htmlCode: htmlCode
          });
        });
      })
      .catch((err) => {
        debug(`[html] Couldn't write file: ${filename}.html for url: ${url}`);
        reject(err);
      });
  });
};

function text(url, output) {
  return new Promise((resolve, reject) => {
    let filename = crypto.createHash('md5').update(url).digest('hex');
    let input = `${global.stareOptions.tempFilesPath}${filename}.txt`;
    debug(`[text] from url: ${url}`);
    
    // text file already exists
    if (fs.existsSync(input)) {
      debug(`[text] file already exists: ${filename}.txt`);
      let text = fs.readFileSync(input, 'utf8');

      resolve({
        filePath: input,
        text: text
      });
    }

    input = `${global.stareOptions.tempFilesPath}${filename}.html`;
    output = typeof output === 'string' ? output : `${global.stareOptions.tempFilesPath}${filename}.txt`;

    let htmlCode;
    // html file exists
    if (fs.existsSync(input)) {
      debug(`[html] file already exists: ${filename}.html`);
      let htmlCode = fs.readFileSync(input, 'utf8');
      // clear html & create txt file
      let text = stripTags(htmlCode);
      debug(`[text] file created: ${filename}.txt`);
      fs.writeFile(output, text, err => {
        if (err) {
          reject(err);
        }

        resolve({
          filePath: output,
          text: text
        });
      });
    } else {
      // html file doesn't exists
      debug(`[html] request from url: ${url}`);
      html(url)
        .then(data => {
          let text = stripTags(data.htmlCode);
          fs.writeFile(output, text, err => {
            debug(`[text] file created: ${output}`);
            if (err) {
              debug(`[text] Couldn't write file: ${filename}.txt for url: ${url}`);
              reject(err);
            }

            resolve({
              filePath: output,
              text: text
            });
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
