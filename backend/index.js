const express=require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const cookieParser = require("cookie-parser");
const adminroutes=require('./src/routes/adminroutes')
const authroutes=require('./src/routes/authroutes')
const mongodb=require('./src/config/db')
const Cloudinary=require('./src/config/Cloudinaryconfig')

const app=express()
app.use(cors({  
    origin: process.env.Base_Origin,
    credentials: true // ✅ Important for cookies/sessions
}));

dotenv.config()
mongodb()
app.use(express.json({limit:'5mb'}))  
app.use(cookieParser());
  

       

app.use('/api/auth',authroutes)
app.use('/api/admin',adminroutes)

 
const port=process.env.port || 999
app.listen(port,()=>{
    console.log(`server running at ${port}`);
      

})

    