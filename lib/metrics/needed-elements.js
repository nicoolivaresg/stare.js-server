'use strict';

const { reject, set } = require('lodash');
const _ = require('lodash');
var debug = require('debug')('stare.js:server/metrics/needed-elements');
const pdf_table_extractor = require("pdf-table-extractor");
const fs = require('graceful-fs');
const pupeteer = require('puppeteer');




function processFile(filePath) {
    return new Promise((resolve, reject) => {
        pdf_table_extractor('./tmp/' + filePath,
            result => {
                debug(JSON.stringify(result));
                deleteFile('./tmp/' + filePath);
                resolve(result);
            }, error => {
                debug('Error' + error);
                reject(error);
            });
    })
}

/**
 * 
 * @param  {string} fileName 
 * @param {string} mimeType
 */
function deleteFile(fileName) {
    fs.unlink(fileName, (err) => {
        if (err) {
            throw err;
        }
        debug(`File ${fileName} is deleted.`);
    });
}


/**
 * Downloads a pdf file from a source.
 * Specify sources in two ways:
 * 
 * Data + mimeType => For example 'data;application/pdf;base64, JQelA....'
 * 
 * Directo link to downloadable resource.
 * @param  {string} source 
 * @return {Promise<object>} 
 */
function downloadFile(params) {
    return new Promise((resolve, reject) => {

        let data = {};
        
        (async () => {
            let downloadState = null
            try {
                const browser = await pupeteer.launch({ headless: true });
                const page = await browser.newPage();

                await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: './tmp' });
                await page.setDefaultNavigationTimeout(30000);
                await page._client.on('Page.downloadWillBegin', async ({ frameId, guid, url, suggestedFilename }) => {
                    data.fileName = suggestedFilename;
                });
                await page._client.on('Page.downloadProgress', async ({ guid, totalBytes, receivedBytes, state }) => {
                    downloadState = state;
                    if (downloadState === 'completed') {
                        debug('download completed');
                        data.downloaded = true;
                        await page.close();
                        resolve(data);
                    }
                });
                page.goto(params, { waitUntil: 'networkidle2' });
            } catch (err) {
                debug(err);
                data = null;
                reject(err);
            }

        })();
        

    })
}

/**
 * Defines the courts (first instance, appellate and Supreme) and the entrance Date of a Lawsuit on each one from the stare-format document based
 * on the body.
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
    return new Promise(async (resolve, reject) => {
        let neededElements = { materialsSupplies: {}, equipmentTools: {}, infrastructure: {} };

        if (_.has(stareDocument, 'body') && stareDocument.body !== null && stareDocument.body.length !== null) {
            // downloadFile(stareDocument.body.data, 'application/pdf', stareDocument.link).then(res => {
            //     debug(res);
            //     processFile(res);
            // })
            // let res = await foo("data:application/pdf;base64," + stareDocument.body.data);
            let res = await downloadFile(stareDocument.link);
            debug(res);

        } else {
            reject('Document does not have "body" property');
        }

        resolve({
            name: 'needed-elements',
            index: opts.index,
            value: neededElements
        });
    })
}

module.exports = exports = calculate;