import express from "express"
import fs from 'fs'
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import NhanVien from "../../model/NhanVien.js"
import { KtraDuLieuNhanVienKhiThem, KtraDuLieuNhanVienKhiChinhSua } from "../../validation/NhanVien.js"
import { TrangThaiNhanVien } from "../../constant.js"

const NhanVienAdminRoute = express.Router()

/**
 * @route GET /api/admin/nhan-vien/DanhSachNhanVien
 * @description Lấy danh sách nhân viên
 * @access public
 */
NhanVienAdminRoute.get('/DanhSachNhanVien', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        let trangthai = [TrangThaiNhanVien.ChuaCoTaiKhoan,TrangThaiNhanVien.DaCoTaiKhoan];
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaNV: { $regex: keyword, $options: "i" } },
                    { HoNV: { $regex: keyword, $options: "i" } },
                    { TenNV: { $regex: keyword, $options: "i" } },
                    { Email: { $regex: keyword, $options: "i" } },
                    { SoDienThoai: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const nhanviens = await NhanVien.find({ $and: [keywordCondition], TrangThai: trangthai }).limit(pageSize).skip(pageSize * page)
        const length = await NhanVien.find({ $and: [keywordCondition], TrangThai: trangthai }).count();

        if (nhanviens.length == 0) 
            return sendError(res, "Không tìm thấy danh sách nhân viên.")
        if (nhanviens) 
            return sendSuccess(res, "Lấy danh sách nhân viên thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: nhanviens
            })

        return sendError(res, "Không tìm thấy danh sách nhân viên.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/nhan-vien/ChiTietNhanVien/{MaNV}
 * @description Lấy thông tin chi tiết nhân viên
 * @access public
 */
NhanVienAdminRoute.get('/ChiTietNhanVien/:MaNV', async (req, res) => {
    try {
        const { MaNV } = req.params;
        const isExist = await NhanVien.findOne({ MaNV: MaNV }).lean();
        if (!isExist)
            return sendError(res, "Nhân viên không tồn tại");
        return sendSuccess(res, "Chi tiết nhân viên.", isExist);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/nhan-vien/Them
 * @description Thêm nhân viên
 * @access public
 */
NhanVienAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuNhanVienKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaNV, HoNV, TenNV, Email, SoDienThoai, GioiTinh, NgaySinh } = req.body;
        const isExist = await NhanVien.findOne({ MaNV: MaNV }).lean();
        if (isExist)
            return sendError(res, "Mã giảng viên đã tồn tại");
        const nhanvien = await NhanVien.create({ MaNV, HoNV, TenNV, Email, SoDienThoai, GioiTinh, NgaySinh });

        return sendSuccess(res, "Thêm nhân viên thành công", nhanvien);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/nhan-vien/ChinhSua/{MaNV}
 * @description Chỉnh sửa thông tin nhân viên
 * @access public
*/
NhanVienAdminRoute.post('/ChinhSua/:MaNV', async (req, res) => {
    try{
        const errors = KtraDuLieuNhanVienKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { HoNV, TenNV, Email, SoDienThoai, GioiTinh, NgaySinh } = req.body;
        const { MaNV } = req.params;
        const nhanvien = await NhanVien.findOne({ MaNV: MaNV }).lean();
        if (!nhanvien)
            return sendError(res, "Mã nhân viên không tồn tại");

        await NhanVien.findOneAndUpdate({ MaNV: MaNV },{ HoNV, TenNV, Email, SoDienThoai, GioiTinh, NgaySinh });

        return sendSuccess(res, "Chỉnh sửa thông tin nhân viên thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/giang-vien/Xoa/{MaGV}
 * @description Xóa thông tin giảng viên
 * @access private
 */
NhanVienAdminRoute.delete('/Xoa/:MaGV', async (req, res) => {
    try {
        const { MaGV } = req.params
        const isExist = await GiangVien.findOne({ MaGV: MaGV })
        if (!isExist) 
            return sendError(res, "Giảng viên này không tồn tại");

        if (isExist.Hinh != ''){
            let splitUrl = await isExist.Hinh.split('/');
            let file = await `${splitUrl[splitUrl.length - 2]}/${splitUrl[splitUrl.length - 1].split('.')[0]}`;
            await DeleteHinhTrenCloudinary(file);
        }
        await GiangVien.findOneAndDelete({ MaGV: MaGV });
        return sendSuccess(res, "Xóa giảng viên thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default NhanVienAdminRoute