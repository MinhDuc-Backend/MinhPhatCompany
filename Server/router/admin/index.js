import express from "express"
import ChucNangAdminRoute from "./ChucNang.js"
import QuyenTaiKhoanAdminRoute from "./QuyenTaiKhoan.js"
import TaiKhoanAdminRoute from "./TaiKhoan.js";
import NhanVienAdminRoute from "./NhanVien.js";
import LoaiSanPhamChaAdminRoute from "./LoaiSanPhamCha.js";
import LoaiSanPhamConAdminRoute from "./LoaiSanPhamCon.js";
import SanPham from "./SanPham.js"
import CongTyAdminRoute from "./CongTy.js";
import KhachHangAdminRoute from "./KhachHang.js";
import ThongTinCtyAdminRoute from "./ThongTinCty.js";


const adminRoute = express.Router();

adminRoute.use('/chuc-nang', ChucNangAdminRoute)
        .use('/quyen-tai-khoan', QuyenTaiKhoanAdminRoute)
        .use('/tai-khoan', TaiKhoanAdminRoute)
        .use('/nhan-vien', NhanVienAdminRoute)
        .use('/lsp-cha', LoaiSanPhamChaAdminRoute)
        .use('/lsp-con', LoaiSanPhamConAdminRoute)
        .use('/san-pham', SanPham)
        .use('/cong-ty', CongTyAdminRoute)
        .use('/khach-hang', KhachHangAdminRoute)
        .use('/thong-tin-cty', ThongTinCtyAdminRoute)

export default adminRoute

