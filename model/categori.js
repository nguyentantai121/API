const mongoose = require('mongoose');
const Schema = mongoose.Schema;// collections trong mongoDB
const ObjectId = Schema.ObjectId;// tao ra ojectID trong mongoDB
const categori = new Schema({
    id: { type: ObjectId }, // khóa chính
    name: {
        type: String, // kiểu dữ liệu
        required: true, // bắt buộc phải có
        // unique: true, // không được trùng
        // trim: true, // bỏ khoảng trắng 2 đầu
        // minlength: 3, // độ dài tối thiểu
        // maxlength: 50, // độ dài tối đa
        // default: 'No name' // giá trị mặc định
    },
    // price:{type: Number, required: true},
    // quantity :{type: Number, required: true},
    // categori: {type:ObjectId,ref :'categori'},
});
module.exports = mongoose.models.categori || mongoose.model('categori1', categori);
// categori -----> categories
