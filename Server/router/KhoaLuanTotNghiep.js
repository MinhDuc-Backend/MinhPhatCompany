import express from "express"
import fs from 'fs'
import { sendError, sendServerError, sendSuccess } from "../helper/client.js"
import KhoaLuanTotNghiep from "../model/KhoaLuanTotNghiep.js"
import SinhVien from "../model/SinhVien.js"
import GiangVien from "../model/GiangVien.js"
import { KtraDuLieuKLTNKhiChinhSuaDeTaiKhoaLuan, KtraDuLieuKLTNKhiThemDeTaiKhoaLuan, KtraDuLieuKLTNKhiThemSVDangKyKhoaLuan, KtraDuLieuKLTNKhiXoaDeTaiKhoaLuan, KtraDuLieuKLTNKhiXoaSVDangKyKhoaLuan } from "../validation/KhoaLuanTotNghiep.js"
import { DeTaiKhoaLuan, TrangThaiCongBoKLTN, TrangThaiDangKyKLTN, TrangThaiKhoaLuan } from "../constant.js"
import { verifyToken, verifyUser } from "../middleware/verify.js"

const KhoaLuanTotNghiepRoute = express.Router()

/**
 * @route GET /api/khoa-luan-tot-nghiep/ThongTinKLTN
 * @description Lấy thông tin chi tiết khóa luận tốt nghiệp trong thời gian đăng ký
 * @access public
 */
KhoaLuanTotNghiepRoute.get('/ThongTinKLTN', verifyToken, verifyUser, async (req, res) => {
    try {
        const isExist = await KhoaLuanTotNghiep.findOne({ TrangThai: TrangThaiDangKyKLTN.TrongThoiGianDangKy }).populate([
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
 * @route POST /api/khoa-luan-tot-nghiep/DSDeTaiTheoGiangVien/{MaKLTN}
 * @description Lấy danh sách đề tài của giảng viên
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/DSDeTaiTheoGiangVien/:MaKLTN', verifyToken, verifyUser, async (req, res) => {
    try {
        const { MaKLTN } = req.params;
        const { MaGV } = req.body;
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
            return sendError(res, "Đợt khóa luận tốt nghiệp không tồn tại");
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại.");
        let thongtin = [];
        kltn.DSDeTai.forEach((element) => {
            if ( element.GVHD.MaGV == MaGV ){
                thongtin.push(element);
            }
        });

        return sendSuccess(res, "Danh sách đề tài của giảng viên.", thongtin);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/khoa-luan-tot-nghiep/SVDangKyDeTai/{MaKLTN}
 * @description Sinh viên đăng ký đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/SVDangKyDeTai/:MaKLTN', verifyToken, verifyUser, async (req, res) => {
    try {
        const { MaKLTN } = req.params;
        const { MaGV, TenDeTai, MaSV, HoSV, TenSV, Email, SoDienThoai, DTBTL, TinChiTL } = req.body;
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
            return sendError(res, "Đợt khóa luận tốt nghiệp không tồn tại");
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại.");
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV });
        if (!sinhvien)
            return sendError(res, "Sinh viên này không tồn tại trong hệ thống");
        if (sinhvien.TrangThaiKhoaLuan == TrangThaiKhoaLuan.DaDangKy)
            return sendError(res, "Bạn đã đăng ký khóa luận rồi.");
        const sv = {
            MaSV: MaSV,
            HoSV: HoSV,
            TenSV: TenSV,
            Email: Email,
            SoDienThoai: SoDienThoai,
            DTBTL: Number(DTBTL),
            TinChiTL: Number(TinChiTL)
        }
        kltn.DSDeTai.forEach((element) => {
            if ( element.GVHD.MaGV == MaGV && element.TenDeTai == TenDeTai ){
                element.SVDuKien.push(sv);
            }
        });
        await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: kltn.DSDeTai });
        await SinhVien.findOneAndUpdate({ MaSV: MaSV }, { TrangThaiKhoaLuan: TrangThaiKhoaLuan.DaDangKy });
        return sendSuccess(res, "Sinh viên đăng ký thành công.");
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/khoa-luan-tot-nghiep/GVChapNhanSVDangKy/{MaKLTN}
 * @description Giảng viên chấp nhận sinh viên đăng ký đề tài
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/GVChapNhanSVDangKy/:MaKLTN', verifyToken, verifyUser, async (req, res) => {
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
                                let i = 0;
                                element.SVDuKien.forEach((data) => {
                                    if ( data.MaSV.includes(MaSV) ){
                                        element.SVDuKien.splice(i,1);
                                        return;
                                    }
                                    i++;
                                });
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
 * @route POST /api/khoa-luan-tot-nghiep/GVXoaSVDangKyKLDuKien/{MaKLTN}
 * @description Xóa thông tin sinh viên đăng ký đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/GVXoaSVDangKyKLDuKien/:MaKLTN', verifyToken, verifyUser, async (req, res) => {
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
                    element.SVDuKien.forEach((data) => {
                        if ( data.MaSV.includes(MaSV) ){
                            element.SVDuKien.splice(i,1);
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
            if ( check == 1 ){
                await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: isExist.DSDeTai });
                await SinhVien.findOneAndUpdate({ MaSV: MaSV }, { TrangThaiKhoaLuan: TrangThaiKhoaLuan.ChuaDangKy });
            }
            else
                return sendError(res, "Đề tài này không tồn tại.")
        }
        else
            return sendError(res, "Thông tin này không tồn tại nên không thể xóa.");

        return sendSuccess(res, "Xóa thông tin sinh viên dự kiến đăng ký khóa luận thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khoa-luan-tot-nghiep/GVXoaSVDangKyKLChinhThuc/{MaKLTN}
 * @description Xóa thông tin sinh viên chính thức đăng ký đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/GVXoaSVDangKyKLChinhThuc/:MaKLTN', verifyToken, verifyUser, async (req, res) => {
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
            if ( check == 1 ){
                await KhoaLuanTotNghiep.findOneAndUpdate({ MaKLTN: MaKLTN }, { DSDeTai: isExist.DSDeTai });
                await SinhVien.findOneAndUpdate({ MaSV: MaSV }, { TrangThaiKhoaLuan: TrangThaiKhoaLuan.ChuaDangKy });
            }
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
 * @route POST /api/khoa-luan-tot-nghiep/ThongTinChiTietDetaiGV/{MaKLTN}
 * @description Lấy thông tin chi tiết đề tài khóa luận tốt nghiệp
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/ThongTinChiTietDetaiGV/:MaKLTN', async (req, res) => {
    try {
        const { MaKLTN } = req.params
        const { MaGV , TenDeTai } = req.body
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
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại.");
        let thongtin = null;
        isExist.DSDeTai.forEach((element) => {
            if ( element.GVHD.MaGV == MaGV && element.TenDeTai == TenDeTai ){
                thongtin = element;
            }
        });

        return sendSuccess(res, "Chi tiết thông tin đề tài khóa luận tốt nghiệp.", thongtin)
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/khoa-luan-tot-nghiep/DSDeTaiChuaDangKy/{MaKLTN}
 * @description Lấy danh sách đề tài chưa đăng ký
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/DSDeTaiChuaDangKy/:MaKLTN', verifyToken, verifyUser, async (req, res) => {
    try {
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
            return sendError(res, "Đợt khóa luận tốt nghiệp không tồn tại");
        let thongtin = [];
        kltn.DSDeTai.forEach((element) => {
            if ( element.SVChinhThuc.length < 2){
                thongtin.push(element);
            }
        });

        return sendSuccess(res, "Danh sách đề tài chưa đăng ký.", thongtin);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/khoa-luan-tot-nghiep/ThemDeTaiKhoaLuan/{MaKLTN}
 * @description Thêm đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/ThemDeTaiKhoaLuan/:MaKLTN', async (req, res) => {
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
 * @route POST /api/khoa-luan-tot-nghiep/ChinhSuaTenDeTaiKhoaLuan/{MaKLTN}
 * @description Chỉnh sửa tên đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/ChinhSuaTenDeTaiKhoaLuan/:MaKLTN', async (req, res) => {
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
 * @route POST /api/khoa-luan-tot-nghiep/XoaDeTaiKhoaLuan/{MaKLTN}
 * @description Xóa đề tài khóa luận
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/XoaDeTaiKhoaLuan/:MaKLTN', async (req, res) => {
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
 * @route POST /api/khoa-luan-tot-nghiep/DSDeTaiChuaDangKyTheoGiangVien/{MaKLTN}
 * @description Lấy danh sách đề tài chưa đăng ký của giảng viên
 * @access public
 */
KhoaLuanTotNghiepRoute.post('/DSDeTaiChuaDangKyTheoGiangVien/:MaKLTN', verifyToken, verifyUser, async (req, res) => {
    try {
        const { MaKLTN } = req.params;
        const { MaGV } = req.body;
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
            return sendError(res, "Đợt khóa luận tốt nghiệp không tồn tại");
        const giangvien = await GiangVien.findOne({ MaGV: MaGV });
        if (!giangvien)
            return sendError(res, "Giảng viên này không tồn tại.");
        let thongtin = [];
        kltn.DSDeTai.forEach((element) => {
            if ( element.GVHD.MaGV == MaGV && element.SVChinhThuc.length < 2 ){
                thongtin.push(element);
            }
        });

        return sendSuccess(res, "Danh sách đề tài chưa đăng ký của giảng viên.", thongtin);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/khoa-luan-tot-nghiep/DSKLDuocCongBo
 * @description Các danh sách đề tài khóa luận được công bố
 * @access public
 */
KhoaLuanTotNghiepRoute.get('/DSKLDuocCongBo', async (req, res) => {
    try {
        const kltn = await KhoaLuanTotNghiep.find({ TrangThaiCongBo: TrangThaiCongBoKLTN.CongBo }).lean();
        if (kltn.length <= 0)
            return sendError(res, "Không tồn tại danh sách được công bố");

        return sendSuccess(res, "Danh sách đề tài được công bố.", kltn);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/khoa-luan-tot-nghiep/ChiTietDSDeTaiCongBo/{MaKLTN}
 * @description Chi tiết danh sách đề tài khóa luận được công bố
 * @access public
 */
KhoaLuanTotNghiepRoute.get('/ChiTietDSDeTaiCongBo/:MaKLTN', async (req, res) => {
    try {
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
            return sendError(res, "Đợt khóa luận tốt nghiệp không tồn tại");

        return sendSuccess(res, "Chi tiết danh sách đề tài được công bố.", kltn);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default KhoaLuanTotNghiepRoute