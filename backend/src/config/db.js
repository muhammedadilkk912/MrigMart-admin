const mongoose=require('mongoose');
require('dotenv').config();
const db=process.env.MONGO_URI;
console.log("db=",db);

const connectDb=async()=>{
    try {
        await mongoose.connect(db,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log('mongodb connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
        
        
    }
}
module.exports=connectDb;