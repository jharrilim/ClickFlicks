const { join, extname } = require('path');
const { readFileSync } = require('fs');
const s3 = require('./s3');

/**
 * Helper method which takes the request object and returns a promise with the AWS S3 object details.
 */
module.exports.uploadFileToS3 = (file, options = {}) => {
  // turn the file into a buffer for uploading
  const buffer = readFileSync(file.path);
  // generate a new random file name
  const fileName = options.name || file.name || String(Date.now());
  // the extension of your file
  const extension = extname(file.path);
  // return a promise
  return new Promise((resolve, reject) => {
    return s3.upload({
      ACL: 'public-read',
      Key: `${fileName}${extension}`,
      Body: buffer,
    }, (err, result) => {
      if (err) reject(err);
      else resolve(result); // return the values of the successful AWS S3 request
    });
  });
};
