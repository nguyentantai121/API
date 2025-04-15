const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const categoriModel = new Schema({
    id:{type:ObjectId},
    name:{type:String, required:true, trim: true},

});
module.exports = mongoose.models.categoriModel|| mongoose.model('categoriasm', categoriModel);