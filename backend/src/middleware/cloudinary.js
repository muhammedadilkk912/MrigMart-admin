const cloudinary = require('cloudinary').v2;
const streamifier=require('streamifier')
const uploadClodinary = (fileEntries, foldername,filename) => {
  const uploadPromises = fileEntries.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: foldername,
          public_id: filename, // custom per image
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });   
  });

  return Promise.all(uploadPromises);
};

module.exports = uploadClodinary;
