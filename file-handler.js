'use strict';

const multiparty = require('multiparty');
const {join, extname} = require('path');
const {readFileSync} = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY,
});

/**
 * Helper method which takes the request object and returns a promise with a file.
 */
module.exports.getFileFromRequest = (req) => new Promise((resolve, reject) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) reject(err);
    const file = files['file'][0]; // get the file from the returned files object
    if (!file) reject('File was not found in form data.');
    else resolve(file);
  });
});

/**
 * Helper method which takes the request object and returns a promise with the AWS S3 object details.
 */
module.exports.uploadFileToS3 = (file, options = {}) => {
  // turn the file into a buffer for uploading
  const buffer = readFileSync(file.path);
  // generate a new random file name
  const fileName = options.name || String(Date.now());
  // the extension of your file
  const extension = extname(file.path);
  // return a promise
  return new Promise((resolve, reject) => {
    return s3.upload({
      Bucket: 'mynicebucket',
      ACL: 'public-read',
      Key: join('example/file/path', `${fileName}${extension}`),
      Body: buffer,
    }, (err, result) => {
      if (err) reject(err);
      else resolve(result); // return the values of the successful AWS S3 request
    });
  });
};
