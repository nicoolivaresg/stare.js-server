'use strict';

const { reject, set, findIndex, indexOf, split } = require('lodash');
const _ = require('lodash');
var debug = require('debug')('stare.js:server/metrics/needed-elements');
const pdf_table_extractor = require("pdf-table-extractor");
const fs = require('graceful-fs');
const pupeteer = require('puppeteer');
const natural = require('natural');


/**
 * Define the extracted data from a pdf SENCE document
 * @param {string} filePath 
 * @return {Promise<object>}
 */
function processFile(filePath) {
    return new Promise((resolve, reject) => {
        pdf_table_extractor('./tmp/' + filePath,
            result => {
                deleteFile('./tmp/' + filePath);
                var materials = [];
                let infrastructure = [];
                let equipment = [];
                let indexRow = -1;
                let indexMateriales = -1;
                let indexInfra = -1;
                let indexEquip = -1;
                result.pageTables.forEach(pageTable => {
                    pageTable.tables.forEach(table => {
                        indexMateriales = findIndex(table, row => {
                            return row === 'Materiales e insumos';
                        });
                        if (indexMateriales >= 0) {
                            if (table[indexMateriales + 1] !== null) {
                                let unformattedMaterials = table[indexMateriales + 1]
                                let parsed = parse(unformattedMaterials);
                                materials = materials.concat(parsed);
                            }
                        }

                        indexInfra = findIndex(table, row => {
                            return row === 'Infraestructura';
                        });
                        if (indexInfra >= 0) {
                            if (table[indexInfra + 1] !== null) {
                                let unformattedInfra = table[indexInfra + 1]
                                let parsed = parse(unformattedInfra);
                                infrastructure = infrastructure.concat(parsed);
                            }
                        }

                        indexEquip = findIndex(table, row => {
                            return row === 'Equipos y herramientas';
                        });
                        if (indexEquip >= 0) {
                            if (table[indexEquip + 1] !== null) {
                                let unformattedEquip = table[indexEquip + 1]
                                let parsed = parse(unformattedEquip);
                                equipment = equipment.concat(parsed);
                            }
                        }
                    })
                });
                resolve({
                    materials: materials,
                    infrastructure: infrastructure,
                    equipment: equipment
                });
            }, error => {
                debug('Error' + error);
                reject(error);
            });
    })
}

/**
 * Define la lista de elementos necesarios para la implementación de un plan formativo extraído desde sus módulos.
 * @param {Array<object>} modulos 
 * @returns {Array<string>}
 */
function process(modulos) {
    return new Promise((resolve, reject) => {
        try {
            let all_modules=[];
            modulos.forEach(m => {
                let data = m.content.split("\n\nRECURSOS MATERIALES PARA LA IMPLEMENTACIÓN DEL MÓDULO FORMATIVO\n\nInfraestructura Equipos y herramientas Materiales e insumos\n\n")[1];
                if(data !== undefined){
                    data = data.replace(/\n/g, ' ');
                    data = data.split(/\*/g)
                    data = data.filter(e => {
                        return e !== '';
                    });
                    data = data.map(e => {
                        return e.replace(/\. $/g, '');
                    })
                    data = data.map(e => {
                        return e.trim();
                    })
                    let  all = [];
                    data.forEach(e => {
                        
                        if(e.includes(':')){
                            // let main = e.split(':')[0];
                            let list = e.split(':')[1];
                            list = list.split(/\. +/g);
                            list = list.map(e => {
                                return e.trim();
                            })
                            
                            all = all.concat(list);
                        }
                        else{
                            let tmp = e.split(/\. +/g);
                            tmp = tmp.map(e => {
                                return e.replace(/\.$/g, '');
                            })
                            all = all.concat(tmp);
                        }
                    });
                    all_modules = all_modules.concat(all);
                }
            });
            resolve(all_modules);
        } catch (error) {
            debug('Error ' + error);
            reject([]);
        }
    });
}

/**
 * Defines the set of Materials elements from a unformatted set of cells from document's table.
 * @param {string} data
 * @return {Array<string>}  
 */
function parse(data) {
    try {
        var tokenizer = new natural.SentenceTokenizerNew();
        var tokenizedData = tokenizer.tokenize(data);
        tokenizedData = tokenizedData.map(element => {
            let s = element.replace(/\*/g, '');
            s = s.replace(/\./g, '');
            if (s.includes(':')) {
                s = s.split(':')[1];
            }
            return (s);
        });
        return tokenizedData;
    } catch (error) {
        reject(error);
        return [];
    }
}


/**
 * Defines the frecuency of every element in an array
 * @param {Array<string>} data 
 * @param {number} threshold Number between 0 to 1 (percentage of umbral per element)
 * @returns {object}
 */
function frecuency(data, threshold) {
    try {
        let count={};
        data.forEach(element => {
            let elementCount = data.filter(e => {
                return natural.JaroWinklerDistance(element, e, undefined, true) > threshold ;
            }).length;
            count[element] ? count[element] = elementCount : count[element] = 1; 
        })
        return count;
    } catch (error) {
        return null;
    }
}

/**
 * 
 * @param  {string} fileName 
 * @param {string} mimeType
 */
function deleteFile(fileName) {
    return new Promise((resolve, reject) => {
        try {
            fs.unlink(fileName, (err) => {
                if (err) {
                    throw err;
                }
                debug(`File ${fileName} is deleted.`);
                resolve('done');
            });
        } catch (error) {
            reject(error);
        }
    })
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
        let neededElements = { supplies: {}, tools: {}, infrastructure: {} };
        
        if (_.has(stareDocument, 'body') && stareDocument.link !== null && stareDocument.link.length !== null) {
            try {
                let data = await process(_.get(stareDocument.body, 'Módulos'));
                let threshold = 0.75;
                let freq = frecuency(data, threshold);
                neededElements= freq;
                // let res = await downloadFile(stareDocument.link);
                // if (res.downloaded) {
                //     let data = await processFile(res.fileName);
                //     let threshold = 0.75;
                //     let freqSupp = frecuency(data.materials, threshold);
                //     let freqInfr = frecuency(data.infrastructure, threshold);
                //     let freqEquip = frecuency(data.equipment, threshold);
                //     neededElements = {
                //         supplies: freqSupp,
                //         tools: freqEquip,
                //         infrastructure: freqInfr
                //     };
                // }



            } catch (error) {
                reject(error);
            }
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