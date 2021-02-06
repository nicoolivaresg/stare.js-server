'use strict';

const debug = require('debug')('stare.js:server/scrapper');
const rp = require('request-promise');
const cheerio = require('cheerio');
const validUrl = require('valid-url');
const _ = require('lodash');
const gaxios = require('gaxios');
var levenshtein = require('fast-levenshtein');
const HtmlTableToJson = require('html-table-to-json');
const puppeteer = require('puppeteer');
const BOLETA_FACTURA_URL = "https://www.boletaofactura.com/";
const { min } = require('lodash');



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
function html(stareDocument) {
  if (_.has(stareDocument, 'link') && validUrl.isUri(stareDocument.link)) {
    let url = _.get(stareDocument, 'link');

    return new Promise((resolve, reject) => {
      rp(url)
        .then(data => {
          let htmlCode = data.toString();
          resolve(htmlCode);
        })
        .catch(err => reject(new Error(err)));
    });
  }
  
  return Promise.resolve(_.get(stareDocument, 'body', ''));
};

 /**
 * Get text from an url.
 *
 * @async
 * @param {string} url Documents url.
 * @returns {Promise<object>} Promise object with the text
 */
function text(stareDocument) {
  if (_.has(stareDocument, 'link') && validUrl.isUri(stareDocument.link)) {
    let url = _.get(stareDocument, 'link', '');

    return new Promise((resolve, reject) => {
      html(url)
        .then(htmlCode => {
          let text = stripTags(htmlCode);
          resolve(text);
        })
        .catch(err => reject(new Error(err)));
    });
  }

  return Promise.resolve(_.get(stareDocument, 'body', ''));
};

 /**
 * Get JSON table from an url with html tables.
 *
 * @async
 * @param {string} stareDocument A standard format stare document
 * @returns {Promise<object>} Promise object with the object
 */
async function scrapBusinessInfo(stareDocument) {
  if (_.has(stareDocument, 'title') && stareDocument.title !== null) {
    let company = stareDocument.title.toUpperCase().split(" CON ")[1];

    return new Promise((resolve, reject) => {
      let result = (async () => {
        let data = {};
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.goto(BOLETA_FACTURA_URL,{'waitUntil':'load'});
        const [elementHandle] = await page.$x("//input[@placeholder='Buscar por empresas, fundaciones, etc.']");
        await elementHandle.type(company);
        await elementHandle.press('Enter');
        await page.waitFor('//table');
        let res  = await page.evaluate(()=>{
          let table = document.querySelector('table').outerHTML;
          return table;
        })
        await browser.close();
        res = HtmlTableToJson.parse(res).results;
        // Select list of business details
        let list = res[0];
        // Get list of Levenshtein Distances between our searching company and every businessname in the list
        let distanceArray = list.map(elem =>{
          return levenshtein.get(company,_.get(elem, 'Razón Social (A-Z)'));
        });
        // Get the minimal Levenshtein Distances
        let minDistance = min(distanceArray);
        // Get the index of the minimal Levenshtein Distance
        let indexMinDistance = distanceArray.indexOf(minDistance);
        // Isolate minimal similarBusiness
        let similarBusiness = res[0][indexMinDistance];

        let percentage = null;
        if (similarBusiness !== undefined){
          // Calculate minLen and maxLen between searched company and found minimal similarBusiness
          let similarName = _.get(similarBusiness, 'Razón Social (A-Z)');
          let maxLen = company.length > similarName.length ? company.length : similarName.length;
          let minLen = company.length < similarName.length ? company.length : similarName.length;
          // Iterate to get the max index of similarity between each character from both strings businsess name
          let sameCharAtIndex = 0;
          for (let index = 0; index < minLen; index++) {
            if (company[index] == _.get(similarBusiness, 'Razón Social (A-Z)')[index])
            {
                sameCharAtIndex++;
            }         
          }
          percentage = (sameCharAtIndex / maxLen) * 100;
          data = {
            similarityPercentage : percentage,
            businessData: similarBusiness
          };
          let response = await gaxios.request({
            url: 'https://siichile.herokuapp.com/consulta?rut='+_.get(similarBusiness, 'RUT'),
            method: 'GET',
            responseType: 'json',
          });

          if(response.status === 200){
            data.SII = response.data;
          }
        }
        return data;
      })();

      debug(result);
      resolve(result);
    });
  }

  return Promise.resolve({});
};

module.exports = exports = {
  html,
  text,
  scrapBusinessInfo
};
