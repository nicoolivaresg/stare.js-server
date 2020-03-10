# Feature extractor / Metrics extensions

## Currently supported Feature extractor / Metrics extensions

All the metrics functions resolve a Promise object with the follow properties:

```js
{
    // { string }
    name: '<metric name, normally the same as the filename>',
    // { number }
    index: <original document index>,
    // { number | string | object }
    value: <your_calculated_value>
}
```

<a name="language"></a>
### Language

The value returned is the name of the language of the document in english.

```js
{
    name: 'language',
    index: index,
    value: ['english' | 'spanish' | 'italian' | 'french' | ...]
}
```

<a name="length"></a>
### Length

The value returned is the number of characters in the document.

```js
{
    name: 'length',
    index: index,
    value: 12345
}
```

<a name="perspicuity"></a>
### Perspicuity

The value returned is the perspicuity or easy to read the document.

```js
{
    name: 'perspicuity',
    index: index,
    value: 133
}
```
Currently supported languages are <code>english (en-us)</code>, <code>spanish (es)</code> and <code>french (fr)</code>;

<a name="ranking"></a>
### Ranking

The value returned is the number of the ranking of the document in the original SERP.

```js
{
    name: 'ranking',
    index: index,
    value: [1|2|3|4...]
}
```

<a name="create-your-own-extensions"></a>
## Create your own extensions

To create your own extensions just use the boilerplate in this same folder, file called [metric.js](./metric.js) and complete it as you see it fit, but you must follow the export function signature.

---
Powered by [jsdoc](https://jsdoc.app/)