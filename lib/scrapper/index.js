'use strict';

const fs = require('fs');
const rp = require('request-promise');

const html = require('./html-cleaner.js');

var documentCounter = 1;

function html(stareDocument) {

  let url = (typeof stareDocument === 'string') ? stareDocument : stareDocument.link;
  
  let id = ++documentCounter; // some unique stuff.

  return new Promise((resolve, reject) => {
    output = `${output}/docs/html/${id}.txt`;
    
    rp(url)
      .then((data) => {
        let text = data.toString();
        fs.writeFile(output, text, (err) => {
          if (err) {
            reject(err);
          }
          resolve(id)
        });
      }).catch((err) => {
        reject(err);
      });
  });
};

function text(html) {
  let id = null;

  if (typeof stareDocument === 'number') {
    id = stareDocument;
  } else if (typeof stareDocument === 'string') {
    if (isValidURL(stareDocument)) {
      id = await get_HTML(stareDocument, output);
    } else {
      id = ++documentCounter;
    }
  } else if (typeof stareDocument === 'object') {
    id = await get_HTML(stareDocument, output);
  } else {
    throw new Error(`Invalid datatype for 'stareDocument'.`);
  }

  return new Promise((resolve, reject) => {
    output = `${output}/docs/html/${id}.txt`;
    
    fs.readFile(output, (err, data) => {
      if (err) {
        throw err;
      }

      html.promesaLimpiarArchivo(data.toString()).then((doc) => {
        output = `${output}/docs/text/${id}.txt`;
        fs.writeFile (output, doc, (err) => {
          if (err) throw err;
          resolve(id);
        });
      });
    });
  });
};


module.exports = {
  html,
  text
};
