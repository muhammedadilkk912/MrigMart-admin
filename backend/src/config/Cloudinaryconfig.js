const cloudinary = require('cloudinary').v2;
require('dotenv').config()

// console.log("inside the cloudinary",process.env.CLOUD_NAME)

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,    
  api_secret: process.env.CLOUD_API_SECRET,
});
// console.log("Cloudinary config:", {
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET ? '***' : undefined // Hide secret in logs
// });
module.exports = cloudinary;
    