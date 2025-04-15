var express = require('express');
var router = express.Router();
var sinhvienmd = require('../model/sinhvienmd');
var upload = require('../util/upload');
var sendMail = require('../util/email');
const fs = require("fs").promises;
const path = require("path");
const JwT = require('jsonwebtoken');
const config = require('../util/config');


// login
router.post('/login',async (req,res)=>{
    try {
        const {ten,mssv}=req.body;
        const User = await sinhvienmd.findOne({ten:ten,mssv:mssv});
        if(!User){
            return res.status(400).json({message:'Sai thông tin'}); 
            }else{
                const token = JWT.sign({id:User._id},config.SECRETKEY,{expiresIn:"30s"});
                const refreshToken = JWT.sign({id:User._id},config.SECRETKEY,{expiresIn:"1d "});
                res.status (200).json({message:'Đăng nhập thành công', token: token,refreshToken:refreshToken});
            }
    } catch (error) {
        
    }
})

// Lấy toàn bộ danh sách sinh viên
router.get('/listthemall', async function (req, res) {
    var list = await sinhvienmd.find();
    res.status(200).json({ status: true, message: "thanh cong", list });
});

// Lấy sinh viên thuộc bộ môn CNTT
router.get('/listcntt', async function (req, res) {
    var list = await sinhvienmd.find({ bomon: "CNTT" });
    res.status(200).json({ status: true, message: "thanh cong", list });
});

// Lấy danh sách sinh viên có điểm trung bình từ 6.5 đến 8.5
router.get('/listdtb', async function (req, res) {
    var list = await sinhvienmd.find(
        {
            diemtb: { $gte: 6.5, $lte: 8.5 }
        });
    res.status(200).json({ status: true, message: "thanh cong", list });
});

// Tìm sinh viên theo mã số sinh viên (MSSV)
router.get('/findmasv/:masv', async function (req, res) {
    var sinhvien = await sinhvienmd.findOne(
        { masv: req.params.masv });
    res.status(200).json({ status: true, message: "thanh cong", sinhvien });
});

// Thêm mới sinh viên
router.post('/add', async function (req, res) {
    var newsinhvien = new sinhvienmd(req.body);
    await newsinhvien.save();
    res.status(200).json({ status: true, message: "them thanh cong", sinhvien: newsinhvien });
});

// Cập nhật thông tin sinh viên theo MSSV
router.put('/update/:masv', async function (req, res) {
    const { ten, bomon, diemtb, tuoi } = req.body;

    var update = await sinhvienmd.findOneAndUpdate(
        { masv: req.params.masv },
        {
            ten: ten || undefined,
            bomon: bomon || undefined,
            diemtb: diemtb || undefined,
            tuoi: tuoi || undefined
        },
        { new: true });
    res.status(200).json({ status: true, message: "cap nhat thanh cong", sinhvien: update });
});

// Xóa sinh viên theo MSSV
router.delete('/delete/:masv', async function (req, res) {
    var xoa = await sinhvienmd.findOneAndDelete(
        { masv: req.params.masv });
    if (!xoa) {
        return res.status(400).json({ status: false, message: "Không tìm thấy sinh viên" });
    }
    res.status(200).json({ status: true, message: "xoa thanh cong", sinhvien: xoa });
});

// Lấy danh sách sinh viên thuộc bộ môn CNTT và có điểm trung bình trên 9.0
router.get('/bm9', async function (req, res) {
    var list = await sinhvienmd.find(
        { bomon: "CNTT", diemtb: { $gte: 9.0 } });
    res.status(200).json({ status: true, message: "thanh cong", list });
});

// Lọc sinh viên theo độ tuổi từ 18-23 thuộc CNTT và điểm trung bình >= 6.5
router.get('/loc', async function (req, res) {
    var list = await sinhvienmd.find({
        bomon: "CNTT",
        diemtb: { $gte: 6.5 },
        tuoi: { $gte: 18, $lte: 23 }
    });
    res.status(200).json({ status: true, message: "thanh cong", list });
});

// Sắp xếp danh sách sinh viên theo điểm trung bình tăng dần
router.get('/sapxep', async function (req, res) {
    var list = await sinhvienmd.find().sort({ diemtb: 1 });
    res.status(200).json({ status: true, message: "thanh cong", list });
});

// Tìm sinh viên có điểm trung bình cao nhất thuộc bộ môn CNTT
router.get('/maxdtb', async function (req, res) {
    var maxdtb = await sinhvienmd.findOne({ bomon: "CNTT" }).sort({ diemtb: -1 });
    res.status(200).json({ status: true, message: "thanh cong", sinhvien: maxdtb });
});

// 🟢 Upload hình ảnh
router.post('/upload', upload.single('hinh'), async (req, res) => {
    try {
        const { file } = req;

        if (!file) {
            return res.json({ status: 0, link: "" });
        } else {
            const url = `localhost:3000/images/${file.filename}`;
            return res.json({ status: 1, url: url });
        }
    } catch (error) {
        console.log('Upload image error: ', error);
        return res.json({ status: 0, link: "" });
    }
});

// gui email
router.post("/email", async function (req, res) {
    try {
        const { to } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);

        const templatePath = path.join(__dirname, "taine.html");
        let htmlContent = await fs.readFile(templatePath, "utf8");

        htmlContent = htmlContent.replace("{{OTP}}", otp);
        const mailOptions = {
            from: "taine<vongprocf@gmail.com>",
            to: to,
            subject: "Mã OTP xác thực tài khoản",
            html: htmlContent
        };
        await sendMail.transporter.sendMail(mailOptions);
        res.json({ status: 1, message: "Gửi OTP thành công", otp });

    } catch (err) {
        console.error("Lỗi gửi OTP:", err);
        res.json({ status: 0, message: "Gửi OTP thất bại" });
    }
});


module.exports = router;

