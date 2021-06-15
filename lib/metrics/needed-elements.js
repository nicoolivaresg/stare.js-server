'use strict';

const { reject, set, findIndex, indexOf, split } = require('lodash');
const _ = require('lodash');
var debug = require('debug')('stare.js:server/metrics/needed-elements');
const fs = require('graceful-fs');
const natural = require('natural');


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