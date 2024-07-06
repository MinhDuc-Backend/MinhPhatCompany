import express from "express"
import ChucNangAdminRoute from "./ChucNang.js"
import QuyenTaiKhoanAdminRoute from "./QuyenTaiKhoan.js"
import TaiKhoanAdminRoute from "./TaiKhoan.js";
import NhanVienAdminRoute from "./NhanVien.js";
import LoaiSanPhamChaAdminRoute from "./LoaiSanPhamCha.js";
import LoaiSanPhamConAdminRoute from "./LoaiSanPhamCon.js";
import SanPham from "./SanPham.js"

const adminRoute = express.Router();

adminRoute.use('/chuc-nang', ChucNangAdminRoute)
        .use('/quyen-tai-khoan', QuyenTaiKhoanAdminRoute)
        .use('/tai-khoan', TaiKhoanAdminRoute)
        .use('/nhan-vien', NhanVienAdminRoute)
        .use('/lsp-cha', LoaiSanPhamChaAdminRoute)
        .use('/lsp-con', LoaiSanPhamConAdminRoute)
        .use('/san-pham', SanPham)

export default adminRoute

