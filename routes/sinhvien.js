var express = require('express');
var router = express.Router();

var listdata = [
    { mssv: 1, hoTen: "Nguyen Van A", lop: "MD18401", dtb: 9.2 },
    { mssv: 2, hoTen: "Tran Thi B", lop: "MD18402", dtb: 9.5 },
    { mssv: 3, hoTen: "Le Van C2", lop: "MD18401", dtb: 4.8 },
    { mssv: 4, hoTen: "Le Van C3", lop: "MD18401", dtb: 6.8 },
    { mssv: 5, hoTen: "Le Van C2", lop: "MD18401", dtb: 3.8 },
    { mssv: 6, hoTen: "nguyen van", lop: "MD18402", dtb: 8.2 },
];


// get : lay, post : them, put : sua, delete : xoa
router.get("/list", function (req, res) {
    res.json({ success: true, message: "thanh cong", list: listdata })
});

// them moi 1 sinh vien
router.post("/them", function (req, res) {
    var newSinhvien = req.body;
    listdata.push(newSinhvien);
    res.json({ success: true, message: "them thanh cong", list: listdata });

});

// cap nhat thong tin sinh vien theo ma so sinh vien
router.put("/sua", function (req, res) {
    const { mssv, hoTen, lop, dtb } = req.body;
    const itemUpdate = listdata.find(p => p.mssv == mssv);

    if (!itemUpdate) {
        res.status(400).json({ success: false, message: "khong tim thay sinh vien" });
    } else {
        itemUpdate.hoTen = hoTen ? hoTen:itemUpdate.hoTen ;
        itemUpdate.lop = lop ? lop:itemUpdate.lop ;
        itemUpdate.dtb = dtb ? dtb:itemUpdate.dtb ;
        res.status(200).json({ success: true, message: "sua thanh cong",list:listdata});
    }
});

//xoa sinh vien theo ma so sinh vien
router.delete("/xoa/:mssv", function (req, res) {
    const { mssv } = req.params;
    var indexItem = listdata.findIndex(p => p.mssv == mssv);
    if (indexItem == -1) {
        res.status(400).json({ success: false, message: "khong tim thay" });
    } else {
        listdata.splice(indexItem, 1);
        res.status(200).json({ success: true, message: "xoa thanh cong", list: listdata });
    }
})

// lay danh sach sinh vien co diem duoi trung binh tu 6.5 den 8.0
router.get("/listdiem", function (req, res) {
    var list = listdata.filter(p => p.dtb >= 6.5 && p.dtb <=8.0);
    res.status(200).json({ success: true, message: " lay thanh cong", list : list});
})

// lay danh sach sinh vien thuoc lop MD18401 co diem trung binh la 9
router.get("/listlop", function (req, res) {
    var list = listdata.filter((p)=>p.lop== "MD18401" && p.dtb >= 9);
    res.status(200).json({ success: true, message: " lay thanh cong", list})
    

})

// sap xep danh sach sinh vien diem trung binh giam dan
router.get("/sapxep", function (req, res) {
    var list = [...listdata].sort((a,b)=> b.dtb-a.dtb);
    res.status(200).json({ success: true, message: " sap xep thanh cong",list})
})
// tim sinh vien co diem trung binh cao nhat lop MD18401
router.get("/timmaxdiem", function (req, res) {
    var listlop= listdata.filter(p=> p.lop=="MD18402");
    if(listlop.length == 0 ){
        res.status(400).json({ success: false, message: "khong tim thay"});
    }
    var maxdiem = listlop.reduce((max, sv) => (sv.dtb > max.dtb ? sv : max), listlop[0]);
    res.status(200).json({ success: true, message: " tim max diem thanh",maxdiem});
})


module.exports = router;