'use strict';

const scrapper = require('../scrapper');
const fs = require('fs');
const documentsPath = './docs';

/**
 * Calculates the length (number of chars) of the document.
 * @param {Object} stareDocument
 * @param {Object} opts
 * @returns {Promise}
 */
function calculate(stareDocument, opts) {
  return new Promise((resolve, reject) => {
    let filePath = `${documentsPath}.txt`;

    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
        return err;
      }

      resolve({
        name: 'length',
        index: opts.index,
        value: data.length + 1
      });
      reject(false);
    });
  });
};

module.exports = exports = calculate;
