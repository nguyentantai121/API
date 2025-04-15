const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const sinhvienmd = new Schema({
    id: { type: ObjectId },
    ten: {
        type: String,
        required: true,
        trim: true,
    },
    masv: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 8,
        unique: true
    },
    diemtb: {
        type: Number,
        required: true,
    },
    bomon: {
        type: String,
        required: true,
    },
    tuoi: {
        type: Number,
        required: true,

    },
    

},{versionKey:false});
module.exports = mongoose.models.sinhvienmd || mongoose.model('sinhvienmd',sinhvienmd);
