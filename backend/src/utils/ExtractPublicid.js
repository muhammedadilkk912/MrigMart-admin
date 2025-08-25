function getPublicIdFromUrl(url) {
  const parts = url.split('/');
  const file = parts.pop(); // e.g., abc123.png
  const folder = parts.slice(-1)[0]; // last folder (optional)
  const [publicId] = file.split('.'); // remove extension
  return `${folder}/${publicId}`;
}
module.exports=getPublicIdFromUrl