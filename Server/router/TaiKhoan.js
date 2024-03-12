import express from "express"
import argon2 from "argon2"
import { KtraDuLieuTaiKhoanKhiDangNhap, KtraDuLieuTaiKhoanKhiDoiMatKhau } from "../validation/TaiKhoan.js";
import TaiKhoan from "../model/TaiKhoan.js";
import QuyenTaiKhoan from "../model/QuyenTaiKhoan.js";
import GiangVien from "../model/GiangVien.js";
import SinhVien from "../model/SinhVien.js";
import { sendError, sendServerError, sendSuccess } from "../helper/client.js";
import { createTokenPair } from "../middleware/auth.js";
import { TrangThaiTaiKhoan } from "../constant.js";
const TaiKhoanRoute = express.Router()

/**
 * @route POST /api/tai-khoan/DangNhap
 * @description Đăng nhập trang người dùng
 * @access private
*/
TaiKhoanRoute.post('/DangNhap', async (req, res) => {
    try{
        const err = KtraDuLieuTaiKhoanKhiDangNhap(req.body);
        if (err)
            return sendError(res, err);
        const { TenDangNhap, MatKhau } = req.body;

        const taikhoan = await TaiKhoan.findOne({ TenDangNhap: TenDangNhap, TrangThai: TrangThaiTaiKhoan.DaKichHoat });
        if (!taikhoan)
            return sendError(res, "Tên đăng nhập hoặc mật khẩu không chính xác");
        const KtraMatKhau = await argon2.verify(taikhoan.MatKhau, MatKhau);
        if (!KtraMatKhau)
            return sendError(res, "Tên đăng nhập hoặc mật khẩu không chính xác");
        const quyentaikhoan = await QuyenTaiKhoan.findById(taikhoan.MaQTK);
        let chucvu = "";
        let hoten = "";
        let maso = "";
        const thongtingiangvien = await GiangVien.findOne({ MaTK: taikhoan._id });
        if (!thongtingiangvien){
            const thongtinsinhvien = await SinhVien.findOne({ MaTK: taikhoan._id });
            chucvu = "Sinh viên";
            hoten = thongtinsinhvien.HoSV + " " + thongtinsinhvien.TenSV;
            maso = thongtinsinhvien.MaSV;
        }
        else{
            chucvu = "Giảng viên";
            hoten = thongtingiangvien.HoGV + " " + thongtingiangvien.TenGV;
            maso = thongtingiangvien.MaGV;
        }

        const thongtin = {
            "MaSo": maso,
            "HoTen": hoten,
            "ChucVu": chucvu
        }

        const tokens = await createTokenPair({ MaTK: taikhoan.MaTK, QuyenTK: quyentaikhoan.MaQTK }, "publicKey", "privateKey");
        const response = {
            "accessToken": tokens.accessToken,
            "refreshToken": tokens.refreshToken,
            "ThongTin": thongtin
        };
        return sendSuccess(res, 'Đăng nhập thành công', response);
        
    }
    catch (error){
        console.log(error);
        return sendServerError(res);
    }
})


/**
 * @route POST /api/tai-khoan/DangNhapAdmin
 * @description Đăng nhập trang admin
 * @access private
*/
TaiKhoanRoute.post('/DangNhapAdmin', async (req, res) => {
    try{
        const err = KtraDuLieuTaiKhoanKhiDangNhap(req.body);
        if (err)
            return sendError(res, err);
        const { TenDangNhap, MatKhau } = req.body;

        const taikhoan = await TaiKhoan.findOne({ TenDangNhap: TenDangNhap, TrangThai: TrangThaiTaiKhoan.DaKichHoat });
        if (!taikhoan)
            return sendError(res, "Tên đăng nhập hoặc mật khẩu không chính xác");
        const KtraMatKhau = await argon2.verify(taikhoan.MatKhau, MatKhau);
        if (!KtraMatKhau)
            return sendError(res, "Tên đăng nhập hoặc mật khẩu không chính xác");
        const quyentaikhoan = await QuyenTaiKhoan.findById(taikhoan.MaQTK);
        if (quyentaikhoan.MaQTK == "SINHVIEN" || quyentaikhoan.MaQTK == "GIANGVIEN")
            return sendError(res, "Bạn không có quyền truy cập vào trang admin");
        const thongtingiangvien = await GiangVien.findOne({ MaTK: taikhoan._id });
        if (!thongtingiangvien)
            return sendError(res, "Bạn không có quyền truy cập vào trang admin");

        const chucnang = await QuyenTaiKhoan.findOne({ MaQTK: quyentaikhoan.MaQTK }).populate([
            {
                path: "ChucNang",
                select: "MaCN",
                populate: {
                    path: "MaCN",
                    select: "MaCN TenChucNang Hinh"
                }
            },
        ]).lean();
        const thongtin = {
            "MaGV": thongtingiangvien.MaGV,
            "HoTen": thongtingiangvien.HoGV + " " + thongtingiangvien.TenGV,
            "QuyenHan": chucnang
        }
        const tokens = await createTokenPair({ MaTK: taikhoan.MaTK, QuyenTK: quyentaikhoan.MaQTK }, "publicKey", "privateKey");
        const response = {
            "accessToken": tokens.accessToken,
            "refreshToken": tokens.refreshToken,
            "ThongTin": thongtin
        };
        return sendSuccess(res, 'Đăng nhập thành công', response);
        
    }
    catch (error){
        console.log(error);
        return sendServerError(res);
    }
})

/**
 * @route POST /api/tai-khoan/DoiMatKhau
 * @description Đổi mật khẩu
 * @access private
*/
TaiKhoanRoute.post('/DoiMatKhau', async (req,res) => {
    try{
        const err = KtraDuLieuTaiKhoanKhiDoiMatKhau(req.body);
        if (err)
            return sendError(res, err);
        const { MaSo, MatKhauCu, MatKhauMoi, NhapLaiMatKhauMoi } = req.body;
        const taikhoan = await TaiKhoan.findOne({ TenDangNhap: MaSo });
        const KtraMatKhau = await argon2.verify(taikhoan.MatKhau, MatKhauCu);
        if (!KtraMatKhau)
            return sendError(res, "Mật khẩu cũ không chính xác.");
        if (MatKhauMoi != NhapLaiMatKhauMoi)
            return sendError(res, "Nhập lại mật khẩu mới không chính xác.");
        const KtraTrungMK = await argon2.verify(taikhoan.MatKhau, MatKhauMoi);
        if (KtraTrungMK)
            return sendError(res, "Mật khẩu mới phải khác mật khẩu cũ.");

        let password = await argon2.hash(MatKhauMoi);
        await TaiKhoan.findOneAndUpdate({ TenDangNhap: MaSo }, { MatKhau: password });
        return sendSuccess(res, "Thay đổi mật khẩu thành công");
    }
    catch(error){
        console.log(error);
        return sendServerError(res);
    }
})

export default TaiKhoanRoute
