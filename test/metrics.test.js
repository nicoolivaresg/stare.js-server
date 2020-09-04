'use strict';

const _ = require('lodash');

const getMetrics = require('../lib/metrics/');
const language = require('../lib/metrics/language');
const length = require('../lib/metrics/length');
const perspicuity = require('../lib/metrics/perspicuity');
const ranking = require('../lib/metrics/ranking');
const keywordsPosition = require('../lib/metrics/keywords-position');
const multimedia = require('../lib/metrics/multimedia');
const links = require('../lib/metrics/links');

/* Same SERP response for every test */
const stareValidDocument = {
  title: 'StArE.js — Search engine visuAlization packagE - Usach',
  link: 'https://starejs.informatica.usach.cl/',
  body: '',
  snippet: 'StArE.js: An extensible open source toolkit for visualizing search engine results. ... Supervised by González-Ibáñez, R. Departamento de Ingeniería Informática, ...',
  image: null
};

const stareInvalidDocument = {
  title: 'No good title',
  link: 'no-good-url-either',
  body: null,
  snippet: null,
  image: null
};


const opts = {
  searchInfo: {
    totalResults: '1',
    searchTerms: 'Testing query',
    numberOfItems: 1,
    startIndex: 1
  },
  index: 1
};

const serpResponse = {
  totalResults: 1,
  searchTerms: 'Testing query',
  numberOfItems: 1,
  startIndex: 0,
  documents: [
    stareValidDocument
  ]
};

describe(`Feature 'language'`, () => {
  test(`Valid stareDocument object`, () => {
    return language(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'language',
        'index': 1,
        'value': expect.any(String)
      });
    });
  });

  test(`Invalid stareDocument (snippet == '').`, () => {
    return language(stareInvalidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'language',
        'index': 1,
        'value': null
      });
    });
  });
});

describe(`Feature 'length'`, () => {
  test(`Valid stareDocument object`, () => {
    return length(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'length',
        'index': 1,
        'value': expect.any(Number)
      });
      expect(data.value).toBeGreaterThan(-1);
    });
  });

  test(`Feature 'length' with invalid stareDocument object`, () => {
    return length(stareInvalidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'length',
        'index': 1,
        'value': -1
      });
    });
  });
});

describe(`Feature 'perspicuity'`, () => {
  test(`Valid stareDocument 'en-us' object`, () => {
    let englishText = _.assign({}, stareInvalidDocument);
    englishText.body = 'Although the phrase is nonsense, it does have a long history. The phrase has been used for several centuries by typographers to show the most distinctive features of their fonts. It is used because the letters involved and the letter spacing in those combinations reveal, at their best, the weight, design, and other important features of the typeface.';

    return perspicuity(englishText, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'perspicuity',
        'index': 1,
        'value': expect.any(Number)
      });
    });

    expect(data.value).toBeGreaterThanOrEqual(0);
    expect(data.value).toBeLessThanOrEqual(207);
  });

  test(`Valid stareDocument 'fr' object`, () => {
    let frenchText = _.assign({}, stareInvalidDocument);
    frenchText.body = `Bien que la phrase soit absurde, elle a une longue histoire. L'expression a été utilisée pendant plusieurs siècles par les typographes pour montrer les caractéristiques les plus distinctives de leurs polices. Il est utilisé parce que les lettres impliquées et l'espacement des lettres dans ces combinaisons révèlent, au mieux, le poids, le design et d'autres caractéristiques importantes de la police.`;

    return perspicuity(frenchText, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'perspicuity',
        'index': 1,
        'value': expect.any(Number)
      });
    });

    expect(data.value).toBeGreaterThanOrEqual(0);
    expect(data.value).toBeLessThanOrEqual(207);
  });

  test(`Valid stareDocument 'es' object`, () => {
    let spanishText = _.assign({}, stareInvalidDocument);
    spanishText.body = `Aunque la frase es una tontería, tiene una larga historia. La frase ha sido utilizada durante varios siglos por tipógrafos para mostrar las características más distintivas de sus fuentes. Se utiliza porque las letras involucradas y el espaciado entre letras en esas combinaciones revelan, en el mejor de los casos, el peso, el diseño y otras características importantes del tipo de letra.`;

    return perspicuity(spanishText, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'perspicuity',
        'index': 1,
        'value': expect.any(Number)
      });
    });

    expect(data.value).toBeGreaterThanOrEqual(0);
    expect(data.value).toBeLessThanOrEqual(207);
  });

  test(`Invalid stareDocument object`, () => {
    let latinText = _.assign({}, stareInvalidDocument);
    latinText.body = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    return perspicuity(latinText, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'perspicuity',
        'index': 1,
        'value': expect.any(Object)
      });
    });
  });
});

describe(`Feature 'ranking'`, () => {
  test(`Feature 'ranking' with valid stareDocument object`, () => {
    return ranking(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'ranking',
        'index': 1,
        'value': 2
      });
    });
  });
});

describe(`Feature 'keywords-position'`, () => {
  test(`Valid stareDocument object`, () => {
    let englishText = _.assign({}, stareInvalidDocument);
    englishText.body = 'Although the phrase is nonsense, it does have a long history. The phrase has been used for several centuries by typographers to show the most distinctive features of their fonts. It is used because the letters involved and the letter spacing in those combinations reveal, at their best, the weight, design, and other important features of the typeface.';
    
    let options = _.assign({}, opts);
    options.searchInfo.searchTerms = 'phrase';
    
    return keywordsPosition(englishText, options).then(data => {
      expect(data).toMatchObject({
        'name': 'keywords-position',
        'index': 1,
        'value': expect.any(Object)
      });
    });
  });

  test(`Invalid stareDocument.`, () => {
    return keywordsPosition(stareInvalidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'keywords-position',
        'index': 1,
        'value': -1
      });
    });
  });
});

describe(`Feature 'multimedia'`, () => {
  test(`Valid stareDocument object`, () => {
    return multimedia(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'multimedia',
        'index': 1,
        'value': expect.any(Object)
      });

      expect(data.value.video).toBeGreaterThanOrEqual(0);
      expect(data.value.img).toBeGreaterThanOrEqual(0);
      expect(data.value.audio).toBeGreaterThanOrEqual(0);
    });
  });

  test(`Invalid stareDocument.`, () => {
    return multimedia(stareInvalidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'multimedia',
        'index': 1,
        'value': -1
      });
    });
  });
});

describe(`Feature 'links'`, () => {
  test(`Valid stareDocument object`, () => {
    return links(stareValidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'links',
        'index': 1,
        'value': expect.any(Array)
      });
    });
  });

  test(`Invalid stareDocument.`, () => {
    return links(stareInvalidDocument, opts).then(data => {
      expect(data).toMatchObject({
        'name': 'links',
        'index': 1,
        'value': -1
      });
    });
  });
});

describe(`Function 'getMetrics'`, () => {
  test('Without stareDocument and empty metrics array', () => {
    return getMetrics({}, []).then(data => {
      expect(data).toEqual([]);
    })
  });

  test('Without stareDocument.', () => {
    return getMetrics({}, ['language', 'length', 'perspicuity', 'ranking']).then(data => {
      expect(data.length).toEqual(0);
    })
  });

  test('Personal metric.', () => {
    global.stareOptions.personalMetrics = {
      voidFunction: (stareDocument, opts) => ({}),
      notAFunction: null
    };
    return getMetrics(serpResponse, ['voidFunction', 'notAFunction']).then(data => {
      expect(data.length).toEqual(0);
    })
  });

  test('Get ranking metric from document.', () => {
    return getMetrics(serpResponse, ['ranking']).then(data => {
      expect(data.length).toEqual(1);
      expect(data[0].value).toEqual(0);
    })
  });
});