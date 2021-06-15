/**
 * Defines how far the lawsuit reach on courts from the stare-format document based
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
        let reach = null;

        if (_.has(stareDocument, 'body') && stareDocument.body !== null && stareDocument.body.length !== null) {
            if (_.has(stareDocument.body, 'montoPrimeraDm') && stareDocument.body.montoPrimeraDm !== null) {
                reach = {
                    otorgado: {
                        primera: stareDocument.body.montoPrimeraDm
                    }
                }
                if (_.has(stareDocument.body, 'montoDemandadoDm') && stareDocument.body.montoDemandadoDm !== null) {
                    reach.demandado = stareDocument.body.montoDemandadoDm;
                }
            }
        }else{
            reject("Document does not have 'body' property");
        }

        resolve({
            name: 'reach',
            index: opts.index,
            value: reach
        });
    })
}