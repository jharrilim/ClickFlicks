'use strict';

const { getFileFromRequest } = require('../../file-handler');
const uploadFileToS3 = require('../../aws').uploadFile;
module.exports = function(Movie) {
  Movie.uploadMovie = async (id, req) => {
    // Get the movie instance
    const movie = await Movie.findById(id);

    if (!movie) throw new Error('Movie not found.');

    // extract the file from the request object
    const file = await getFileFromRequest(req);

    // upload the file
    const { Location, ETag, Bucket, Key } = await uploadFileToS3(file);

    // save the data to the movie how ever you want
    await movie.updateAttributes({
      link: Location,
      etag: ETag,
      bucket: Bucket,
      image: Key,
    });

    // return the updated movie instance
    return movie;
  };

  Movie.remoteMethod('uploadMovie', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'req', type: 'object', http: { source: 'req' } }, // pass the request object to remote method
    ],
    returns: { root: true, type: 'object' },
    http: { path: '/:id/upload-movie', verb: 'post' },
  });

};
