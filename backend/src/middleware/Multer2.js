const multer=require('multer')

const storage=multer.memoryStorage()
const upload2=multer({storage})
console.log("multer",upload2)

module.exports=upload2