import mongoose from "mongoose";
import user from "./user.js";

const addressSchema=new mongoose.Schema({
    user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  unique: true,
},

    street:{
        type:String
    },
    city:{
        type:String
    },
    district:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    },
    pin:{
        type:String
    }
})
export default mongoose.models.Address || mongoose.model('Address',addressSchema)  