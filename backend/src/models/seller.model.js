const mongoose=require('mongoose')

const sellerSchema=new mongoose.Schema({
   name: {
    type: String,
    required: false,
  },
  email: { // required only if seller can log in separately
    type: String,
    required: true,
    unique: true,
  },
  password: { // optional if login is not needed
    type: String,
  },
  businessName: {
    type: String,
    required: false,
  },
  businessType:{
    type:String
  },
  phone:{
    type:String
  },
  logo: {
    type: String,
  },
  bankDetails: {  
    accountHolderName: String,
    accountNumber: String,
    bankName:String,
    ifscCode: String,    
    branch:String
  },
  address:{  
    street:String,
    city:String,
    district:String,
    state:String,
    country:String,
    pin:String

  },
  otp:{
    type:String
  },
  otpExpire:{   
    type:String
  },
  status: {
    type: String,
    enum: ['pre-registration','pending', 'approved', 'rejected','suspend'],
    default: 'pre-registration',
  },   
  isVerified: { type: Boolean, default: false }

},{
    timestamps:true  
})
module.exports=mongoose.model('seller',sellerSchema)