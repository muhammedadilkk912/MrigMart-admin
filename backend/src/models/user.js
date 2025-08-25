const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
       
    },
    otp: {
        type: String,
        required: false
    },
    otpExpires: {
        type: Date,
        required: false
    },
    googleId:{
        type:String
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    status:{
        type:[String],
        enum:['Active','Suspend'],
        default:['Active']
    },
    role: {
        type: String,
        enum: ['user',  'admin'],
        default: ['user']
    },
    profile:{
        type:String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
