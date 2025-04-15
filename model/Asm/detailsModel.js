const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const detailsmodel = new Schema({
    id: {type : ObjectId},
    order_id:{type: ObjectId,ref:'order',required:true},
    product_id:{type: ObjectId,ref:'productasm',required:true},
    quantity:{type:Number,required:true},
    total_price:{type:Number,required:true}

    
});
module.exports = mongoose.models.detailsmodel||mongoose.model('details', detailsmodel);