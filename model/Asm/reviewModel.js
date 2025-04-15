const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const reviewModel = new Schema({
    id: {type: ObjectId},
    product_id:{type:ObjectId,ref:'productasm'},
    user_id:{type:ObjectId,ref:'user'},
    rating:{type:Number},
    comment: {type:String},
    review_date: {type:Date,default:Date.now}
});
module.exports = mongoose.models.reviewModel|| mongoose.model('review',reviewModel);