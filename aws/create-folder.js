const s3 = require('./s3');

module.exports.createFolder = (dirName) => {
  dirName = dirName.trim();

  var dirKey = encodeURIComponent(dirName) + '/';
  s3.headObject({ Key: dirKey }, function (err, data) {
    if (!err) {
      return Error('Folder already exists.');
    }
    if (err.code !== 'NotFound') {
      return Error('There was an error creating your folder: ' + err.message);
    }
    s3.putObject({ Key: dirKey }, function (err, data) {
      if (err) {
        return Error('There was an error creating your folder: ' + err.message);
      }
      console.log('Successfully created folder.');
    });
  });
}
