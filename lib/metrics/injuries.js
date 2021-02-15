'use strict';

const { reject } = require('lodash');
const _ = require('lodash');


/**
 * Defines the ammount of money requested by a person on a Lawsuit on from First Instance Tribunals to Supreme Court from the stare-format document based
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
        let injuries = {};

        if (_.has(stareDocument, 'body') && stareDocument.body !== null && stareDocument.body.length !== null) {
            if (_.has(stareDocument.body, 'listaDetalleTopografico') && stareDocument.body.listaDetalleTopografico !== null) {
                injuries.affectedBodyParts = stareDocument.body.listaDetalleTopografico.split(";");
                injuries.affectedBodyParts = injuries.affectedBodyParts.map(element => {
                    return element.trim();
                })
            } else {
                injuries.affectedBodyParts = {}
            }
            //Check if there was medical diagnosis
            if (_.has(stareDocument.body, 'diagnosticoMedico') && stareDocument.body.diagnosticoMedico !== null) {
                injuries.medicalDiagnosis = stareDocument.body.diagnosticoMedico.split(";");
                injuries.medicalDiagnosis = injuries.medicalDiagnosis.map(element => {
                    return element.trim();
                })
                //fechaDiagnostico
                if (_.has(stareDocument.body,'fechaDiagnostico') && stareDocument.body.fechaDiagnostico !== null){
                    injuries.dateMedicalDiagnosis = stareDocument.body.fechaDiagnostico.trim();
                } else {

                }
            } else {
                injuries.medicalDiagnosis = {}
            }

            //Check if there was a sequel 
            if (_.has(stareDocument.body, 'secuela') && stareDocument.body.secuela !== null) {
                if (stareDocument.body.secuela.trim().toLowerCase() === "si") {
                    injuries.sequel = {}
                    if (_.has(stareDocument.body, 'diagnosticoSecuela') && stareDocument.body.diagnosticoSecuela !== null) {
                        injuries.sequel.listSequels = stareDocument.body.diagnosticoSecuela.split(";");
                        injuries.sequel.listSequels = injuries.sequel.listSequels.map(element => {
                            return element.trim();
                        })
                    } else {
                        injuries.sequel.listSequels = {}
                    }
                    if (_.has(stareDocument.body, 'fechaDiagnostico') && stareDocument.body.fechaDiagnostico !== null) {
                        injuries.sequel.dateDiagnosis = stareDocument.body.fechaDiagnostico
                    } else {
                        injuries.sequel.dateSequelsDiagnosis = {}
                    }
                    if(_.has(stareDocument.body, 'origenDatoSecuela') && stareDocument.body.origenDatoSecuela !== null){
                        injuries.sequel.source = stareDocument.body.origenDatoSecuela.trim();
                    }else{
                        injuries.sequel.source = null
                    }
                }  
            }
        } else {
            reject("Document does not have 'body' property");
        }

        resolve({
            name: 'injuries',
            index: opts.index,
            value: injuries
        });
    })
}

module.exports = exports = calculate;