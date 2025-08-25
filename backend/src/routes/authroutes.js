const express=require('express')
const {signin,resetpassword,forgetpassword,resendotp,verify_otp,
       authchecking
}=require('../controllers/authcontroller')
const router=express.Router()

router.post('/signin',signin)
router.post('/forgetpassword',forgetpassword)
router.post('/resendotp',resendotp)
router.put('/verify-otp',verify_otp)
router.put('/reset',resetpassword)
router.get('/authcheck',authchecking)


   
module.exports=router  