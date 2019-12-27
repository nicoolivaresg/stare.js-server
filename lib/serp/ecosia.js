'use strict';

const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');

const SEARCH_URL = `https://ecosia.org/search`;

/**
 *
 * return {Promise}
 */
function getResultPages(query, pageNumber) {
  return new Promise((resolve, reject) => {
    let searchUrl = `${SEARCH_URL}?q=${query}&p=${pageNumber}`;
    console.log(searchUrl);
    rp(searchUrl)
      .then(
        html => {
          console.log(html);
          const $ = cheerio.load(html);
          
          // Total results
          let totalResults = parseInt($('div.result-count').text().replace(/\\n|results|,/g,"").trim())

          // documents / webpages
          let resultDocuments = $('.card-web .result');
          let documents = [];

          resultDocuments.each((index, element) => {
            documents.push({
              title: $(element).find('a.result-title').text().replace("\n","").trim(),
              link: $(element).find('a.result-title').attr('href'),
              snippet: $(element).find('p.result-snippet').text().replace("\n","").trim(),
              image: ''
            });
          });

          resolve({
            totalResults: totalResults,
            searchTerms: query,
            numberOfItems: resultDocuments.length,
            startIndex: (pageNumber - 1) * 10 + 1,
            documents: documents
          });
        },
      err => {
        console.error(err);
        reject(err);
      }
    )
  });
}

/**
 *
 * return {Object}
 */
function processAndFormat(ecosiaResult) {
  return ecosiaResult;
}

module.exports = {
  getResultPages,
  processAndFormat
};