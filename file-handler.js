'use strict';

const multiparty = require('multiparty');

/**
 * Helper method which takes the request object and returns a promise with a file.
 */
module.exports.getFileFromRequest = (req) => new Promise((resolve, reject) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) reject(err);
    const file = files['movie'][0]; // get the file from the returned files object
    if (!file) reject('File was not found in form data.');
    else resolve(file);
  });
});
