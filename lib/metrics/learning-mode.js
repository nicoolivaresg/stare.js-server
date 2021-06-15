'use strict';

const { reject } = require('lodash');
const debug = require('debug')('stare.js:server/metrics/learning-mode');
const _ = require('lodash');
const natural = require('natural');

/**
 * Defines
 * @param {Array<object>} modules 
 * @returns {Array<string>}
 */
function process(modules) {
    var modulos=[];
    var onlines = 0;
    var enter = false;
    return new Promise((resolve, reject) => {
        try {
            modulos = modules.map(m => {
                var tmp = m.content.split('Nombre');
                if(tmp.length > 1){
                    var name = `${tmp[1].split('N° de horas asociadas al módulo')[0]}`;
                    
                    tmp = tmp[1].split('N° de horas asociadas al módulo');
                    var time = tmp.length > 1 ? `${tmp[1].split('\n')[0]}`: 'NO TIME';
                    if(tmp.length > 1){
                        tmp = tmp[1].split("Código Módulo");
                        var code = tmp.length > 1 ? `${tmp[1].split('\n')[0]}`: 'NO CODE';

                        if( tmp.length > 1 ){
                            tmp = tmp[1].split('Adaptabilidad a modalidad no presencial');
                            var learning = tmp.length > 1 ? `${tmp[1].split('\n')[0]}` : 'NO LEARNING';
                            
                        }
                    }
                }
                var online = learning.includes('online');
                var mode = online ? 'ONLINE': 'PRESENCIAL';
                
                if( online ){
                    onlines++;
                }

                return {
                    code: code.trim(),
                    name: name.trim(),
                    time: parseInt(time.trim()),
                    learning: mode.trim()
                }
            })

            if(onlines === 0){
                resolve({
                    mode: 'PRESENCIAL',
                    modules: modulos
                })
            }
            if(onlines === modules.length ){
                resolve({
                    mode: 'ONLINE',
                    modules: modulos
                })
            }
            if(onlines < modules.length){
                resolve({
                    mode: 'B-LEARNING',
                    modules: modulos
                })
            }
        } catch (error) {
            debug('Error ' + error);
            reject(modulos);
        }
    });

}


/**
 * Defines learning mode from the stare-format document based
 * on the SENCE plan.
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
        var learning = null

        if (_.has(stareDocument, 'body.Módulos')) {

            try {
                learning = await process(_.get(stareDocument, 'body.Módulos'));  
            } catch (error) {
                reject(error);
            }
            
        }

        resolve({
            name: 'learning-mode',
            index: opts.index,
            value: learning
        });
    })
}

module.exports = exports = calculate;