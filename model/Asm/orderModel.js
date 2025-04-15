const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId
const orderModel = new Schema({
    id: { type: ObjectId },
    total_amount: {
        type: Number,
        default: 0
    },
    order_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'cancelled'],
        default: 'processing'
    },
    user: {
        type: ObjectId,
        ref: 'user',
        required: true
    },
    payment: {
        type: ObjectId,
        ref: 'payment'
    },

    
});
module.exports = mongoose.models.orderModel || mongoose.model('order', orderModel);