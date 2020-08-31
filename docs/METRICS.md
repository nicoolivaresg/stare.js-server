# Feature extractor / Metrics extensions

## Currently supported Feature extractor / Metrics extensions

All the metrics functions resolve a Promise object with the follow properties:

```js
{
    // { String }
    name: '<metric name, normally the same as the filename>',
    // { Number }
    index: opts.index,
    // { Number | String | Object }
    value: <your_calculated_value>
}
```

<a name="language"></a>
### Language

The value returned is the name of the language of the document in english.

```js
{
    name: 'language',
    index: opts.index,
    value: ['english' | 'spanish' | 'italian' | 'french' | ...]
}
```

<a name="length"></a>
### Length

The value returned is the number of characters in the document.

```js
{
    name: 'length',
    index: opts.index,
    value: 12345
}
```

<a name="perspicuity"></a>
### Perspicuity

The value returned is the perspicuity or easy to read the document.

```js
{
    name: 'perspicuity',
    index: opts.index,
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
    index: opts.index,
    value: [1|2|3|4...]
}
```

<a name="keywords-position"></a>
### Keywords Position

The value returned is an <code>Object</code> with the keywords as keys and an <code>Array</code> of <code>Number</code> with the positions of said keywords.

```js
{
    name: 'keywords-position',
    index: opts.index,
    value: {
        'keyword-1': [111, 270, 274],
        'keyword-2': [23]
    }
}
```

<a name="links"></a>
### Links

The value returned is an <code>Array</code> of <code>String</code> with all of the Hosts (Domain and Subdomains) of the URLs found in the body text of the document.

```js
{
    name: 'links',
    index: opts.index,
    value: [
        'https://www.google.com',
        'https://www.usach.cl',
        'https://diinf.usach.cl',
        //...
    ]
}
```

<a name="multimedia"></a>
### Multimedia

The value returned is and <code>Object</code> with the frecuency as value for the keys of <code>audio</code>, <code>video</code> and <code>img</code>.

```js
{
    name: 'multimedia',
    index: opts.index,
    value: {
        'audio': 1,
        'video': 2,
        'img': 7
    }
}
```

<a name="create-your-own-extensions"></a>
## Create your own extensions

To create your own extensions just use the boilerplate in this same folder, file called [metric.js](./metric.js) and complete it as you see it fit, but you must follow the export function signature.

---
Powered by [jsdoc](https://jsdoc.app/)