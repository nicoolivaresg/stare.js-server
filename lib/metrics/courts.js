'use strict';

const { reject } = require('lodash');
const _ = require('lodash');


/**
 * Defines the courts (first instance, appellate and Supreme) and the data assoicated with every step in the Lawsuit process from the stare-format document based
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
    return new Promise((resolve, reject) => {
        let courts = {court:{},appelateCourt:{},supreme:{}};

        if (_.has(stareDocument, 'body') && stareDocument.body !== null && stareDocument.body.length !== null) {
            if (_.has(stareDocument.body, 'tribunal') && stareDocument.body.tribunal !== null) {
                courts.court = {
                        entranceDate: stareDocument.body.fechaIngresoPimera,
                        rol: stareDocument.body.ritCausaPrimera,
                        name: stareDocument.body.tribunal.trim(),
                        sentenceDate: stareDocument.body.fechaDicSentenciaPrimera,
                        result: stareDocument.body.resultadoPrimera
                    }
                if (_.has(stareDocument.body, 'corte') && stareDocument.body.corte !== null) {
                    courts.appelateCourt = {
                        entranceDate: stareDocument.body.fechaIngresoApe,
                        rol: stareDocument.body.rolApelacion,
                        resource: stareDocument.body.recursoApelacion,
                        name: stareDocument.body.corte,
                        result: stareDocument.body.resultadoApe
                    }
                    if (_.has(stareDocument.body, 'rolSuprema') && stareDocument.body.rolSuprema !== null) {
                        courts.supreme = {
                            entranceDate: stareDocument.body.fechaIngSuprema,
                            rol: stareDocument.body.rolSuprema,
                            resource: stareDocument.body.recursoSuprema,
                            name: 'Corte Suprema',
                            result: stareDocument.body.resultadoSuprema
                        }
                    }
                    else {
                        court.supreme = { }
                    }
                }
                else {
                    court.appelateCourt = { }
                }
            } else {
                court.court = { }
            }
        } else {
            reject('Document does not have "body" property');
        }

        resolve({
            name: 'courts',
            index: opts.index,
            value: courts
        });
    })
}

module.exports = exports = calculate;