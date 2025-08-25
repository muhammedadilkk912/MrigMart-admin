const mongoose=require('mongoose')



const categorySchema=new mongoose.Schema({
    category:{
        type:String,
        required:true,
        unique:true
    },
    
    specific_fields:[{
        name:{type:String,required:true},
        placeholder:{type:String,required:true},
        type:{
            type:String,
            required:true
        },
        Options:{type:[String],default:[]}

    }]
})

module.exports = mongoose.model('Category', categorySchema);
