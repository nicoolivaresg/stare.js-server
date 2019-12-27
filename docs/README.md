## StArE.js Server documentation.

## das

## Create your own extensions

### SERP

### Metrics


- Each metric on a separate file.
- Must return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and we recommend follow the same 

```js
'use strict';

/* Your requires and extra functions here */

/**
 * Metrics documentation.
 * @param {Object} stareDocument
 * @param {Object} opts
 * @returns {Promise}
 */
function calculate(stareDocument, opts) {
  return new Promise((resolve, reject) => {
    /* Do some stuff */
    resolve({
      name: /* metric name */,
      index: opts.index,
      value: /* final value goes here */
    });
    reject(false);
  })
};

module.exports = exports = calculate;
````