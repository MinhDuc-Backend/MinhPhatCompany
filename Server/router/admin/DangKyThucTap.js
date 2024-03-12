import express from "express"
import fs from 'fs'
import argon2 from "argon2"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { CapTaiKhoanChoSinhVienKhiImportFile, TrangThaiDangKyThucTap, TrangThaiSinhVien } from "../../constant.js"
import DangKyThucTap from "../../model/DangKyThucTap.js"
import { DoiDinhDangNgay, XuLyNgaySinh } from "../../helper/XuLyDuLieu.js"
import Nganh from "../../model/Nganh.js"
import ChuyenNganh from "../../model/ChuyenNganh.js"
import QuyenTaiKhoan from "../../model/QuyenTaiKhoan.js"
import TaiKhoan from "../../model/TaiKhoan.js"
import SinhVien from "../../model/SinhVien.js"
import { KtraDuLieuDKTTKhiChinhSua, KtraDuLieuDKTTKhiThem, KtraKhiThemCongTyTrongDS, KtraKhiThemViTriCongTyTrongDS, KtraKhiXoaCongTyTrongDS, KtraKhiXoaViTriCongTyTrongDS } from "../../validation/DangKyThucTap.js"
import ExcelJS from 'exceljs'
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createThucTapDir } from "../../middleware/createDir.js"
import { uploadFile } from "../../middleware/storage.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DangKyThucTapAdminRoute = express.Router()

/**
 * @route GET /api/admin/dk-thuc-tap/DanhSachDKTT
 * @description Lấy danh sách đợt đăng ký thực tập
 * @access public
 */
DangKyThucTapAdminRoute.get('/DanhSachDKTT', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaDKTT: { $regex: keyword, $options: "i" } },
                    { Ten: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const dktt = await DangKyThucTap.find({ $and: [keywordCondition] }).limit(pageSize).skip(pageSize * page)
        const length = await DangKyThucTap.find({ $and: [keywordCondition] }).count();

        if (dktt.length == 0) 
            return sendError(res, "Không tìm thấy danh sách đợt đăng ký thực tập.")
        if (dktt) 
            return sendSuccess(res, "Lấy danh sách đợt đăng ký thực tập thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: dktt
            })

        return sendError(res, "Không tìm thấy danh sách đợt đăng ký thực tập.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/dk-thuc-tap/ChiTietDKTT/{MaDKTT}
 * @description Lấy thông tin chi tiết đăng ký thực tập
 * @access public
 */
DangKyThucTapAdminRoute.get('/ChiTietDKTT/:MaDKTT', async (req, res) => {
    try {
        const { MaDKTT } = req.params
        const isExist = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại"); 

        return sendSuccess(res, "Chi tiết thông tin đăng ký thực tập.", isExist)
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-thuc-tap/Them
 * @description Thêm đợt đăng ký thực tập
 * @access public
 */
DangKyThucTapAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuDKTTKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaDKTT, Ten, NienKhoa, ThoiGianBD, ThoiGianKT } = req.body;

        const isExistMa = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).lean();
        if (isExistMa)
            return sendError(res, "Mã đăng ký thực tập đã tồn tại");
        const date = new Date();
        const now = new Date(DoiDinhDangNgay(date));
        const bd = new Date(ThoiGianBD);
        const kt = new Date(ThoiGianKT);
        if (kt < bd)
            return sendError(res, "Ngày kết thúc phải lớn hơn ngày bắt đầu");
        let check = 0;
        const data = await DangKyThucTap.find({});
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
            return sendError(res, "Có đợt đăng ký thực tập khác trong khoảng thời gian này. Vui lòng chọn khoảng thời gian khác.");
        let trangthai = "";
        if ( now < bd && now < kt)
            trangthai = TrangThaiDangKyThucTap.ChuaToiThoiGianDangKy;
        if ( bd <= now && now <= kt)
            trangthai = TrangThaiDangKyThucTap.TrongThoiGianDangKy;
        if ( now > bd && now > kt)
            trangthai = TrangThaiDangKyThucTap.HetThoiGianDangKy

        const dktt = await DangKyThucTap.create({ MaDKTT: MaDKTT, Ten: Ten, NienKhoa: NienKhoa, ThoiGianBD: ThoiGianBD, ThoiGianKT: ThoiGianKT, TrangThai: trangthai });
        return sendSuccess(res, "Thêm đợt đăng ký thực tập thành công", dktt);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/dk-thuc-tap/ChinhSua/{MaDKTT}
 * @description Chỉnh sửa đợt đăng ký chuyên ngành
 * @access public
 */
DangKyThucTapAdminRoute.put('/ChinhSua/:MaDKTT', async (req, res) => {
    try{
        const errors = KtraDuLieuDKTTKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { Ten, NienKhoa, ThoiGianBD, ThoiGianKT } = req.body;
        const { MaDKTT } = req.params;

        const isExistMa = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).lean();
        if (!isExistMa)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");
        const date = new Date();
        const now = new Date(DoiDinhDangNgay(date));
        const bd = new Date(ThoiGianBD);
        const kt = new Date(ThoiGianKT);
        if (kt < bd)
            return sendError(res, "Ngày kết thúc phải lớn hơn ngày bắt đầu");
        let check = 0;
        const data = await DangKyThucTap.find({});
        if (data.length > 0){
            data.forEach((element) => {
                if (element.MaDKTT != MaDKTT){
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
            return sendError(res, "Có đợt đăng ký thực tập khác trong khoảng thời gian này. Vui lòng chọn khoảng thời gian khác.");
        let trangthai = "";
        if ( now < bd && now < kt)
            trangthai = TrangThaiDangKyThucTap.ChuaToiThoiGianDangKy;
        if ( bd <= now && now <= kt)
            trangthai = TrangThaiDangKyThucTap.TrongThoiGianDangKy;
        if ( now > bd && now > kt)
            trangthai = TrangThaiDangKyThucTap.HetThoiGianDangKy

        await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { Ten: Ten, NienKhoa: NienKhoa, ThoiGianBD: ThoiGianBD, ThoiGianKT: ThoiGianKT, TrangThai: trangthai });
        return sendSuccess(res, "Chỉnh sửa đợt đăng ký thực tập thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/dk-thuc-tap/Xoa/{MaDKTT}
 * @description Xóa đợt đăng ký thực tập
 * @access private
 */
DangKyThucTapAdminRoute.delete('/Xoa/:MaDKTT', async (req, res) => {
    try {
        const { MaDKTT } = req.params
        const isExist = await DangKyThucTap.findOne({ MaDKTT: MaDKTT })
        if (!isExist) 
            return sendError(res, "Đợt đăng ký thực tập này không tồn tại");
        await DangKyThucTap.findOneAndDelete({ MaDKTT: MaDKTT });
        return sendSuccess(res, "Xóa đợt đăng ký thực tập thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-thuc-tap/ThemCongTyTrongDanhSach/{MaDKTT}
 * @description Thêm công ty trong danh sách
 * @access public
 */
DangKyThucTapAdminRoute.post('/ThemCongTyTrongDanhSach/:MaDKTT', async (req, res) => {
    try{
        const errors = KtraKhiThemCongTyTrongDS(req.body)
        if (errors)
            return sendError(res, errors)
        const { Ho, Ten, TenCongTy, Website, SoDienThoai, Email, DiaChi } = req.body;
        const { MaDKTT } = req.params;

        const isExist = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");

        let thongtin = {
            HoNguoiLienHe: Ho,
            TenNguoiLienHe: Ten,
            TenCongTy: TenCongTy,
            Website: Website,
            SoDienThoai: SoDienThoai,
            Email: Email,
            DiaChi: DiaChi,
            DangKy: [],
        }
        let check = 0;
        if (isExist.CongTyTrongDS.length > 0){
            isExist.CongTyTrongDS.forEach((element) => {
                if ( element.SoDienThoai.includes(SoDienThoai) )
                    check = 1;
            });
            if ( check == 1 )
                return sendError(res, "Công ty này đã tồn tại trong danh sách");
            else{
                isExist.CongTyTrongDS.push(thongtin);
                await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyTrongDS: isExist.CongTyTrongDS });
            }
        }
        else{
            isExist.CongTyTrongDS.push(thongtin);
            await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyTrongDS: isExist.CongTyTrongDS });
        }

        return sendSuccess(res, "Thêm công ty trong danh sách thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-thuc-tap/XoaCongTyTrongDanhSach/{MaDKTT}
 * @description Xóa công ty trong danh sách đăng ký thực tập
 * @access public
 */
DangKyThucTapAdminRoute.post('/XoaCongTyTrongDanhSach/:MaDKTT', async (req, res) => {
    try{
        const errors = KtraKhiXoaCongTyTrongDS(req.body)
        if (errors)
            return sendError(res, errors)
        const { Email } = req.body;
        const { MaDKTT } = req.params;

        const isExist = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");

        if (isExist.CongTyTrongDS.length > 0){
            let i = 0;
            isExist.CongTyTrongDS.forEach((element) => {
                if ( element.Email.includes(Email) ){
                    isExist.CongTyTrongDS.splice(i,1);
                    return;
                }
                i++;
            });
            await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyTrongDS: isExist.CongTyTrongDS });
        }
        else
            return sendError(res, "Thông tin này không tồn tại nên không thể xóa.");

        return sendSuccess(res, "Xóa công ty trong danh sách thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-thuc-tap/DanhSachCongTy/{MaDKTT}
 * @description Lấy danh sách công ty đợt đăng ký thực tập
 * @access public
 */
DangKyThucTapAdminRoute.post('/DanhSachCongTy/:MaDKTT', async (req, res) => {
    try {
        const { MaDKTT } = req.params;
        const { Loai } = req.body;
        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT });
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");

        let thongtin = [];
        if (Loai == "Trong danh sách"){
            dktt.CongTyTrongDS.forEach((element) => {
                let cty = {
                    id: element._id,
                    HoNguoiLienHe: element.HoNguoiLienHe,
                    TenNguoiLienHe: element.TenNguoiLienHe,
                    Ten: element.TenCongTy,
                    Web: element.Website,
                    DienThoai: element.SoDienThoai,
                    Email: element.Email,
                    DiaChi: element.DiaChi,
                }
                thongtin.push(cty);
            });
        }
        if (Loai == "Ngoài danh sách"){
            dktt.CongTyNgoaiDS.forEach((element) => {
                let cty = {
                    id: element._id,
                    HoNguoiLienHe: element.HoNguoiLienHe,
                    TenNguoiLienHe: element.TenNguoiLienHe,
                    Ten: element.TenCongTy,
                    Web: element.Website,
                    DienThoai: element.SoDienThoai,
                    Email: element.Email,
                    DiaChi: element.DiaChi,
                }
                thongtin.push(cty);
            });
        }
        return sendSuccess(res, "Lấy danh sách công ty thành công", thongtin);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-thuc-tap/DanhSachSinhVien/{MaDKTT}
 * @description Lấy danh sách sinh viên đợt đăng ký thực tập
 * @access public
 */
DangKyThucTapAdminRoute.post('/DanhSachSinhVien/:MaDKTT', async (req, res) => {
    try {
        const { MaDKTT } = req.params;
        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).populate([
            {
                path: "CongTyTrongDS",
                select: "DangKy",
                populate: [
                    {
                        path: "DangKy",
                        select: "SinhVien",
                        populate: [
                            {
                                path: "SinhVien",
                                select: "MaSV HoSV TenSV Lop"
                            }
                        ]
                    }
                ]
            },
            {
                path: "CongTyNgoaiDS",
                select: "SinhVien",
                populate: [
                    {
                        path: "SinhVien",
                        select: "MaSV HoSV TenSV Lop",
                    }
                ]
            }
        ]).lean();
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");

        let thongtin = [];
        dktt.CongTyTrongDS.forEach((element) => {
            element.DangKy.forEach((data) => {
                data.SinhVien.forEach((sinhvien) => {
                    let sv = {
                        MaSV: sinhvien.MaSV,
                        Ho: sinhvien.HoSV,
                        Ten: sinhvien.TenSV,
                        Lop: sinhvien.Lop,
                        Cty: element.TenCongTy,
                        Web: element.Website,
                        DienThoai: element.SoDienThoai,
                        Email: element.Email,
                        DiaChi: element.DiaChi
                    }
                    thongtin.push(sv);
                });
            });
        });

        dktt.CongTyNgoaiDS.forEach((element) => {
            let sv = {
                MaSV: element.SinhVien.MaSV,
                Ho: element.SinhVien.HoSV,
                Ten: element.SinhVien.TenSV,
                Lop: element.SinhVien.Lop,
                Cty: element.TenCongTy,
                Web: element.Website,
                DienThoai: element.SoDienThoai,
                Email: element.Email,
                DiaChi: element.DiaChi
            }
            thongtin.push(sv);
        });
        
        return sendSuccess(res, "Lấy danh sách sinh viên thành công", thongtin);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/dk-thuc-tap/TuDongCapNhatTrangThaiDKTT
 * @description Tự động cập nhập trạng thái của các đợt đăng ký thực tập
 * @access public
 */
DangKyThucTapAdminRoute.get('/TuDongCapNhatTrangThaiDKTT', async (req, res) => {
    try{

        const dktt = await DangKyThucTap.find({ TrangThai: { $in: [TrangThaiDangKyThucTap.ChuaToiThoiGianDangKy, TrangThaiDangKyThucTap.TrongThoiGianDangKy]} }).lean();
        const date = new Date();
        const now = new Date(DoiDinhDangNgay(date));
        if (dktt.length > 0){
            let trangthai = "";
            for(let i = 0; i< dktt.length; i++){
                trangthai = "";
                if ( now < dktt[i].ThoiGianBD && now < dktt[i].ThoiGianKT)
                    trangthai = TrangThaiDangKyThucTap.ChuaToiThoiGianDangKy;
                if ( dktt[i].ThoiGianBD <= now && now <= dktt[i].ThoiGianKT)
                    trangthai = TrangThaiDangKyThucTap.TrongThoiGianDangKy;
                if ( now > dktt[i].ThoiGianBD && now > dktt[i].ThoiGianKT)
                    trangthai = TrangThaiDangKyThucTap.HetThoiGianDangKy
                await DangKyThucTap.findOneAndUpdate({ MaDKTT: dktt[i].MaDKTT }, { TrangThai: trangthai });
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
 * @route POST /api/admin/dk-thuc-tap/ThemViTriCongTyTrongDanhSach/{MaDKTT}
 * @description Thêm vị trí thực tập công ty trong danh sách
 * @access public
 */
DangKyThucTapAdminRoute.post('/ThemViTriCongTyTrongDanhSach/:MaDKTT', async (req, res) => {
    try{
        const errors = KtraKhiThemViTriCongTyTrongDS(req.body)
        if (errors)
            return sendError(res, errors)
        const { ViTri, ToiDa, Email } = req.body;
        const { MaDKTT } = req.params;
        if ( !ToiDa.match(/^[0-9]/) )
            return sendError(res, "Tối đa phải là ký tự số");

        const isExist = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");

        let thongtin = {
            ViTri: ViTri,
            ToiDa: Number(ToiDa),
            DaDangKy: 0,
            ConLai: Number(ToiDa),
            SinhVien: [],
        }
        let check = 0;
        if (isExist.CongTyTrongDS.length > 0){
            isExist.CongTyTrongDS.forEach((element) => {
                if ( element.Email.includes(Email) ){
                    check = 1;
                    element.DangKy.push(thongtin);
                    return;
                }
                    
            });
            if ( check == 1 )
                await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyTrongDS: isExist.CongTyTrongDS });
            else
                return sendError(res, "Không có công ty để thêm vị trí thực tập");
            
        }
        else
            return sendError(res, "Không có công ty để thêm vị trí thực tập")

        return sendSuccess(res, "Thêm vị trí thực tập công ty trong danh sách thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-thuc-tap/XoaViTriCongTyTrongDanhSach/{MaDKTT}
 * @description Xóa vị trí thực tập công ty trong danh sách
 * @access public
 */
DangKyThucTapAdminRoute.post('/XoaViTriCongTyTrongDanhSach/:MaDKTT', async (req, res) => {
    try{
        const errors = KtraKhiXoaViTriCongTyTrongDS(req.body)
        if (errors)
            return sendError(res, errors)
            const { ViTri, Email } = req.body;
        const { MaDKTT } = req.params;

        const isExist = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");

        let check = 0;
        if (isExist.CongTyTrongDS.length > 0){
            let i = 0;
            isExist.CongTyTrongDS.forEach((element) => {
                if ( element.Email.includes(Email) ){
                    let k = 0;
                    element.DangKy.forEach((data) => {
                        if ( data.ViTri.includes(ViTri) ){
                            check = 1;
                            element.DangKy.splice(k,1);
                            return;
                        }
                        k++;
                    });
                    if (check == 1)
                        return;
                }
                i++;
            });
            await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyTrongDS: isExist.CongTyTrongDS });
        }
        else
            return sendError(res, "Thông tin này không tồn tại nên không thể xóa.");

        return sendSuccess(res, "Xóa vị trí thực tập công ty trong danh sách thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-thuc-tap/ImportDSSinhVienDKTT/{MaDKTT}
 * @description Import danh sách sinh viên đăng ký thực tập
 * @access public
 */
DangKyThucTapAdminRoute.post('/ImportDSSinhVienDKTT/:MaDKTT', createThucTapDir, uploadFile.single("FileExcel"), async (req, res) => {
    try{
        const { CapTaiKhoan, MatKhauMacDinh } = req.body;
        if (CapTaiKhoan == '' || MatKhauMacDinh == '')
            return sendError(res, "Vui lòng điền đầy đủ thông tin");
        const { MaDKTT } = req.params;
        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT });
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập này không tồn tại");
        let thongtinCreate = [];
        let thongtinUpdate = [];
        let svdangkytt = [];
        let fileName = path.join(__dirname, `../../public/ThucTap/${req.file.filename}`);
        const nganh = await Nganh.find({});
        const sinhvien = await SinhVien.find({});
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(fileName)
            .then(() => {
                const sheetCount = workbook.worksheets.length;
                for (let i = 1; i <= sheetCount; i++){
                    const worksheet = workbook.getWorksheet(i);
                    worksheet.eachRow((row, rowNumber) => {
                        if ( rowNumber > 1 ){
                            let NganhHoc = nganh.find( ({MaNganh}) => MaNganh === row.getCell("G").value );
                            let KhoaHoc = row.getCell("H").value;
                            let ngaysinh = String(row.getCell("D").value)
                            let sv = {
                                MaSV: row.getCell("A").value,
                                HoSV: row.getCell("B").value,
                                TenSV: row.getCell("C").value,
                                NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0]),
                                DTBTLHK: row.getCell("E").value,
                                Lop: row.getCell("F").value,
                                Nganh: NganhHoc.TenNganh,
                                Khoa: String(KhoaHoc).substring(0,4),
                            }
                            let checkSV = sinhvien.find( ({MaSV}) => MaSV === row.getCell("A").value )
                            if (checkSV)
                                thongtinUpdate.push(sv)
                            else
                                thongtinCreate.push(sv);
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
        if (CapTaiKhoan == CapTaiKhoanChoSinhVienKhiImportFile.TaoTaiKhoan){
            const qtk = await QuyenTaiKhoan.findOne({ MaQTK: "SINHVIEN" });
            let password = await argon2.hash(MatKhauMacDinh);
            if ( thongtinUpdate.length > 0 ){
                for (let i = 0; i< thongtinUpdate.length; i++){
                    let checkSV = sinhvien.find( ({MaSV}) => MaSV === thongtinUpdate[i].MaSV )
                    if (checkSV.MaTK == null){
                        let taikhoan = await TaiKhoan.create({
                                                MaTK: "TK" + thongtinUpdate[i].MaSV,
                                                MaQTK: qtk._id,
                                                TenDangNhap: thongtinUpdate[i].MaSV,
                                                MatKhau: password
                                            })
                        let sv = await SinhVien.findOneAndUpdate({ MaSV: thongtinUpdate[i].MaSV },{ 
                            HoSV: thongtinUpdate[i].HoSV, 
                            TenSV: thongtinUpdate[i].TenSV, 
                            NgaySinh: thongtinUpdate[i].NgaySinh, 
                            Khoa: thongtinUpdate[i].Khoa, 
                            DTBTLHK: thongtinUpdate[i].DTBTLHK, 
                            Nganh: thongtinUpdate[i].Nganh, 
                            Lop : thongtinUpdate[i].Lop,
                            MaTK: taikhoan._id,
                            TrangThai: TrangThaiSinhVien.DaCoTaiKhoan
                        });
                        svdangkytt.push(sv._id);
                    }
                    else{
                        let sv = await SinhVien.findOneAndUpdate({ MaSV: thongtinUpdate[i].MaSV },{ 
                            HoSV: thongtinUpdate[i].HoSV, 
                            TenSV: thongtinUpdate[i].TenSV, 
                            NgaySinh: thongtinUpdate[i].NgaySinh, 
                            Khoa: thongtinUpdate[i].Khoa, 
                            DTBTLHK: thongtinUpdate[i].DTBTLHK, 
                            Nganh: thongtinUpdate[i].Nganh, 
                            Lop : thongtinUpdate[i].Lop,
                            TrangThai: TrangThaiSinhVien.DaCoTaiKhoan
                        });
                        svdangkytt.push(sv._id);
                    }
                }
            }
            if (thongtinCreate.length > 0 ){
                for (let i = 0; i< thongtinCreate.length; i++){
                    let taikhoan = await TaiKhoan.create({
                        MaTK: "TK" + thongtinCreate[i].MaSV,
                        MaQTK: qtk._id,
                        TenDangNhap: thongtinCreate[i].MaSV,
                        MatKhau: password
                    })
                    let sv = await SinhVien.create({ 
                        MaSV: thongtinCreate[i].MaSV,
                        HoSV: thongtinCreate[i].HoSV, 
                        TenSV: thongtinCreate[i].TenSV,
                        NgaySinh: thongtinCreate[i].NgaySinh, 
                        Khoa: thongtinCreate[i].Khoa,
                        Nganh: thongtinCreate[i].Nganh, 
                        Lop: thongtinCreate[i].Lop ,
                        DTBTLHK: thongtinCreate[i].DTBTLHK,
                        MaTK: taikhoan._id,
                        TrangThai: TrangThaiSinhVien.DaCoTaiKhoan
                    });
                    svdangkytt.push(sv._id);
                };
            }
        }
        else{
            if ( thongtinUpdate.length > 0 ){
                for (let i = 0; i< thongtinUpdate.length; i++){
                    let sv = await SinhVien.findOneAndUpdate({ MaSV: thongtinUpdate[i].MaSV },{ 
                        HoSV: thongtinUpdate[i].HoSV, 
                        TenSV: thongtinUpdate[i].TenSV, 
                        NgaySinh: thongtinUpdate[i].NgaySinh, 
                        Khoa: thongtinUpdate[i].Khoa, 
                        DTBTLHK: thongtinUpdate[i].DTBTLHK, 
                        Nganh: thongtinUpdate[i].Nganh, 
                        Lop : thongtinUpdate[i].Lop
                    });
                    svdangkytt.push(sv._id);
                }
            }
            if (thongtinCreate.length > 0 ){
                for (let i = 0; i< thongtinCreate.length; i++){
                    let sv = await SinhVien.create({ 
                        MaSV: thongtinCreate[i].MaSV,
                        HoSV: thongtinCreate[i].HoSV, 
                        TenSV: thongtinCreate[i].TenSV,
                        NgaySinh: thongtinCreate[i].NgaySinh, 
                        Khoa: thongtinCreate[i].Khoa,
                        Nganh: thongtinCreate[i].Nganh, 
                        Lop: thongtinCreate[i].Lop ,
                        DTBTLHK: thongtinCreate[i].DTBTLHK
                    });
                    svdangkytt.push(sv);
                };
            }
        }
        dktt.SinhVienDuocDKTT = svdangkytt;
        await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { SinhVienDuocDKTT: dktt.SinhVienDuocDKTT});
        return sendSuccess(res, "Import file thông tin sinh viên thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/dk-thuc-tap/ExportFileExcelDsSVDKTT/{MaDKTT}
 * @description Export file danh sách công ty và sinh viên đăng ký thực tập
 * @access public
 */
DangKyThucTapAdminRoute.get('/ExportFileExcelDsSVDKTT/:MaDKTT', async (req, res) => {
    try{
        const { MaDKTT } = req.params;
        const now = new Date();

        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).populate([
            {
                path: "CongTyTrongDS",
                select: "DangKy",
                populate: [
                    {
                        path: "DangKy",
                        select: "SinhVien",
                        populate: [
                            {
                                path: "SinhVien",
                                select: "MaSV HoSV TenSV Lop"
                            }
                        ]
                    }
                ]
            },
            {
                path: "CongTyNgoaiDS",
                select: "SinhVien",
                populate: [
                    {
                        path: "SinhVien",
                        select: "MaSV HoSV TenSV Lop",
                    }
                ]
            }
        ]).lean();
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập này không tồn tại");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('DS Đăng ký');

        worksheet.getColumn("A").width = 5;
        worksheet.getColumn("B").width = 27;
        worksheet.getColumn("C").width = 14;
        worksheet.getColumn("D").width = 8;
        worksheet.getColumn("E").width = 10;
        worksheet.getColumn("F").width = 30;
        worksheet.getColumn("G").width = 14;
        worksheet.getColumn("H").width = 18;

        worksheet.getRow(9).height = 28;
        worksheet.getRow(10).height = 28;

        const sizeFont = 12;
        const fontType = "Times New Roman";
        const borderRound = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
        };

        worksheet.mergeCells('A1:E1');
        const row1 = worksheet.getRow(1).getCell("A");
        row1.value = "TRƯỜNG ĐẠI HỌC SÀI GÒN";
        row1.alignment = { vertical: 'middle', horizontal: 'center' };
        row1.font = { size: sizeFont, name: fontType }

        worksheet.mergeCells('F1:H1');
        const row1_2 = worksheet.getRow(1).getCell("F");
        row1_2.value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
        row1_2.alignment = { vertical: 'middle', horizontal: 'center' };
        row1_2.font = { bold: true, size: sizeFont, name: fontType }

        worksheet.mergeCells('A2:E2');
        const row2 = worksheet.getRow(2).getCell("A");
        row2.value = "KHOA/NGÀNH: CÔNG NGHỆ THÔNG TIN";
        row2.alignment = { vertical: 'middle', horizontal: 'center' };
        row2.font = { bold: true, size: sizeFont, name: fontType }

        worksheet.mergeCells('F2:I2');
        const row2_2 = worksheet.getRow(2).getCell("F");
        row2_2.value = "Độc lập - Tự do - Hạnh phúc";
        row2_2.alignment = { vertical: 'middle', horizontal: 'center' };
        row2_2.font = { bold: true, size: sizeFont, name: fontType }

        worksheet.mergeCells('E4:I4');
        const row4 = worksheet.getRow(4).getCell("E");
        row4.value = "Thành phố Hồ Chí Minh, ngày    tháng    năm "  + now.getFullYear();
        row4.alignment = { vertical: 'middle', horizontal: 'center' };
        row4.font = { size: sizeFont, name: fontType, italic: true }

        worksheet.mergeCells('A6:I6');
        const row6 = worksheet.getRow(6).getCell("A");
        row6.value = "DANH SÁCH SINH VIÊN ĐĂNG KÍ THỰC TẬP NĂM HỌC " + dktt.NienKhoa;
        row6.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        row6.font = { bold: true, size: sizeFont, name: fontType }

        worksheet.mergeCells('A7:I7');
        const row7 = worksheet.getRow(7).getCell("A");
        row7.value = "Ngành: Công nghệ thông tin - Trình độ: Đại học";
        row7.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        row7.font = { bold: true, size: sizeFont, name: fontType }

        worksheet.mergeCells('A9:A10');
        const stt = worksheet.getRow(9).getCell("A");
        stt.value = "STT";
        stt.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        stt.font = { bold: true, size: sizeFont, name: fontType }
        stt.border = borderRound

        worksheet.mergeCells('B9:B10');
        const masosv = worksheet.getRow(9).getCell("B");
        masosv.value = "Mã số SV";
        masosv.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        masosv.font = { bold: true, size: sizeFont, name: fontType }
        masosv.border = borderRound

        worksheet.mergeCells('C9:D10');
        const hotensv = worksheet.getRow(9).getCell("C");
        hotensv.value = "Họ tên sinh viên";
        hotensv.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        hotensv.font = { bold: true, size: sizeFont, name: fontType }
        hotensv.border = borderRound


        worksheet.mergeCells('E9:E10');
        const lop = worksheet.getRow(9).getCell("E");
        lop.value = "Lớp";
        lop.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        lop.font = { bold: true, size: sizeFont, name: fontType }
        lop.border = borderRound

        worksheet.mergeCells('F9:F10');
        const tencty = worksheet.getRow(9).getCell("F");
        tencty.value = "Tên cơ sở thực tập";
        tencty.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        tencty.font = { bold: true, size: sizeFont, name: fontType }
        tencty.border = borderRound

        worksheet.mergeCells('G9:H9');
        const gvhuongdan = worksheet.getRow(9).getCell("G");
        gvhuongdan.value = "Giảng viên hướng dẫn";
        gvhuongdan.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        gvhuongdan.font = { bold: true, size: sizeFont, name: fontType }
        gvhuongdan.border = borderRound

        const macb = worksheet.getRow(10).getCell("G");
        macb.value = "Mã CB";
        macb.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        macb.font = { bold: true, size: sizeFont, name: fontType }
        macb.border = borderRound

        const hotengv = worksheet.getRow(10).getCell("H");
        hotengv.value = "(Ông/bà) Họ và tên";
        hotengv.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        hotengv.font = { bold: true, size: sizeFont, name: fontType }
        hotengv.border = borderRound

        let dssv = [];
        dktt.CongTyNgoaiDS.forEach((element) => {
            let sv = {
                MaSV: element.SinhVien.MaSV,
                HoSV: element.SinhVien.HoSV,
                TenSV: element.SinhVien.TenSV,
                Lop: element.SinhVien.Lop,
                Cty: element.TenCongTy
            }
            dssv.push(sv);
        })
        dktt.CongTyTrongDS.forEach((element) => {
            element.DangKy.forEach((data1) => {
                data1.SinhVien.forEach((data2) => {
                    let sv = {
                        MaSV: data2.MaSV,
                        HoSV: data2.HoSV,
                        TenSV: data2.TenSV,
                        Lop: data2.Lop,
                        Cty: element.TenCongTy
                    }
                    dssv.push(sv);
                });
            });
        });

        let i = 11;
        let dem = 1;
        dssv.forEach((element) => {
            worksheet.getRow(i).height = 24
            worksheet.getRow(i).getCell("A").value = dem;
            worksheet.getRow(i).getCell("B").value = element.MaSV;
            worksheet.getRow(i).getCell("C").value = element.HoSV;
            worksheet.getRow(i).getCell("D").value = element.TenSV;
            worksheet.getRow(i).getCell("E").value = element.Lop;
            worksheet.getRow(i).getCell("F").value = element.TenCongTy;
            dem++;
            i++;
        });
        for (let k = 11; k < i; k++){
            worksheet.getRow(k).eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.font = { size: sizeFont, name: fontType }
                cell.border = borderRound
            });
        };

        await res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet")
        await res.setHeader("Content-Disposition", `attachment; filename=DSDangKyThucTap.xlsx`)
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
 * @route POST /api/admin/dk-thuc-tap/ChiTietCty/{MaDKTT}
 * @description Lấy thông tin chi tiết công ty
 * @access public
 */
DangKyThucTapAdminRoute.post('/ChiTietCty/:MaDKTT', async (req, res) => {
    try {
        const { MaDKTT } = req.params;
        const { ID } = req.body;
        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT }).populate([
            {
                path: "CongTyTrongDS",
                select: "DangKy",
                populate: [
                    {
                        path: "DangKy",
                        select: "SinhVien",
                        populate: [
                            {
                                path: "SinhVien",
                                select: "MaSV HoSV TenSV Lop"
                            }
                        ]
                    }
                ]
            },
            {
                path: "CongTyNgoaiDS",
                select: "SinhVien",
                populate: [
                    {
                        path: "SinhVien",
                        select: "MaSV HoSV TenSV Lop",
                    }
                ]
            }
        ]).lean();
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");
        let thongtin = [];
        let check = 0;
        dktt.CongTyTrongDS.forEach((element) => {
            if (element._id.equals(ID)){
                check = 1;
                thongtin.push(element);
                return;
            }
        });
        if (check == 0){
            dktt.CongTyNgoaiDS.forEach((element) => {
                if (element._id.equals(ID)){
                    thongtin.push(element);
                    return;
                }
            });
        }
        return sendSuccess(res, "Thông tin chi tiết công ty", thongtin[0]);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-thuc-tap/SuaThongTinCty/{MaDKTT}
 * @description Sửa thông tin công ty
 * @access public
 */
DangKyThucTapAdminRoute.post('/SuaThongTinCty/:MaDKTT', async (req, res) => {
    try {
        const { MaDKTT } = req.params;
        const { ID, HoNguoiLienHe, TenNguoiLienHe, TenCongTy, Website, SoDienThoai, Email, DiaChi } = req.body;
        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT });
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");
        let check = 0;
        dktt.CongTyTrongDS.forEach((element) => {
            if (element._id.equals(ID)){
                check = 1;
                element.HoNguoiLienHe = HoNguoiLienHe;
                element.TenNguoiLienHe = TenNguoiLienHe;
                element.TenCongTy = TenCongTy;
                element.Website = Website;
                element.SoDienThoai = SoDienThoai;
                element.Email = Email;
                element.DiaChi = DiaChi;
                return;
            }
        });
        if (check == 0){
            dktt.CongTyNgoaiDS.forEach((element) => {
                if (element._id.equals(ID)){
                    element.HoNguoiLienHe = HoNguoiLienHe;
                    element.TenNguoiLienHe = TenNguoiLienHe;
                    element.TenCongTy = TenCongTy;
                    element.Website = Website;
                    element.SoDienThoai = SoDienThoai;
                    element.Email = Email;
                    element.DiaChi = DiaChi;
                    return;
                }
            });
        }
        if (check == 1)
            await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyTrongDS: dktt.CongTyTrongDS });
        else
            await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyNgoaiDS: dktt.CongTyNgoaiDS });

        return sendSuccess(res, "Sửa thông tin công ty thành công");
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default DangKyThucTapAdminRoute