const generateRandomFourDigit=require('../middleware/otpgenerator')
const sendMail=require('../utils/nodemailer')
const usermodel=require('../models/user')
const jwt=require('jsonwebtoken')
const bcrypt =require('bcrypt')
const signin=async(req,res)=>{
    console.log("inside the sign in");
    
     console.log(req.body);
     const {email,password}=req.body
   
    
    if(!email.trim()){
       return  res.status(400).json({mesage:"email is required"})
    }
    if(!password.trim()){
       return res.status(400).json({mesage:"password is required"})
    }
    try {
        const user=await usermodel.findOne({email})
       
       
        if(!user){
            return res.status(400).json({message:"invalid user"})
        }
         if(user.role !== 'admin'){
            return res.status(400).json({message:'no account availble'})

        }

        const isMatch=await bcrypt.compare(password,user.password)
        console.log("passord checking",isMatch)
        if(!isMatch){
                        return res.status(400).json({message:"invalid password"})


        }
        console.log("user data=",user)

       
        // if(password !== user.password){
           
            
        //     return res.status(400).json({message:"invalid password"})


        // }
        console.log("role=",user.role,"-",user._id)
        const token=jwt.sign({ id:user._id,role:user.role }, process.env.JWT_SECRET, {
            expiresIn: "5h",
        });
        //send data to the fronted
        const userdata={
            name:user.username,
            id:user._id,
            email:user.email,
            isVerified:user.isVerified,
            role:user.role,
            profile:user.profile


        }
       
        // Set the JWT in a cookie  
        res.cookie("admin_token", token, {
            httpOnly: true,
             secure:process.env.NODE_ENV === 'production' , 
             sameSite:process.env.NODE_ENV === 'production' ? 'none' :'',    //process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
            maxAge: 5 * 60 * 60 * 1000 // 5 hour
        });
        return  res.status(200).json({message:"login successfull",userdata})
    } catch (error) {
        console.log("sign in error=",error);
        res.status(500).json({message:"internal server error"})
        
        
    }
}
const forgetpassword=async (req,res)=>{
    try { 
        const {email}=req.body
        const user=await usermodel.findOne({email})
        if(!user){
            return res.status(400).json({ message: "it is not an registered email" });
        }
        let otp=generateRandomFourDigit(9000)
        console.log(otp)
        let otpExpires
        if(otp){
             otpExpires = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes
            console.log("time-",otpExpires);

        }
        
        user.otp=otp,
        user.otpExpires=otpExpires
         await user.save(); 
        
         await sendMail(email,"verification for reset password",`verification OTP ${otp}<`)
        res.status(201).json({message:"reset otp  sent to your email",email:user.email})    


        
    } catch (error) {
        console.log("forgot password error",error);
        res.status(500).json({message:"internal sever error"})
        
        
    }
}
const resendotp=async(req,res)=>{
    console.log("inside the resend otp");
    
     const {Email}=req.body
         console.log("resent otp=",req.body)

     const user=await usermodel.findOne({email:Email})
        if(!user){
            return res.status(400).json({ message: "it is not an registered email" });
        }

        try {
             let otp=generateRandomFourDigit(9000)
        console.log(otp)
        let otpExpires
        if(otp){
             otpExpires = new Date(Date.now() + 5 * 60000); // OTP expires in 5 minutes
            console.log("time-",otpExpires);

        }
        
        user.otp=otp,
        user.otpExpires=otpExpires
        await user.save(); 
        
         await sendMail(Email,"verification for reset password",`verification OTP <b>${otp}</b>`)
        res.status(201).json({message:" otp  sent to your email",email:user.email})    

            
        } catch (error) {
            res.status(500).json({message:"internal server error"})
            
        }

}
const verify_otp=async(req,res)=>{
     console.log("the otp",req.body);
    
    try {
         const{otp,email}=req.body
         if(!otp || !email){
            return   res.status(400).json({message:"otp and email are required"})
         }
     const user=await usermodel.findOne({email})
    if(!user){
        return  res.status(400).json({message:"invalid  user"})
    }
    if(new Date() > user.otpExpires){
        return res.status(400).json({ message: "Invalid or expired OTP" });


      }
      console.log(user.otp)
    if ( user.otp !== otp ) {
        return res.status(400).json({ message: "Invalid  OTP" });

      }
      
        user.isVerified=true;
        user.otp=null;
        user.otpExpires=null
        await user.save();
      res.status(200).json({ message: "OTP verification  completed!" });
        
    } catch (error) {
        console.log("verify the otp error",error);
        res.status(500).json({message:"internal server error"})
        
        
    }
    

   

}
const resetpassword=async (req,res)=>{
    try {
     
        const {email,data}=req.body
        
        
        if(!email){
            return res.status(400).json({message:"email is required"})
        }
       
        if (!data.password?.trim() || !data.confirmpassword?.trim()) {
            
            return res.status(400).json({ message: "Password is required" });
        }
        if(data.password != data.confirmpassword){
            return res.status(400).json({message:"password do not match"})
        }
        
        const user=await usermodel.findOne({email })
        // console.log("reached time",user.otpExpires);

        if (!user) {
            return res.status(400).json({ message: "invalid user" });
          }
    
          user.password=data.password,
         
          await user.save()
          res.status(200).json({message:"password updated successfully",user})
        
    } catch (error) {
        console.log("the reset password error",error);
        res.status(300).json({message:"internal error"})
        
        
    }
}

const authchecking=(req,res)=>{

    const token=req.cookies.admin_token
    console.log('token=',token)    
    if(!token){  
        console.log("insid e the token")
        return res.status(400).json({message:"expire the token or unauthorized"})
    }
    res.status(200).json({message:"authentication successfull"})



}

module.exports={signin,authchecking,resendotp,resetpassword,forgetpassword,verify_otp}