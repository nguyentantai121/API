const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId= Schema.ObjectId;
const productsModel = new Schema({
    id: { type: ObjectId},
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: ObjectId, ref: 'categoriasm' },
  
});
module.exports = mongoose.models.productsModel|| mongoose.model('productasm', productsModel);