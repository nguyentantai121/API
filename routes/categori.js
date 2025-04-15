var express = require('express');
var router = express.Router();
var categori2 = require('../model/categori');

// lay danh sach
router.get('/list',async function(req, res) {
    //bat dong bo
    var list = await categori2.find(); // find la ham tra ve tat ca du lieu lien quan toi categori
    res.status(200).json({status:true, message: "thanh cong",list : list});
});
// lay thong tin theo danh ten
router.get ('/search',async function(req, res) {
     const {name} = req.query;
     var list =await categori2.find({name :name});
     res.status(200).json({status: true, message: "thanh cong", list : list});
});


module.exports = router;
// findone la ham tra ve mot phan tu lien quan