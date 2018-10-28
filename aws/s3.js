const AWS = require('aws-sdk');
require('dotenv').load();
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  region: 'us-east-1',
  params: {
    Bucket: process.env.BUCKET_NAME
  }
});

module.exports = s3;
