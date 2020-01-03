'use strict';

/**
 * Calculates the ranking stare-format document based
 * on page number and position (index) of the document.
 * @param {Object} stareDocument
 * @param {Object} opts
 * @returns {Promise}
 */
function calculate(stareDocument, opts) {
  return new Promise((resolve, reject) => {
    resolve({
      name: 'ranking',
      index: opts.index,
      value: opts.searchInfo.startIndex + opts.index
    });
  });
};

module.exports = exports = calculate;