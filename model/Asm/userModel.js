const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
// dinh nghia schame cho usermodel
const userModel = new Schema({
    id:{type: ObjectId},
    userName:{
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase : true,// chuyen email thanh chu thuong
       // match :[/.+\@.+\..+/, 'Vui long nhap email hop le'],            
    },
    password:{
        type:String,
        required:true,
        minlength :6,
    },
    phone_number:{
        type:String,
        required:true,


    },
});
// dinh nghia model cho user
module.exports = mongoose.models.userModel || mongoose.model('user',userModel);