const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId= Schema.ObjectId
const paymentModel = new Schema({
    paymentId: { type: ObjectId },
    name: { type: String },
});
module.exports = mongoose.models.paymentModel||mongoose.model('payment', paymentModel);