'use strict';

const _ = require('lodash');
const debug = require('debug')('stare.js:server/metrics/profile')


function process(modules) {
  var perfiles = [];
  var name = undefined;
  var code = undefined;
    return new Promise((resolve, reject) => {
        try {
          modules.some(m => {
            var tmp = m.content.split('Perfil ChileValora asociado al módulo');
            if( tmp.length > 1){
              var perfil =  tmp[1].split('UCL(s) ChileValora relacionada(s)')[0];
              debug('PERFIL: ' + perfil.trim().split('/')[0]);
              debug('CODE: ' +perfil.trim().split('/')[1]);
              name= perfil.trim().split('/')[0];
              code= perfil.trim().split('/')[1];
              if (_.isEqual(perfil, 'SIN PERFIL CHILEVALORA ASOCIADO.')){
                return true;
              }else{
                return true;
              }
            }
          })
          resolve({
            name: name.trim().replace(/\./g,''),
            code: code ? code.trim().replace(/\./g,'') : ''
          });
        } catch (error) {
            debug('Error ' + error);
            reject({
              name: name,
              code: code
            });
        }
    });
}

/**
 * Calculates associated profiles from stareDocument.
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
  let associated_profiles = null;
  return new Promise(async (resolve, reject) => {
    if (_.has(stareDocument, 'body.Módulos')) {

      try {
        debug(_.get(stareDocument, 'body.Nombre'));
        associated_profiles = await process(_.get(stareDocument, 'body.Módulos'));                
      } catch (error) {
          reject(error);
      }
      
  }
    resolve({
      name: 'profiles',
      index: opts.index,
      value: associated_profiles
    });
  });
};

module.exports = exports = calculate;
