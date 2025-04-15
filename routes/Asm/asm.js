var express = require('express');
var router = express.Router();
var user = require('../../model/Asm/userModel');
var order = require('../../model/Asm/orderModel');
var Categori = require('../../model/Asm/categoriModel');
var product = require('../../model/Asm/productsModel');
var detailsmodel = require('../../model/Asm/detailsModel');
const multer = require('multer');
const path = require('path');
const upload = require('../../util/upload');
/**
 * 1 Signup : post /signup (req: userName, email, password, phone_number)
 * {
  "userName": "tai",
  "email": "taiha",
  "password": "123456",
  "phone_number": "0987654321"
}
 * 2 LogIn  : post /login (req: email, password)
 * 3 Xem thong tin user : get /user:id (req: id)
 * 4 Tao Order : post /order (req: user,  status)
 * 5 Lấy all order theo Id user : get /order:id (req: id)
 * 6 Xóa order : delete /:id (req: id)
 * 7 Thêm Cate : post /cate (req: name)
 * 8 Lấy All Cate : get / 
 * 9 Update Cate : put /update/:id (req:  name, image)
 * 10 Xóa Cate : delete /deleteCate/:id (req: id)
 * 11 Thêm Product : post /products (req: name, price, image, category)
 * 12 Get all products : get /products 
 * 13 Get product by IdCate : get /productCate/:id (req: id)
 * 14 Get thông tin Product theo id : get /products:id (req: id)
 * 15 Update Product : put /products/:id (req: name, price, image, category)
 * 16 Xóa Product : delete /products/:id (req: id)
 * 17 Creat Details : post /details (req: order_id, product_id, quantity, price)
 * 18 Get all details theo id order : get /details:id (req: id)
 * 
 */


// signup
router.post('/signup', async (req, res) => {
    try {
        const { userName, email, password, phone_number } = req.body;// lấy dữ liệu từ body
        const User = await user.findOne({ email });
        if (User) {
            return res.status(400).json({ status: false, message: "email da ton tai" });
        }
        const newUser = new user({
            userName, email, password, phone_number
        });
        await newUser.save();
        res.status(200).json({ status: true, message: " dang ky thanh cong" })

    } catch (error) {
        res.status(400).json({ status: false, error })
    }
});
// login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;// lấy dữ liệu từ body

        // tim user
        const User = await user.findOne({ email });
        if (!User) return res.status(400).json({ status: false, message: "tai khong khong ton tai!" });
        // so sanh password
        const isMatch = User.password === password;
        if (!isMatch) return res.status(400).json({ status: false, message: "mat khau k dung" });
        res.status(200).json({ status: true, message: "dang nhap thanh cong" });
    } catch (error) {
        res.status(500).json({ status: false, error });

    }
});

// xem thong tin user theo id
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const User = await user.findById(userId);
        if (!User) return res.status(400).json({ status: false, message: "khong tim thay user" });
        res.status(200).json({ status: true, message: "thanh cong", User });
    } catch (error) {
        res.status(500).json({ status: false, error });
    }
});
//  CREATE - Tạo đơn hàng mới
router.post('/order', async (req, res) => {
    try {
        const { status, user } = req.body;
        const ordernew = new order({
            status, user
        });
        await ordernew.save();
        res.status(200).json({ status: true, message: "tạo đơn hàng mới" });

    } catch (error) {
        res.status(400).json({ status: false, error });
    }
})

//  READ - Lấy tất cả đơn hàng theo id user
router.get('/orders/:userId', async (req, res) => {
    try {
        const orders = await order.find({ user: req.params.id },
        );
        res.status(200).json({ status: true, data: orders });
    } catch (error) {
        res.status(500).json({ status: false, error });
    }
});
//  DELETE - Xóa đơn hàng
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedOrder = await order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ status: false, message: 'Khong tim thay don hang' });
        res.status(200).json({ status: true, message: 'Don hang da duoc xoa' });
    } catch (error) {
        res.status(500).json({ status: false, error });
    }
});

//  CREATE - Thêm danh mục mới
router.post('/cate', async (req, res) => {
    try {
        const { name } = req.body;
        const newCate = new Categori({ name });
        await newCate.save();
        res.status(200).json({ status: true, message: 'Thêm danh mục thành công', data: newCate });
    } catch (error) {
        res.status(400).json({ status: false, message: 'Lỗi khi thêm danh mục', error });
    }
});


//  READ - Lấy tất cả danh mục
router.get('/', async (req, res) => {
    try {
        const list = await Categori.find();
        res.status(200).json({ status: true, data: list });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Lỗi khi lấy danh mục', error });
    }
});
//  UPDATE - Cập nhật danh mục
router.put('/update/:id', async (req, res) => {
    try {
        const updatedCate = await Categori.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ status: true, message: 'Cập nhật thành công', data: updatedCate });
    } catch (error) {
        res.status(400).json({ status: false, message: 'Lỗi khi cập nhật', error });
    }
});

//  DELETE - Xoá danh mục
router.delete('/deleteCate/:id', async (req, res) => {
    try {
        console.log("hi", req.params.id);  // Kiểm tra ID nhận vào
        await Categori.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: true, message: 'Xoá thành công' });
    } catch (error) {
        res.status(400).json({ status: false, message: 'Lỗi khi xoá', error });
    }
});

// CREAT - Thêm sản phẩm
router.post('/products',upload.single('image'), async (req, res) => {
    try {
        const { name, price, category } = req.body;
 const image = req.file ? req.file.path : null; // Lưu đường dẫn ảnh
        const newProduct = new product({
            name,
            price,
            image,
            category,
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ status: true, message: 'Tạo sản phẩm thành công', data: savedProduct });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Lỗi khi tạo sản phẩm', error: error.message });
    }
});
//  READ - Lấy tất cả san pham
router.get('/products', async (req, res) => {
    try {
        const products = await product.find();
        res.status(200).json({ status: true, message: 'Danh sách sản phẩm', data: products });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
    }
});
// Read - Lấy sản phẩm theo danh muc
router.get('/productCate/:categoryId', async (req, res) => {
    //const categoryId = req.params.categoryId;
    try {
        const products = await product.find({ category: req.params.categoryId }).populate('category');
        res.status(200).json({ status: true, message: 'Danh sách sản phẩm' ,products});
    } catch (error) {
        res.status(500).json({ status: false, message: 'Lỗi khi lấy danh mục', error: error.message });
    }
});
// READ - Lấy san pham theo ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await product.findById(req.params.id).populate('categoriasm');
        if (!product) {
            return res.status(404).json({ status: false, message: 'Sản phẩm không tồn tại' });
        }
        res.status(200).json({ status: true, message: 'Thông tin sản phẩm', data: product });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Lỗi khi lấy thông tin sản phẩm', error: error.message });
    }
});
// UPDATE - Cập nhật sản phẩm
router.put('/products/:id', async (req, res) => {
    try {
        const { name, price, image, category } = req.body;

        const updatedProduct = await product.findByIdAndUpdate(req.params.id, {
            name,
            price,
            image,
            category
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ status: false, message: 'Sản phẩm không tồn tại' });
        }

        res.status(200).json({ status: true, message: 'Cập nhật sản phẩm thành công', data: updatedProduct });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Lỗi khi cập nhật sản phẩm', error: error.message });
    }
});
// DELETE - Xóa sản phẩm
router.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ status: false, message: 'Sản phẩm không tồn tại' });
        }
        res.status(200).json({ status: true, message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Lỗi khi xóa sản phẩm', error: error.message });
    }
});
// creat detail product
router.post('/details', async (req, res) => {
    try {
        const { order_id, product_id, quantity } = req.body;

        // Tìm sản phẩm từ bảng product
        const products = await product.findById(product_id);
        if (!products) {
            return res.status(404).json({ status: false, message: 'Sản phẩm không tồn tại' });
        }

        // Tính tổng giá trị sản phẩm
        const total_price = products.price * quantity;  // Sửa từ 'product' thành 'products'

        const newDetail = new detailsmodel({
            order_id,
            product_id,
            quantity,
            total_price
        });

        const savedDetail = await newDetail.save();
        const alldetails = await detailsmodel.find({ order_id });
        const newTotal = alldetails.reduce((sum, item) => sum + item.total_price, 0);
        await order.findByIdAndUpdate(order_id, { total_amount: newTotal });
        res.status(201).json({ status: true, message: 'Tạo chi tiết đơn hàng thành công', data: savedDetail });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Lỗi khi tạo chi tiết đơn hàng', error: error.message });
    }
});

// GET - Lấy danh sách chi tiết đơn hàng theo id đơn hàng   
router.get('/details/:id', async (req, res) => {
    try {
        // Tìm chi tiết đơn hàng
        const detail = await detailsmodel.findById(req.params.id).populate('order_id product_id');

        if (!detail) {
            return res.status(404).json({ status: false, message: 'Chi tiết đơn hàng không tồn tại' });
        }

        // Trả về chi tiết đơn hàng
        res.status(200).json({ status: true, message: 'Chi tiết đơn hàng', data: detail });
    } catch (error) {
        // Log lỗi ra console
        console.error(error);
        res.status(500).json({ status: false, message: 'Lỗi khi lấy chi tiết đơn hàng', error: error.message });
    }
});





module.exports = router;