import express from "express"
import fs from 'fs'
import ExcelJS from 'exceljs'
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { DoiDinhDangNgay, XuLyNgaySinh } from "../../helper/XuLyDuLieu.js"
import Nganh from "../../model/Nganh.js"
import KhoaLuanTotNghiep from "../../model/KhoaLuanTotNghiep.js"
import SinhVien from "../../model/SinhVien.js"
import GiangVien from "../../model/GiangVien.js"
import { KtraDuLieuKLTNKhiChinhSua, KtraDuLieuKLTNKhiChinhSuaDeTaiKhoaLuan, KtraDuLieuKLTNKhiSuaThongTinSVDangKyKhoaLuan, KtraDuLieuKLTNKhiThem, KtraDuLieuKLTNKhiThemDeTaiKhoaLuan, KtraDuLieuKLTNKhiThemSVDangKyKhoaLuan, KtraDuLieuKLTNKhiXoaDeTaiKhoaLuan, KtraDuLieuKLTNKhiXoaSVDangKyKhoaLuan } from "../../validation/KhoaLuanTotNghiep.js"
import { DeTaiKhoaLuan, TrangThaiCongBoKLTN, TrangThaiDangKyKLTN } from "../../constant.js"
import { createKhoaLuanDir } from "../../middleware/createDir.js"
import { uploadFile } from "../../middleware/storage.js"
import path from "path"
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const KhoaLuanTotNghiepAdminRoute = express.Router()

/**
 * @route GET /api/admin/khoa-luan-tot-nghiep/DanhSachKLTN
 * @description Lấy danh sách các đợt đăng ký khóa luận tốt nghiệp
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.get('/DanhSachKLTN', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaKLTN: { $regex: keyword, $options: "i" } },
                    { Ten: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const kltn = await KhoaLuanTotNghiep.find({ $and: [keywordCondition] }).limit(pageSize).skip(pageSize * page).populate([
            {
                path: "Nganh",
                select: "MaNganh TenNganh",
            }
        ])
        const length = await KhoaLuanTotNghiep.find({ $and: [keywordCondition] }).count();

        if (kltn.length == 0) 
            return sendError(res, "Không tìm thấy danh sách khóa luận tốt nghiệp.")
        if (kltn) 
            return sendSuccess(res, "Lấy danh sách khóa luận tốt nghiệp thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: kltn
            })

        return sendError(res, "Không tìm thấy danh sách khóa luận tốt nghiệp.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/khoa-luan-tot-nghiep/ChiTietKLTN/{MaKLTN}
 * @description Lấy thông tin chi tiết khóa luận tốt nghiệp
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.get('/ChiTietKLTN/:MaKLTN', async (req, res) => {
    try {
        const { MaKLTN } = req.params
        const isExist = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).populate([
            {
                path: "Nganh",
                select: "MaNganh TenNganh",
            },
            {
                path: "DSDeTai",
                select: "GVHD",
                populate: [
                    {
                        path: "GVHD",
                        select: "MaGV HoGV TenGV DonViCongTac"
                    },
                ]
            },
        ]).lean();
        if (!isExist)
            return sendError(res, "Đợt khóa luận tốt nghiệp không tồn tại"); 

        return sendSuccess(res, "Chi tiết thông tin khóa luận tốt nghiệp.", isExist)
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/Them
 * @description Thêm đợt khóa luận tốt nghiệp
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuKLTNKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaKLTN, Ten, Khoa, MaNganh, ThoiGianBD, ThoiGianKT } = req.body;

        const isExistMa = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (isExistMa)
            return sendError(res, "Mã khóa luận tốt nghiệp đã tồn tại");
        const isExistNganh = await Nganh.findOne({ MaNganh: MaNganh });
        if (!isExistNganh)
            return sendError(res, "Mã ngành không tồn tại");
        const date = new Date();
        const now = new Date(DoiDinhDangNgay(date));
        const bd = new Date(ThoiGianBD);
        const kt = new Date(ThoiGianKT);
        if (kt < bd)
            return sendError(res, "Ngày kết thúc phải lớn hơn ngày bắt đầu");
        let check = 0;
        const data = await KhoaLuanTotNghiep.find({});
        if ( data.length > 0 ){
            data.forEach((element) => {
                if ( element.ThoiGianBD <= bd && bd <= element.ThoiGianKT ){
                    check = 1;
                    return;
                }
                else{
                    if (element.ThoiGianBD <= kt && kt <= element.ThoiGianKT){
                        check = 1;
                        return;
                    }
                }
            });
        }
        
        if ( check == 1 )
            return sendError(res, "Có đợt đăng ký khóa luận tốt nghiệp khác trong khoảng thời gian này. Vui lòng chọn khoảng thời gian khác.");
        let trangthai = "";
        if ( now < bd && now < kt)
            trangthai = TrangThaiDangKyKLTN.ChuaToiThoiGianDangKy;
        if ( bd <= now && now <= kt)
            trangthai = TrangThaiDangKyKLTN.TrongThoiGianDangKy;
        if ( now > bd && now > kt)
            trangthai = TrangThaiDangKyKLTN.HetThoiGianDangKy

        const kltn = await KhoaLuanTotNghiep.create({ MaKLTN: MaKLTN, Ten: Ten, Khoa: Khoa, Nganh: isExistNganh._id, ThoiGianBD: ThoiGianBD, ThoiGianKT: ThoiGianKT, TrangThai: trangthai });
        return sendSuccess(res, "Thêm đợt đăng ký khóa luận tốt nghiệp thành công", kltn);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/khoa-luan-tot-nghiep/ChinhSua/{MaKLTN}
 * @description Chỉnh sửa đợt đăng ký khóa luận tốt nghiệp
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.put('/ChinhSua/:MaKLTN', async (req, res) => {
    try{
        const errors = KtraDuLieuKLTNKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { Ten, Khoa, MaNganh, ThoiGianBD, ThoiGianKT } = req.body;
        const { MaKLTN } = req.params;

        const isExistMa = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (!isExistMa)
            return sendError(res, "Đợt đăng ký khóa luận tốt nghiệp không tồn tại");
        const isExistNganh = await Nganh.findOne({ MaNganh: MaNganh });
            if (!isExistNganh)
                return sendError(res, "Mã ngành không tồn tại");
        const date = new Date();
        const now = new Date(DoiDinhDangNgay(date));
        const bd = new Date(ThoiGianBD);
        const kt = new Date(ThoiGianKT);
        if (kt < bd)
            return sendError(res, "Ngày kết thúc phải lớn hơn ngày bắt đầu");
        let check = 0;
        const data = await KhoaLuanTotNghiep.find({});
        if (data.length > 0){
            data.forEach((element) => {
                if (element.MaKLTN != MaKLTN){
                    if ( element.ThoiGianBD <= bd && bd <= element.ThoiGianKT ){
                        check = 1;
                        return;
                    }
                    else{
                        if (element.ThoiGianBD <= kt && kt <= element.ThoiGianKT){
                            check = 1;
                            return;
                        }
                    }
                }
            });
        }
        
        if ( check == 1 )
            return sendError(res, "Có đợt đăng ký khóa luận tốt nghiệp khác trong khoảng thời gian này. Vui lòng chọn khoảng thời gian khác.");
        let trangthai = "";
        if ( now < bd && now < kt)
            trangthai = TrangThaiDangKyKLTN.ChuaToiThoiGianDangKy;
        if ( bd <= now && now <= kt)
            trangthai = TrangThaiDangKyKLTN.TrongThoiGianDangKy;
        if ( now > bd && now > kt)
            trangthai = TrangThaiDangKyKLTN.HetThoiGianDangKy

        await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { Ten: Ten, Khoa: Khoa, Nganh: isExistNganh._id, ThoiGianBD: ThoiGianBD, ThoiGianKT: ThoiGianKT, TrangThai: trangthai });
        return sendSuccess(res, "Chỉnh sửa đợt đăng ký chuyên ngành thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/khoa-luan-tot-nghiep/Xoa/{MaKLTN}
 * @description Xóa đợt đăng ký khóa luận tốt nghiệp
 * @access private
 */
KhoaLuanTotNghiepAdminRoute.delete('/Xoa/:MaKLTN', async (req, res) => {
    try {
        const { MaKLTN } = req.params
        const isExist = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN })
        if (!isExist) 
            return sendError(res, "Đợt đăng ký khóa luận tốt nghiệp này không tồn tại");
        await KhoaLuanTotNghiep.findOneAndDelete({ MaKLTN: MaKLTN });
        return sendSuccess(res, "Xóa đợt đăng ký khóa luận tốt nghiệp thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/ThemSVDangKyKL/{MaKLTN}
 * @description Thêm sinh viên đăng ký khóa luận tốt nghiệp
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/ThemSVDangKyKL/:MaKLTN', async (req, res) => {
    try{
        const errors = KtraDuLieuKLTNKhiThemSVDangKyKhoaLuan(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenDeTai, MaGV, MaSV, HoSV, TenSV, Email, SoDienThoai, DTBTL, TinChiTL } = req.body;
        const { MaKLTN } = req.params;

        const isExist = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký khóa luận tốt nghiệp không tồn tại");
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV });
        if (!sinhvien)
            return sendError(res, "Sinh viên này không tồn tại trong hệ thống");
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại trong hệ thống");

        let sv = {
            MaSV: MaSV,
            HoSV: HoSV,
            TenSV: TenSV,
            Email: Email,
            SoDienThoai: SoDienThoai,
            DTBTL: Number(DTBTL),
            TinChiTL: Number(TinChiTL)
        }
        let check = 0;
        if (isExist.DSDeTai.length > 0){
            isExist.DSDeTai.forEach((element) => {
                if ( element.TenDeTai.includes(TenDeTai) && element.GVHD.equals(giangvien._id) ){
                    check = 1;
                    if (element.SVChinhThuc.length >= 2 ){
                        check = 2;
                    }
                    else{
                        if (element.SVChinhThuc.length >= 0){
                            element.SVChinhThuc.forEach((data) => {
                                if ( data.MaSV.includes(MaSV) ){
                                    check = 3;
                                }
                            });
                            if (check == 1){
                                element.SVChinhThuc.push(sv);
                            }
                        }
                    }
                    let trangthai = "";
                    if (element.SVChinhThuc.length == 2 )
                        trangthai = DeTaiKhoaLuan.DaDu;
                    else
                        trangthai = DeTaiKhoaLuan.ChuaDu;
                    element.TrangThaiDeTai = trangthai;
                    return;
                }
            });
            if ( check == 2 )
                return sendError(res, "Đề tài này đã đủ số lượng sinh viên đăng ký");
            if ( check == 3 )
                return sendError(res, "Sinh viên đã đăng ký đề tài này.");
            if ( check == 1 ){
                await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: isExist.DSDeTai });
            }
            else
                return sendError(res, "Đề tài này không tồn tại.")
        }
        else
            return (res, "Danh sách đề tài đang rỗng.");
        
        return sendSuccess(res, "Thêm sinh viên đăng ký khóa luận tốt nghiệp thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/SuaThongTinSVDangKyKL/{MaKLTN}
 * @description Chỉnh sửa thông tin sinh viên đăng ký khóa luận tốt nghiệp
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/SuaThongTinSVDangKyKL/:MaKLTN', async (req, res) => {
    try{
        const errors = KtraDuLieuKLTNKhiSuaThongTinSVDangKyKhoaLuan(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenDeTai, MaGV, MaSV, HoSV, TenSV, Email, SoDienThoai, DTBTL, TinChiTL } = req.body;
        const { MaKLTN } = req.params;

        const isExist = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký khóa luận tốt nghiệp không tồn tại");
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV });
        if (!sinhvien)
            return sendError(res, "Sinh viên này không tồn tại trong hệ thống");
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại trong hệ thống");

        let sv = {
            MaSV: MaSV,
            HoSV: HoSV,
            TenSV: TenSV,
            Email: Email,
            SoDienThoai: SoDienThoai,
            DTBTL: Number(DTBTL),
            TinChiTL: Number(TinChiTL)
        }
        let check = 0;
        if (isExist.DSDeTai.length > 0){
            isExist.DSDeTai.forEach((element) => {
                if ( element.TenDeTai.includes(TenDeTai) && element.GVHD.equals(giangvien._id) ){
                    check = 1;
                    element.SVChinhThuc.forEach((data) => {
                        if ( data.MaSV.includes(MaSV) ){
                            data.MaSV = MaSV;
                            data.HoSV = HoSV;
                            data.TenSV = TenSV;
                            data.Email = Email;
                            data.SoDienThoai = SoDienThoai;
                            data.DTBTL = Number(DTBTL);
                            data.TinChiTL = Number(TinChiTL);
                            return;
                        }
                    });
                    let trangthai = "";
                    if (element.SVChinhThuc.length == 2 )
                        trangthai = DeTaiKhoaLuan.DaDu;
                    else
                        trangthai = DeTaiKhoaLuan.ChuaDu;
                    element.TrangThaiDeTai = trangthai;
                    return;
                }
            });
            if ( check == 1 )
                await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: isExist.DSDeTai });
            else
                return sendError(res, "Đề tài này không tồn tại.")
        }
        else
            return (res, "Danh sách đề tài đang rỗng.");
        
        return sendSuccess(res, "Chỉnh sửa thông tin sinh viên đăng ký khóa luận tốt nghiệp thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/XoaSVDangKyKL/{MaKLTN}
 * @description Xóa thông tin sinh viên đăng ký đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/XoaSVDangKyKL/:MaKLTN', async (req, res) => {
    try{
        const errors = KtraDuLieuKLTNKhiXoaSVDangKyKhoaLuan(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenDeTai, MaGV, MaSV } = req.body;
        const { MaKLTN } = req.params;

        const isExist = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký khóa luận tốt nghiệp không tồn tại");
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV });
        if (!sinhvien)
            return sendError(res, "Sinh viên này không tồn tại trong hệ thống");
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại trong hệ thống");
        let check = 0;
        if (isExist.DSDeTai.length > 0){
            isExist.DSDeTai.forEach((element) => {
                if ( element.TenDeTai.includes(TenDeTai) && element.GVHD.equals(giangvien._id) ){
                    check = 1;
                    let i = 0;
                    element.SVChinhThuc.forEach((data) => {
                        if ( data.MaSV.includes(MaSV) ){
                            element.SVChinhThuc.splice(i,1);
                            return;
                        }
                        i++;
                    });
                    let trangthai = "";
                    if (element.SVChinhThuc.length == 2 )
                        trangthai = DeTaiKhoaLuan.DaDu;
                    else
                        trangthai = DeTaiKhoaLuan.ChuaDu;
                    element.TrangThaiDeTai = trangthai;
                    return;
                }
            });
            if ( check == 1 )
                await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: isExist.DSDeTai });
            else
                return sendError(res, "Đề tài này không tồn tại.")
        }
        else
            return sendError(res, "Thông tin này không tồn tại nên không thể xóa.");

        return sendSuccess(res, "Xóa thông tin sinh viên đăng ký khóa luận thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/ThemDeTaiKhoaLuan/{MaKLTN}
 * @description Thêm đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/ThemDeTaiKhoaLuan/:MaKLTN', async (req, res) => {
    try{
        const errors = KtraDuLieuKLTNKhiThemDeTaiKhoaLuan(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenDeTai, MaGV } = req.body;
        const { MaKLTN } = req.params;

        const isExist = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký khóa luận tốt nghiệp không tồn tại");
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại trong hệ thống");

        let thongtin = {
            TenDeTai: TenDeTai,
            GVHD: giangvien._id,
            SVChinhThuc: [],
            SVDuKien: [],
        }
        let check = 0;
        if (isExist.DSDeTai.length > 0){
            isExist.DSDeTai.forEach((element) => {
                if ( element.TenDeTai.includes(TenDeTai) && element.GVHD.equals(giangvien._id) ){
                    check = 1;
                    return;
                }
            });
            if ( check == 1 )
                return sendError(res, "Đề tài này đã tồn tại.");
            else{
                isExist.DSDeTai.push(thongtin);
                await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: isExist.DSDeTai });
            }
        }
        else{
            isExist.DSDeTai.push(thongtin);
            await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: isExist.DSDeTai });
        }

        return sendSuccess(res, "Thêm đề tài khóa luận thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/ChinhSuaTenDeTaiKhoaLuan/{MaKLTN}
 * @description Chỉnh sửa tên đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/ChinhSuaTenDeTaiKhoaLuan/:MaKLTN', async (req, res) => {
    try{
        const errors = KtraDuLieuKLTNKhiChinhSuaDeTaiKhoaLuan(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenDeTaiCu, TenDeTaiMoi, MaGV } = req.body;
        const { MaKLTN } = req.params;

        const isExist = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký khóa luận tốt nghiệp không tồn tại");
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại trong hệ thống");

        let check = 0;
        if (isExist.DSDeTai.length > 0){
            isExist.DSDeTai.forEach((element) => {
                if ( element.TenDeTai.includes(TenDeTaiCu) && element.GVHD.equals(giangvien._id) ){
                    check = 1;
                    element.TenDeTai = TenDeTaiMoi;
                    return;
                }
            });
            if ( check == 1 )
                await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: isExist.DSDeTai });
            else
                return sendError(res, "Không tồn tại đề tài này để sửa tên đề tài");
        }
        else
            return sendError(res, "Không tồn tại đề tài này để sửa tên đề tài");

        return sendSuccess(res, "Chỉnh sửa tên đề tài khóa luận thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/XoaDeTaiKhoaLuan/{MaKLTN}
 * @description Xóa đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/XoaDeTaiKhoaLuan/:MaKLTN', async (req, res) => {
    try{
        const errors = KtraDuLieuKLTNKhiXoaDeTaiKhoaLuan(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenDeTai, MaGV } = req.body;
        const { MaKLTN } = req.params;

        const isExist = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký khóa luận tốt nghiệp không tồn tại");
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại trong hệ thống");

        if (isExist.DSDeTai.length > 0){
            let i = 0;
            isExist.DSDeTai.forEach((element) => {
                if ( element.TenDeTai.includes(TenDeTai) && element.GVHD.equals(giangvien._id) ){
                    isExist.DSDeTai.splice(i,1);
                    return;
                }
                i++;
            });
            await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: isExist.DSDeTai });
        }
        else
            return sendError(res, "Thông tin này không tồn tại nên không thể xóa.");

        return sendSuccess(res, "Xóa đề tài khóa luận thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/khoa-luan-tot-nghiep/TuDongCapNhatTrangThaiKLTN
 * @description Tự động cập nhập trạng thái của các đợt đăng ký khóa luận tốt nghiệp
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.get('/TuDongCapNhatTrangThaiKLTN', async (req, res) => {
    try{

        const kltn = await KhoaLuanTotNghiep.find({ TrangThai: { $in: [TrangThaiDangKyKLTN.ChuaToiThoiGianDangKy, TrangThaiDangKyKLTN.TrongThoiGianDangKy]} }).lean();
        const date = new Date();
        const now = new Date(DoiDinhDangNgay(date));
        if (kltn.length > 0){
            let trangthai = "";
            for(let i = 0; i< kltn.length; i++){
                trangthai = "";
                if ( now < kltn[i].ThoiGianBD && now < kltn[i].ThoiGianKT)
                    trangthai = TrangThaiDangKyKLTN.ChuaToiThoiGianDangKy;
                if ( kltn[i].ThoiGianBD <= now && now <= kltn[i].ThoiGianKT)
                    trangthai = TrangThaiDangKyKLTN.TrongThoiGianDangKy;
                if ( now > kltn[i].ThoiGianBD && now > kltn[i].ThoiGianKT)
                    trangthai = TrangThaiDangKyKLTN.HetThoiGianDangKy
                await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: kltn[i].MaKLTN }, { TrangThai: trangthai });
            }
        }
        return sendSuccess(res, "Tự động cập nhập trạng thái thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/khoa-luan-tot-nghiep/ExportFileExcelDsDeTai/{MaKLTN}
 * @description Export file danh sách đề tài và sinh viên đăng ký đề tài
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.get('/ExportFileExcelDsDeTai/:MaKLTN', async (req, res) => {
    try{
        const { MaKLTN } = req.params;
        const now = new Date();

        const kltn = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).populate([
            {
                path: "Nganh",
                select: "MaNganh TenNganh",
            },
            {
                path: "DSDeTai",
                select: "GVHD",
                populate: [
                    {
                        path: "GVHD",
                        select: "MaGV HoGV TenGV DonViCongTac"
                    },
                ]
            },
        ]).lean();
        if (!kltn)
            return sendError(res, "Đợt khóa luận tốt nghiệp này không tồn tại");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('DS Đăng ký');

        worksheet.getColumn("A").width = 5;
        worksheet.getColumn("B").width = 27;
        worksheet.getColumn("C").width = 14;
        worksheet.getColumn("D").width = 8;
        worksheet.getColumn("E").width = 10;
        worksheet.getColumn("F").width = 30;
        worksheet.getColumn("G").width = 14;
        worksheet.getColumn("H").width = 61;
        worksheet.getColumn("I").width = 19;
        worksheet.getColumn("J").width = 20;
        worksheet.getColumn("K").width = 18;
        worksheet.getColumn("L").width = 9;
        worksheet.getColumn("M").width = 10;

        worksheet.getRow(7).height = 28;
        worksheet.getRow(8).height = 28;

        const sizeFont = 12;
        const fontType = "Times New Roman";
        const borderRound = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };

        worksheet.mergeCells('A2:M2');
        const row2 = worksheet.getRow(2).getCell(1);
        row2.value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
        row2.alignment = { vertical: 'middle', horizontal: 'center' };
        row2.font = { bold: true, size: sizeFont, name: fontType }

        worksheet.mergeCells('A3:M3');
        const row3 = worksheet.getRow(3).getCell(1);
        row3.value = "Độc lập – Tự do – Hạnh phúc";
        row3.alignment = { vertical: 'middle', horizontal: 'center' };
        row3.font = { size: sizeFont, name: fontType }

        worksheet.mergeCells('A4:M4');
        const row4 = worksheet.getRow(4).getCell(1);
        row4.value = "Thành phố Hồ Chí Minh, ngày.....tháng.....năm " + now.getFullYear();
        row4.alignment = { vertical: 'middle', horizontal: 'center' };
        row4.font = { size: sizeFont, name: fontType }

        worksheet.mergeCells('A5:M5');
        const row5 = worksheet.getRow(5).getCell(1);
        row5.value = kltn.Ten;
        row5.alignment = { vertical: 'middle', horizontal: 'center' };
        row5.font = { bold: true, size: sizeFont, name: fontType }

        worksheet.mergeCells('A6:M6');
        const row6 = worksheet.getRow(6).getCell(1);
        row6.value = "Ngành: " + kltn.Nganh.TenNganh + ". Khoa: Công nghệ Thông tin";
        row6.alignment = { vertical: 'middle', horizontal: 'center' };
        row6.font = { size: sizeFont, name: fontType }

        worksheet.mergeCells('A7:A8');
        const stt = worksheet.getRow(7).getCell(1);
        stt.value = "STT";
        stt.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        stt.font = { bold: true, size: sizeFont, name: fontType }
        stt.border = borderRound;

        worksheet.mergeCells('B7:C7');
        const svThucHienDeTai = worksheet.getRow(7).getCell("B");
        svThucHienDeTai.value = "Sinh viên thực hiện đề tài";
        svThucHienDeTai.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        svThucHienDeTai.font = { bold: true, size: sizeFont, name: fontType }
        svThucHienDeTai.border = borderRound

        const hotensv = worksheet.getRow(8).getCell("B");
        hotensv.value = "Họ tên sinh viên";
        hotensv.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        hotensv.font = { bold: true, size: sizeFont, name: fontType }
        hotensv.border = borderRound

        const masosv = worksheet.getRow(8).getCell("C");
        masosv.value = "Mã số SV";
        masosv.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        masosv.font = { bold: true, size: sizeFont, name: fontType }
        masosv.border = borderRound

        worksheet.mergeCells('D7:D8');
        const sotinchi = worksheet.getRow(7).getCell("D");
        sotinchi.value = "Số tín chỉ tích lũy";
        sotinchi.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        sotinchi.font = { bold: true, size: sizeFont, name: fontType }
        sotinchi.border = borderRound

        worksheet.mergeCells('E7:E8');
        const dtbtl = worksheet.getRow(7).getCell("E");
        dtbtl.value = "Điểm TB tích lũy hệ 4";
        dtbtl.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        dtbtl.font = { bold: true, size: sizeFont, name: fontType }
        dtbtl.border = borderRound

        worksheet.mergeCells('F7:F8');
        const email = worksheet.getRow(7).getCell("F");
        email.value = "Email";
        email.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        email.font = { bold: true, size: sizeFont, name: fontType }
        email.border = borderRound

        worksheet.mergeCells('G7:G8');
        const sdt = worksheet.getRow(7).getCell("G");
        sdt.value = "Điện thoại";
        sdt.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        sdt.font = { bold: true, size: sizeFont, name: fontType }
        sdt.border = borderRound

        worksheet.mergeCells('H7:H8');
        const tendetai = worksheet.getRow(7).getCell("H");
        tendetai.value = "Tên đề tài";
        tendetai.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        tendetai.font = { bold: true, size: sizeFont, name: fontType }
        tendetai.border = borderRound

        worksheet.mergeCells('I7:J7');
        const gvhuongdan = worksheet.getRow(7).getCell("I");
        gvhuongdan.value = "Giảng viên hướng dẫn";
        gvhuongdan.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        gvhuongdan.font = { bold: true, size: sizeFont, name: fontType }
        gvhuongdan.border = borderRound

        const hotengv = worksheet.getRow(8).getCell("I");
        hotengv.value = "Họ tên";
        hotengv.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        hotengv.font = { bold: true, size: sizeFont, name: fontType }
        hotengv.border = borderRound

        const dvcongtac = worksheet.getRow(8).getCell("J");
        dvcongtac.value = "Đơn vị công tác";
        dvcongtac.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        dvcongtac.font = { bold: true, size: sizeFont, name: fontType }
        dvcongtac.border = borderRound

        worksheet.mergeCells('K7:K8');
        const ngaybaocao = worksheet.getRow(7).getCell("K");
        ngaybaocao.value = "Ngày báo cáo";
        ngaybaocao.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        ngaybaocao.font = { bold: true, size: sizeFont, name: fontType }
        ngaybaocao.border = borderRound

        worksheet.mergeCells('L7:L8');
        const diem = worksheet.getRow(7).getCell("L");
        diem.value = "Điểm";
        diem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        diem.font = { bold: true, size: sizeFont, name: fontType }
        diem.border = borderRound

        worksheet.mergeCells('M7:M8');
        const ghichu = worksheet.getRow(7).getCell("M");
        ghichu.value = "Ghi chú";
        ghichu.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        ghichu.font = { bold: true, size: sizeFont, name: fontType }
        ghichu.border = borderRound

        let i = 9;
        let dem = 1;
        kltn.DSDeTai.forEach((element) => {
            if (element.SVChinhThuc.length == 2){
                worksheet.getRow(i).height = 28;
                worksheet.getRow(i+1).height = 28;

                worksheet.mergeCells( 'A' + i + ':A' + (i+1) );
                worksheet.getRow(i).getCell("A").value = dem;

                worksheet.getRow(i).getCell("B").value = element.SVChinhThuc[0].HoSV + " " + element.SVChinhThuc[0].TenSV;
                worksheet.getRow(i+1).getCell("B").value = element.SVChinhThuc[1].HoSV + " " + element.SVChinhThuc[1].TenSV;

                worksheet.getRow(i).getCell("C").value = element.SVChinhThuc[0].MaSV;
                worksheet.getRow(i+1).getCell("C").value = element.SVChinhThuc[1].MaSV;

                worksheet.getRow(i).getCell("D").value = element.SVChinhThuc[0].TinChiTL;
                worksheet.getRow(i+1).getCell("D").value = element.SVChinhThuc[1].TinChiTL;

                worksheet.getRow(i).getCell("E").value = element.SVChinhThuc[0].DTBTL;
                worksheet.getRow(i+1).getCell("E").value = element.SVChinhThuc[1].DTBTL;

                worksheet.getRow(i).getCell("F").value = element.SVChinhThuc[0].Email;
                worksheet.getRow(i+1).getCell("F").value = element.SVChinhThuc[1].Email;

                worksheet.getRow(i).getCell("G").value = element.SVChinhThuc[0].SoDienThoai;
                worksheet.getRow(i+1).getCell("G").value = element.SVChinhThuc[1].SoDienThoai;

                worksheet.mergeCells( 'H' + i + ':H' + (i+1) );
                worksheet.getRow(i).getCell("H").value = element.TenDeTai;

                worksheet.mergeCells( 'I' + i + ':I' + (i+1) );
                worksheet.getRow(i).getCell("I").value = element.GVHD.HoGV + " " + element.GVHD.TenGV;

                worksheet.mergeCells( 'J' + i + ':J' + (i+1) );
                worksheet.getRow(i).getCell("J").value = element.GVHD.DonViCongTac;

                worksheet.mergeCells( 'K' + i + ':K' + (i+1) );
                worksheet.getRow(i).getCell("K").value = "";

                worksheet.mergeCells( 'L' + i + ':L' + (i+1) );
                worksheet.getRow(i).getCell("L").value = "";

                worksheet.mergeCells( 'M' + i + ':M' + (i+1) );
                worksheet.getRow(i).getCell("M").value = "";
                i++;
            }
            if (element.SVChinhThuc.length == 1){
                worksheet.getRow(i).height = 28;

                worksheet.mergeCells( 'A' + i + ':A' + (i+1) );
                worksheet.getRow(i).getCell("A").value = dem;

                worksheet.mergeCells( 'B' + i + ':B' + (i+1) );
                worksheet.getRow(i).getCell("B").value = element.SVChinhThuc[0].HoSV + " " + element.SVChinhThuc[0].TenSV;

                worksheet.mergeCells( 'C' + i + ':C' + (i+1) );
                worksheet.getRow(i).getCell("C").value = element.SVChinhThuc[0].MaSV;

                worksheet.mergeCells( 'D' + i + ':D' + (i+1) );
                worksheet.getRow(i).getCell("D").value = element.SVChinhThuc[0].TinChiTL;

                worksheet.mergeCells( 'E' + i + ':E' + (i+1) );
                worksheet.getRow(i).getCell("E").value = element.SVChinhThuc[0].DTBTL;

                worksheet.mergeCells( 'F' + i + ':F' + (i+1) );
                worksheet.getRow(i).getCell("F").value = element.SVChinhThuc[0].Email;

                worksheet.mergeCells( 'G' + i + ':G' + (i+1) );
                worksheet.getRow(i).getCell("G").value = element.SVChinhThuc[0].SoDienThoai;

                worksheet.mergeCells( 'H' + i + ':H' + (i+1) );
                worksheet.getRow(i).getCell("H").value = element.TenDeTai;

                worksheet.mergeCells( 'I' + i + ':I' + (i+1) );
                worksheet.getRow(i).getCell("I").value = element.GVHD.HoGV + " " + element.GVHD.TenGV;

                worksheet.mergeCells( 'J' + i + ':J' + (i+1) );
                worksheet.getRow(i).getCell("J").value = element.GVHD.DonViCongTac;

                worksheet.mergeCells( 'K' + i + ':K' + (i+1) );
                worksheet.getRow(i).getCell("K").value = "";

                worksheet.mergeCells( 'L' + i + ':L' + (i+1) );
                worksheet.getRow(i).getCell("L").value = "";

                worksheet.mergeCells( 'M' + i + ':M' + (i+1) );
                worksheet.getRow(i).getCell("M").value = "";
                i++;
            }
            if (element.SVChinhThuc.length == 0){
                worksheet.getRow(i).height = 28;
                worksheet.getRow(i+1).height = 28;
                
                worksheet.mergeCells( 'A' + i + ':A' + (i+1) );
                worksheet.getRow(i).getCell("A").value = dem;
                
                worksheet.getRow(i).getCell("B").value = "";
                worksheet.getRow(i+1).getCell("B").value = "";

                worksheet.getRow(i).getCell("C").value = "";
                worksheet.getRow(i+1).getCell("C").value = "";

                worksheet.getRow(i).getCell("D").value = "";
                worksheet.getRow(i+1).getCell("D").value = "";

                worksheet.getRow(i).getCell("E").value = "";
                worksheet.getRow(i+1).getCell("E").value = "";

                worksheet.getRow(i).getCell("F").value = "";
                worksheet.getRow(i+1).getCell("F").value = "";

                worksheet.getRow(i).getCell("G").value = "";
                worksheet.getRow(i+1).getCell("G").value = "";

                worksheet.mergeCells( 'H' + i + ':H' + (i+1) );
                worksheet.getRow(i).getCell("H").value = element.TenDeTai;

                worksheet.mergeCells( 'I' + i + ':I' + (i+1) );
                worksheet.getRow(i).getCell("I").value = element.GVHD.HoGV + " " + element.GVHD.TenGV;

                worksheet.mergeCells( 'J' + i + ':J' + (i+1) );
                worksheet.getRow(i).getCell("J").value = element.GVHD.DonViCongTac;

                worksheet.mergeCells( 'K' + i + ':K' + (i+1) );
                worksheet.getRow(i).getCell("K").value = "";

                worksheet.mergeCells( 'L' + i + ':L' + (i+1) );
                worksheet.getRow(i).getCell("L").value = "";

                worksheet.mergeCells( 'M' + i + ':M' + (i+1) );
                worksheet.getRow(i).getCell("M").value = "";
                i++;
            }
            dem++;
            i++;
        });
        for (let k = 9; k < i; k++){
            worksheet.getRow(k).eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.font = { size: sizeFont, name: fontType }
                cell.border = borderRound
            });
        };

        // Xuất file Excel
        await res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet")
        await res.setHeader("Content-Disposition", `attachment; filename=DSDangKyKhoaLuan.xlsx`)
        return workbook.xlsx.write(res)
            .then(() => {
                res.status(200)
            })
            .catch((error) => {
                console.error('Lỗi khi xuất file Excel:', error);
            });
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/CongBoDeTaiKhoaLuan/{MaKLTN}
 * @description Công bố danh sách đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/CongBoDeTaiKhoaLuan/:MaKLTN', async (req, res) => {
    try{
        const { MaKLTN } = req.params;
        const kltn = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (kltn.length <= 0)
            return sendError(res, "Mã khóa luận tốt nghiệp không tồn tại");

        await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { TrangThaiCongBo: TrangThaiCongBoKLTN.CongBo });
        
        return sendSuccess(res, "Công bố danh sách đề tài khóa luận thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/HuyCongBoDeTaiKhoaLuan/{MaKLTN}
 * @description Hủy công bố danh sách đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/HuyCongBoDeTaiKhoaLuan/:MaKLTN', async (req, res) => {
    try{
        const { MaKLTN } = req.params;
        const kltn = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).lean();
        if (!kltn)
            return sendError(res, "Mã khóa luận tốt nghiệp không tồn tại");

        await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { TrangThaiCongBo: TrangThaiCongBoKLTN.KhongCongBo });
        
        return sendSuccess(res, "Hủy công bố danh sách đề tài khóa luận thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/ImportKetQuaKLTN/{MaKLTN}
 * @description Import danh sách kết quả khóa luận tốt nghiệp
 * @access public
 */
KhoaLuanTotNghiepAdminRoute.post('/ImportKetQuaKLTN/:MaKLTN', createKhoaLuanDir, uploadFile.single("FileExcel"), async (req, res) => {
    try{
        const { MaKLTN } = req.params;
        const kltn = await KhoaLuanTotNghiep.findOne({ MaKLTN: MaKLTN }).populate([
            {
                path: "Nganh",
                select: "MaNganh TenNganh",
            },
            {
                path: "DSDeTai",
                select: "GVHD",
                populate: [
                    {
                        path: "GVHD",
                        select: "MaGV HoGV TenGV DonViCongTac"
                    },
                ]
            },
        ]).lean();
        if (!kltn)
            return sendError(res, "Đợt đăng ký khóa luận này không tồn tại");
        let thongtin = [];
        let fileName = path.join(__dirname, `../../public/KhoaLuan/${req.file.filename}`);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(fileName)
            .then(() => {
                const sheetCount = workbook.worksheets.length;
                for (let i = 1; i <= sheetCount; i++){
                    let k = 9;
                    const worksheet = workbook.getWorksheet(i);
                    worksheet.eachRow((row, rowNumber) => {
                        if ( rowNumber >= k ){
                            let data = {
                                tendetai: row.getCell("H").value,
                                giangvien: row.getCell("I").value,
                                ngay: row.getCell("K").value,
                                diem: Number(row.getCell("L").value),
                                ghichu: row.getCell("M").value
                            }
                            thongtin.push(data);
                            k = k + 2;
                        }
                        
                    });
                }
            })
            .catch(err => {
                console.error(err);
            });
        fs.unlinkSync(fileName, (err) => {
            console.log(err)
        })
        kltn.DSDeTai.forEach((element) => {
            let hotengv = element.GVHD.HoGV + " " + element.GVHD.TenGV;
            thongtin.forEach((data) => {
                if (element.TenDeTai.includes(data.tendetai) && hotengv.includes(data.giangvien)){
                    element.NgayBaoCao = data.ngay;
                    element.Diem = data.diem;
                    element.GhiChu = data.ghichu;
                }
            });
        });
        await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: kltn.DSDeTai });
        return sendSuccess(res, "Import file kết quả thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

export default KhoaLuanTotNghiepAdminRoute