'use strict';

const { reject, now } = require('lodash');
const _ = require('lodash');
const http = require('axios');
const URL_MI_INDICADOR = `https://mindicador.cl/api/{indicador}/{fecha}`;
const ipc_anuales_1990_2021 = [{ "ano": 2025, "ipc": 3.6 }, { "ano": 2024, "ipc": 3.6 }, { "ano": 2023, "ipc": 3.6 }, { "ano": 2022, "ipc": 3.6 }, { "ano": 2021, "ipc": 3.6 }, { "ano": 2020, "ipc": 3.05 }, { "ano": 2019, "ipc": 2.56 }, { "ano": 2018, "ipc": 2.43 }, { "ano": 2017, "ipc": 2.19 }, { "ano": 2016, "ipc": 3.8 }, { "ano": 2015, "ipc": 4.35 }, { "ano": 2014, "ipc": 4.39 }, { "ano": 2013, "ipc": 1.93 }, { "ano": 2012, "ipc": 3.02 }, { "ano": 2011, "ipc": 3.34 }, { "ano": 2010, "ipc": 1.42 }, { "ano": 2009, "ipc": 0.45 }, { "ano": 2008, "ipc": 8.71 }, { "ano": 2007, "ipc": 4.39 }, { "ano": 2006, "ipc": 3.4 }, { "ano": 2005, "ipc": 3.05 }, { "ano": 2004, "ipc": 1.06 }, { "ano": 2003, "ipc": 2.82 }, { "ano": 2002, "ipc": 2.49 }, { "ano": 2001, "ipc": 3.57 }, { "ano": 2000, "ipc": 3.84 }, { "ano": 1999, "ipc": 3.34 }, { "ano": 1998, "ipc": 5.12 }, { "ano": 1997, "ipc": 6.14 }, { "ano": 1996, "ipc": 7.38 }, { "ano": 1995, "ipc": 8.23 }, { "ano": 1994, "ipc": 11.52 }, { "ano": 1993, "ipc": 12.73 }, { "ano": 1992, "ipc": 15.54 }, { "ano": 1991, "ipc": 21.98 }, { "ano": 1990, "ipc": 25.91 }];

/**
 *  Retrieves the Unidad de Fomento value from mindicador.cl REST API for the given specific date dd-mm-yyyy
 * @param {String} date 
 * @returns 
 */
function getUF(date) {
    let fecha = new Date(date);
    let day = fecha.getDate();
    let month = fecha.getMonth();
    let year = fecha.getFullYear();
    return new Promise((resolve, reject) => {
        let route = URL_MI_INDICADOR
            .replace('{indicador}', 'uf')
            .replace('{fecha}', `${day}-${month + 1}-${year}`)
        http.get(route)
            .then(response => {
                if (response.data.version !== null) {
                    let serie = response.data.serie;
                    let sum = 0;
                    serie.forEach(element => {
                        sum = sum + element.valor;
                    });
                    resolve(sum);
                } else {
                    reject(err);
                }
            }).catch(err => {
                reject(err);
            });
    })
}

/**
 *  Calculates the Average Inflation rate and periods since a past year to today's year
 * @param {Number} pastDate Past  date (year YYYY
 * @returns 
 */
function getAverageInflationSince(pastDate) {
    let today = new Date().getFullYear();
    let ipcs = [];
    for (let i = pastDate + 1; i <= today; i++) {
        const element = i;
        let ipc = ipc_anuales_1990_2021.find(ind => { return ind.ano === element });
        ipcs.push(ipc);
    }
    let sum = 0;
    ipcs.forEach(i => {
        sum = sum + i.ipc
    })
    return {
        periods: ipcs.length,
        rate: sum / ipcs.length
    };
}


/**
 *  Calculates the present value of a value registered on the past using a fixed table of annual inflation(IPC) indicator from Chile.
 * @param {string} value Value in the past
 * @param {Number} pastDate Past  date (year YYYY)
 */
function getPresentValue(value, pastDate) {
    let past = new Date(pastDate);
    let inflation = getAverageInflationSince(past.getFullYear());
    let decimalInflation = inflation.rate / 100
    return value * ((1 + decimalInflation) ** inflation.periods);
}

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
        let ammount = null;
        if (_.has(stareDocument, 'body') && stareDocument.body !== null && stareDocument.body.length !== null) {
            if (_.has(stareDocument.body, 'montoPrimeraDm') && stareDocument.body.montoPrimeraDm !== null) {
                ammount = {
                    otorgado: {
                        primera: stareDocument.body.montoPrimeraDm,
                        primeraPresente: Math.trunc(
                            getPresentValue(
                                parseInt(stareDocument.body.montoPrimeraDm),
                                stareDocument.body.fechaDicSentenciaPrimera
                            )
                        ).toString()

                    }
                }



                if (_.has(stareDocument.body, 'montoDemandadoDm') && stareDocument.body.montoDemandadoDm !== null) {
                    ammount.demandado = {
                        demandado: stareDocument.body.montoDemandadoDm,
                        demandadoPresente: Math.trunc(
                            getPresentValue(
                                parseInt(stareDocument.body.montoDemandadoDm),
                                stareDocument.body.fechaIngresoPimera
                            )
                        ).toString()
                    };


                }
            }
        } else {
            reject("Document does not have 'body' property");
        }

        

        getUF(stareDocument.body.fechaDicSentenciaPrimera).then(response => {
            _.extend(ammount.otorgado, {
                primeraUF: (parseInt(stareDocument.body.montoPrimeraDm) / response ).toFixed(2).toString()
            })
            getUF(new Date()).then(response => {
                _.extend(ammount.otorgado, {
                    primeraPresenteUF: (parseInt(ammount.otorgado.primeraPresente) / response).toFixed(2).toString()
                });
                getUF(stareDocument.body.fechaIngresoPimera).then(response => {
                    _.extend(ammount.demandado, {
                        demandadoUF:( parseInt(stareDocument.body.montoDemandadoDm) / response).toFixed(2).toString()
                    });
                    getUF(new Date()).then(response => {
                        _.extend(ammount.demandado, {
                            demandadoPresenteUF: ( parseInt(ammount.demandado.demandadoPresente) / response).toFixed(2).toString()
                        })
                        // console.log(ammount);
                        resolve({
                            name: 'lawsuit-ammount',
                            index: opts.index,
                            value: ammount
                        });
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })

       

        

        // resolve({
        //     name: 'lawsuit-ammount',
        //     index: opts.index,
        //     value: ammount
        // });
    })
}

module.exports = exports = calculate;