var express = require('express');
var router = express.Router();
var sinhvienmd = require('../model/sinhvienmd');
var upload = require('../util/upload');
var sendMail = require('../util/email');
const fs = require("fs").promises;
const path = require("path");
const JWT = require('jsonwebtoken');
const config = require('../util/config');


// login
router.post('/login', async (req, res) => {
    try {
        console.log("Body nhận được:", req.body); // 👈 log này sẽ giúp kiểm tra

        const { ten, masv } = req.body;

        if (!ten || !masv) {
            return res.status(400).json({ message: 'Thiếu thông tin đăng nhập' });
        }

        const User = await sinhvienmd.findOne({ ten: ten, masv: masv });

        if (!User) {
            return res.status(400).json({ message: 'Sai thông tin' });
        }

        const token = JWT.sign({ id: User._id }, config.SECRETKEY, { expiresIn: "30s" });
        const refreshToken = JWT.sign({ id: User._id }, config.SECRETKEY, { expiresIn: "1d" });

        res.status(200).json({ message: 'Đăng nhập thành công', token, refreshToken });

    } catch (error) {
        console.error("Lỗi trong login:", error.message); // 👈 log ra lỗi chi tiết
        res.status(500).json({ message: 'Lỗi hệ thống', error: error.message });
    }
});


// Lấy toàn bộ danh sách sinh viên
router.get('/listthemall', async function (req, res) {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        return res.status(401).json({ status: 401, message: "Thiếu token" });
    }

    const token = authHeader.split(' ')[1];

    JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
            return res.status(403).json({ status: 403, err: err.message });
        }

        const list = await sinhvienmd.find();
        res.status(200).json({ status: true, message: "thành công", list });
    });
});


// Lấy sinh viên thuộc bộ môn CNTT (có kiểm tra token)
router.get('/listcntt', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ status: false, message: "Thiếu token" });
        }

        const token = authHeader.split(' ')[1];

        JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
            if (err) {
                return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });
            }

            const list = await sinhvienmd.find({ bomon: "CNTT" });
            res.status(200).json({ status: true, message: "Thành công", list });
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
});


// Lấy danh sách sinh viên có điểm trung bình từ 6.5 đến 8.5 (có kiểm tra token)
router.get('/listdtb', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ status: false, message: "Thiếu token" });
        }

        const token = authHeader.split(' ')[1];

        JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
            if (err) {
                return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });
            }

            const list = await sinhvienmd.find({
                diemtb: { $gte: 6.5, $lte: 8.5 }
            });
            res.status(200).json({ status: true, message: "Thành công", list });
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
});


// Tìm sinh viên theo mã số sinh viên (có kiểm tra token)
router.get('/findmasv/:masv', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ status: false, message: "Thiếu token" });
        }

        const token = authHeader.split(' ')[1];

        JWT.verify(token, config.SECRETKEY, async function (err, decoded) {
            if (err) {
                return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });
            }

            const sinhvien = await sinhvienmd.findOne({ masv: req.params.masv });
            res.status(200).json({ status: true, message: "Thành công", sinhvien });
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
});


// Thêm mới sinh viên (có kiểm tra token)
router.post('/add', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) return res.status(401).json({ status: false, message: "Thiếu token" });

        const token = authHeader.split(' ')[1];
        JWT.verify(token, config.SECRETKEY, async (err, decoded) => {
            if (err) return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });

            const newsinhvien = new sinhvienmd(req.body);
            await newsinhvien.save();
            res.status(200).json({ status: true, message: "Thêm thành công", sinhvien: newsinhvien });
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
});

// Cập nhật sinh viên theo MSSV (có kiểm tra token)
router.put('/update/:masv', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) return res.status(401).json({ status: false, message: "Thiếu token" });

        const token = authHeader.split(' ')[1];
        JWT.verify(token, config.SECRETKEY, async (err, decoded) => {
            if (err) return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });

            const { ten, bomon, diemtb, tuoi } = req.body;
            const update = await sinhvienmd.findOneAndUpdate(
                { masv: req.params.masv },
                {
                    ten: ten || undefined,
                    bomon: bomon || undefined,
                    diemtb: diemtb || undefined,
                    tuoi: tuoi || undefined
                },
                { new: true }
            );
            res.status(200).json({ status: true, message: "Cập nhật thành công", sinhvien: update });
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
});

// Xóa sinh viên theo MSSV (có kiểm tra token)
router.delete('/delete/:masv', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) return res.status(401).json({ status: false, message: "Thiếu token" });

        const token = authHeader.split(' ')[1];
        JWT.verify(token, config.SECRETKEY, async (err, decoded) => {
            if (err) return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });

            const xoa = await sinhvienmd.findOneAndDelete({ masv: req.params.masv });
            if (!xoa) return res.status(400).json({ status: false, message: "Không tìm thấy sinh viên" });
            res.status(200).json({ status: true, message: "Xoá thành công", sinhvien: xoa });
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
});

// Lấy danh sách sinh viên bộ môn CNTT điểm > 9 (có kiểm tra token)
router.get('/bm9', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) return res.status(401).json({ status: false, message: "Thiếu token" });

        const token = authHeader.split(' ')[1];
        JWT.verify(token, config.SECRETKEY, async (err, decoded) => {
            if (err) return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });

            const list = await sinhvienmd.find({ bomon: "CNTT", diemtb: { $gte: 9.0 } });
            res.status(200).json({ status: true, message: "Thành công", list });
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
});

// Lọc sinh viên CNTT tuổi 18-23 điểm >= 6.5 (có kiểm tra token)
router.get('/loc', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) return res.status(401).json({ status: false, message: "Thiếu token" });

        const token = authHeader.split(' ')[1];
        JWT.verify(token, config.SECRETKEY, async (err, decoded) => {
            if (err) return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });

            const list = await sinhvienmd.find({
                bomon: "CNTT",
                diemtb: { $gte: 6.5 },
                tuoi: { $gte: 18, $lte: 23 }
            });
            res.status(200).json({ status: true, message: "Thành công", list });
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
});

// Sắp xếp danh sách sinh viên theo điểm trung bình tăng dần (có kiểm tra token)
router.get('/sapxep', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) return res.status(401).json({ status: false, message: "Thiếu token" });

        const token = authHeader.split(' ')[1];
        JWT.verify(token, config.SECRETKEY, async (err, decoded) => {
            if (err) return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });

            const list = await sinhvienmd.find().sort({ diemtb: 1 }); // 1 là tăng dần, -1 là giảm dần
            res.status(200).json({ status: true, message: "Thành công", list });
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
});


// Tìm sinh viên có điểm trung bình cao nhất thuộc CNTT (có kiểm tra token)
router.get('/maxdtb', async function (req, res) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) return res.status(401).json({ status: false, message: "Thiếu token" });

        const token = authHeader.split(' ')[1];
        JWT.verify(token, config.SECRETKEY, async (err, decoded) => {
            if (err) return res.status(403).json({ status: false, message: "Token không hợp lệ", error: err.message });

            const maxdtb = await sinhvienmd.findOne({ bomon: "CNTT" }).sort({ diemtb: -1 });
            res.status(200).json({ status: true, message: "Thành công", sinhvien: maxdtb });
        });
    } catch (error) {
        res.status(500).json({ status: false, message: "Lỗi hệ thống", error: error.message });
    }
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

