const mongoose=require('mongoose')
const seller =require('./seller.model')
const admin=require('./user')


const bannerSchema=new mongoose.Schema({
    image:{
        type:String
    },
    link:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    },
    addedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'addedbymodel',
        required:true

    },
    addedbymodel:{
        type:String,
        required:true,
        enum:['seller','admin']
    },
    status:{
        type:String,
        enum:['Active','Inactive','Pending','Reject'],
        default:'Pending'
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Banner',bannerSchema)