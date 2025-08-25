const jwt=require('jsonwebtoken')

const protectroute=(req,res,next)=>{
    console.log('inside the protect route')
    const token = req.cookies.admin_token;
    if(!token){
        return res.status(401).json({message:"unauthorized user"})

    }
    console.log(token)
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded);
        req.user=decoded
        console.log("next",req.user)
        next()
         
    } catch (error) {
        console.log("protect route error",error);

        return res.status(401).json({ message: "Invalid token" });
  
         
    }
}
module.exports=protectroute