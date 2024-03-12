import express from "express"
import fs from 'fs'
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiDangKyChuyenNganh, TrangThaiTonTai } from "../../constant.js"
import DangKyChuyenNganh from "../../model/DangKyChuyenNganh.js"
import { KtraDuLieuDKCNKhiChinhSua, KtraDuLieuDKCNKhiThem, KtraDuLieuDKCNKhiThemMonChuyenNganh, KtraDuLieuDKCNKhiXoaMonChuyenNganh } from "../../validation/DangKyChuyenNganh.js"
import { DoiDinhDangNgay, XuLyNgaySinh } from "../../helper/XuLyDuLieu.js"
import Nganh from "../../model/Nganh.js"
import ChuyenNganh from "../../model/ChuyenNganh.js"
import SinhVien from "../../model/SinhVien.js"

const DangKyChuyenNganhAdminRoute = express.Router()

/**
 * @route GET /api/admin/dk-chuyen-nganh/DanhSachDKCN
 * @description Lấy danh sách đăng ký chuyên ngành
 * @access public
 */
DangKyChuyenNganhAdminRoute.get('/DanhSachDKCN', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaDKCN: { $regex: keyword, $options: "i" } },
                    { Ten: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const dkcn = await DangKyChuyenNganh.find({ $and: [keywordCondition] }).limit(pageSize).skip(pageSize * page)
        const length = await DangKyChuyenNganh.find({ $and: [keywordCondition] }).count();

        if (dkcn.length == 0) 
            return sendError(res, "Không tìm thấy danh sách đăng ký chuyên ngành.")
        if (dkcn) 
            return sendSuccess(res, "Lấy danh sách đăng ký chuyên ngành thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: dkcn
            })

        return sendError(res, "Không tìm thấy danh sách đăng ký chuyên ngành.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/dk-chuyen-nganh/ChiTietDKCN/{MaDKCN}
 * @description Lấy thông tin chi tiết đăng ký chuyên ngành
 * @access public
 */
DangKyChuyenNganhAdminRoute.get('/ChiTietDKCN/:MaDKCN', async (req, res) => {
    try {
        const { MaDKCN } = req.params
        const isExist = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN }).populate([
            {
                path: "ThongTin",
                select: "Nganh ChuyenNganh",
                populate: [
                    {
                        path: "Nganh",
                        select: "MaNganh TenNganh"
                    },
                    {
                        path: "ChuyenNganh",
                        select: "MaChuyenNganh TenChuyenNganh"
                    }
                ]
            },
        ]).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký chuyên ngành không tồn tại"); 

        return sendSuccess(res, "Chi tiết thông tin đăng ký chuyên ngành.", isExist)
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-chuyen-nganh/Them
 * @description Thêm đợt đăng ký chuyên ngành
 * @access public
 */
DangKyChuyenNganhAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuDKCNKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaDKCN, Ten, Khoa, ThoiGianBD, ThoiGianKT } = req.body;

        const isExistMa = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN }).lean();
        if (isExistMa)
            return sendError(res, "Mã đăng ký chuyên ngành đã tồn tại");
        const date = new Date();
        const now = new Date(DoiDinhDangNgay(date));
        const bd = new Date(ThoiGianBD);
        const kt = new Date(ThoiGianKT);
        if (kt < bd)
            return sendError(res, "Ngày kết thúc phải lớn hơn ngày bắt đầu");
        let check = 0;
        const data = await DangKyChuyenNganh.find({});
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
            return sendError(res, "Có đợt đăng ký chuyên ngành khác trong khoảng thời gian này. Vui lòng chọn khoảng thời gian khác.");
        let trangthai = "";
        if ( now < bd && now < kt)
            trangthai = TrangThaiDangKyChuyenNganh.ChuaToiThoiGianDangKy;
        if ( bd <= now && now <= kt)
            trangthai = TrangThaiDangKyChuyenNganh.TrongThoiGianDangKy;
        if ( now > bd && now > kt)
            trangthai = TrangThaiDangKyChuyenNganh.HetThoiGianDangKy

        const dkcn = await DangKyChuyenNganh.create({ MaDKCN: MaDKCN, Ten: Ten, Khoa: Khoa, ThoiGianBD: ThoiGianBD, ThoiGianKT: ThoiGianKT, TrangThai: trangthai });
        return sendSuccess(res, "Thêm đợt đăng ký chuyên ngành thành công", dkcn);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/dk-chuyen-nganh/ChinhSua/{MaDKCN}
 * @description Chỉnh sửa đợt đăng ký chuyên ngành
 * @access public
 */
DangKyChuyenNganhAdminRoute.put('/ChinhSua/:MaDKCN', async (req, res) => {
    try{
        const errors = KtraDuLieuDKCNKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { Ten, Khoa, ThoiGianBD, ThoiGianKT } = req.body;
        const { MaDKCN } = req.params;

        const isExistMa = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN }).lean();
        if (!isExistMa)
            return sendError(res, "Đợt đăng ký chuyên ngành không tồn tại");
        const date = new Date();
        const now = new Date(DoiDinhDangNgay(date));
        const bd = new Date(ThoiGianBD);
        const kt = new Date(ThoiGianKT);
        if (kt < bd)
            return sendError(res, "Ngày kết thúc phải lớn hơn ngày bắt đầu");
        let check = 0;
        const data = await DangKyChuyenNganh.find({});
        if (data.length > 0){
            data.forEach((element) => {
                if (element.MaDKCN != MaDKCN){
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
            return sendError(res, "Có đợt đăng ký chuyên ngành khác trong khoảng thời gian này. Vui lòng chọn khoảng thời gian khác.");
        let trangthai = "";
        if ( now < bd && now < kt)
            trangthai = TrangThaiDangKyChuyenNganh.ChuaToiThoiGianDangKy;
        if ( bd <= now && now <= kt)
            trangthai = TrangThaiDangKyChuyenNganh.TrongThoiGianDangKy;
        if ( now > bd && now > kt)
            trangthai = TrangThaiDangKyChuyenNganh.HetThoiGianDangKy

        await DangKyChuyenNganh.findOneAndUpdate({ MaDKCN: MaDKCN }, { Ten: Ten, Khoa: Khoa, ThoiGianBD: ThoiGianBD, ThoiGianKT: ThoiGianKT, TrangThai: trangthai });
        return sendSuccess(res, "Chỉnh sửa đợt đăng ký chuyên ngành thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/dk-chuyen-nganh/Xoa/{MaDKCN}
 * @description Xóa đợt đăng ký chuyên ngành
 * @access private
 */
DangKyChuyenNganhAdminRoute.delete('/Xoa/:MaDKCN', async (req, res) => {
    try {
        const { MaDKCN } = req.params
        const isExist = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN })
        if (!isExist) 
            return sendError(res, "Đợt đăng ký chuyên ngành này không tồn tại");
        await DangKyChuyenNganh.findOneAndDelete({ MaDKCN: MaDKCN });
        return sendSuccess(res, "Xóa đợt đăng ký chuyên ngành thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-chuyen-nganh/ThemChuyenNganhDangKy/{MaDKCN}
 * @description Thêm chuyên ngành đăng ký cho sinh viên 
 * @access public
 */
DangKyChuyenNganhAdminRoute.post('/ThemChuyenNganhDangKy/:MaDKCN', async (req, res) => {
    try{
        const errors = KtraDuLieuDKCNKhiThemMonChuyenNganh(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaNganh, MaChuyenNganh, ToiDa } = req.body;
        const { MaDKCN } = req.params;
        if ( !ToiDa.match(/^[0-9]/) )
            return sendError(res, "Tối đa phải là ký tự số");

        const isExist = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký chuyên ngành không tồn tại");

        const nganh = await Nganh.findOne({ MaNganh: MaNganh });
        const chuyennganh = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh });
        let thongtin = {
            Nganh: nganh._id,
            ChuyenNganh: chuyennganh._id,
            ToiDa: Number(ToiDa),
            ConLai: Number(ToiDa),
            DaDangKy: 0,
            SinhVien: [],
        }
        let check = 0;
        if (isExist.ThongTin.length > 0){
            isExist.ThongTin.forEach((element) => {
                if ( element.Nganh.equals(thongtin.Nganh) && element.ChuyenNganh.equals(thongtin.ChuyenNganh) )
                    check = 1;
                if ( check == 1 ){
                    element.ToiDa = element.ToiDa + thongtin.ToiDa;
                    element.ConLai = element.ToiDa - element.DaDangKy;
                    return;
                }
            });
            if ( check == 1 )
                await DangKyChuyenNganh.findOneAndUpdate({ MaDKCN: MaDKCN }, { ThongTin: isExist.ThongTin });
            else{
                isExist.ThongTin.push(thongtin);
                await DangKyChuyenNganh.findOneAndUpdate({ MaDKCN: MaDKCN }, { ThongTin: isExist.ThongTin });
            }
        }
        else{
            isExist.ThongTin.push(thongtin);
            await DangKyChuyenNganh.findOneAndUpdate({ MaDKCN: MaDKCN }, { ThongTin: isExist.ThongTin });
        }

        return sendSuccess(res, "Thêm chuyên ngành đăng ký thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-chuyen-nganh/SuaChuyenNganhDangKy/{MaDKCN}
 * @description Sửa thông tin chuyên ngành sinh viên đăng ký
 * @access public
 */
DangKyChuyenNganhAdminRoute.post('/SuaChuyenNganhDangKy/:MaDKCN', async (req, res) => {
    try{
        const errors = KtraDuLieuDKCNKhiXoaMonChuyenNganh(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaNganh, MaChuyenNganh, SoLuong } = req.body;
        const { MaDKCN } = req.params;

        const isExist = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký chuyên ngành không tồn tại");

        const nganh = await Nganh.findOne({ MaNganh: MaNganh });
        const chuyennganh = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh });

        let check = 0;
        if (isExist.ThongTin.length > 0){
            isExist.ThongTin.forEach((element) => {
                if ( element.Nganh.equals(nganh._id) && element.ChuyenNganh.equals(chuyennganh._id) ){
                    if (element.SinhVien.length > SoLuong){
                        check = 2;
                        return;
                    }
                    else{
                        check = 1;
                        element.ToiDa = SoLuong;
                        element.ConLai = element.ToiDa - element.DaDangKy;
                        return;
                    }
                }
            });
            if (check == 2)
                return sendError(res, "Số lượng sinh viên đăng ký lớn hơn số lượng muốn sửa.");
            if (check == 1)
                await DangKyChuyenNganh.findOneAndUpdate({ MaDKCN: MaDKCN }, { ThongTin: isExist.ThongTin });
        }
        else
            return sendError(res, "Thông tin này không tồn tại nên không thể sửa.");

        return sendSuccess(res, "Sửa chuyên ngành đăng ký thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/dk-chuyen-nganh/TuDongCapNhatTrangThaiDKCN
 * @description Tự động cập nhập trạng thái của các đợt đăng ký chuyên ngành
 * @access public
 */
DangKyChuyenNganhAdminRoute.get('/TuDongCapNhatTrangThaiDKCN', async (req, res) => {
    try{

        const dkcn = await DangKyChuyenNganh.find({ TrangThai: { $in: [TrangThaiDangKyChuyenNganh.ChuaToiThoiGianDangKy, TrangThaiDangKyChuyenNganh.TrongThoiGianDangKy]} }).lean();
        const date = new Date();
        const now = new Date(DoiDinhDangNgay(date));
        if (dkcn.length > 0){
            let trangthai = "";
            for(let i = 0; i< dkcn.length; i++){
                trangthai = "";
                if ( now < dkcn[i].ThoiGianBD && now < dkcn[i].ThoiGianKT)
                    trangthai = TrangThaiDangKyChuyenNganh.ChuaToiThoiGianDangKy;
                if ( dkcn[i].ThoiGianBD <= now && now <= dkcn[i].ThoiGianKT)
                    trangthai = TrangThaiDangKyChuyenNganh.TrongThoiGianDangKy;
                if ( now > dkcn[i].ThoiGianBD && now > dkcn[i].ThoiGianKT)
                    trangthai = TrangThaiDangKyChuyenNganh.HetThoiGianDangKy
                await DangKyChuyenNganh.findOneAndUpdate({ MaDKCN: dkcn[i].MaDKCN }, { TrangThai: trangthai });
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
 * @route POST /api/admin/dk-chuyen-nganh/ThonKeSVDangKyChuyenNganh
 * @description Thống kê số lượng sinh viên đã đăng ký chuyên ngành
 * @access public
 */
DangKyChuyenNganhAdminRoute.post('/ThonKeSVDangKyChuyenNganh', async (req, res) => {
    try {
        const { MaNganh, MaChuyenNganh, MaDKCN } = req.body;
        if ( MaNganh == '' || MaChuyenNganh == '' || MaDKCN == '')
            return sendError(res, "Vui lòng điền đẩy đủ thông tin.");

        const nganh = await Nganh.findOne({ MaNganh: MaNganh });
        if (!nganh)
            return sendError(res, "Ngành này không tồn tại.");
        const dkcn = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN });
        if (!dkcn)
            return sendError(res, "Đợt đăng ký chuyên ngành này không tồn tại.");

        let array = [];
        const khoa = dkcn.Khoa;
        if (MaChuyenNganh == "Tất cả"){
            const sinhvien = await SinhVien.find({ Khoa: khoa, Nganh: nganh.TenNganh });
            sinhvien.forEach((element) => {
                let cn = '';
                if (element.ChuyenNganh == null)
                    cn = "Chưa đăng ký";
                else
                    cn = element.ChuyenNganh;
                let sv = {
                    MaSV: element.MaSV,
                    HoSV: element.HoSV,
                    TenSV: element.TenSV,
                    Diem: element.DTBTLHK,
                    ChuyenNganh: cn
                }
                array.push(sv);
            });
        }
        else{
            const chuyennganh = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh });
            if (!chuyennganh)
                return sendError(res, "Chuyên ngành này không tồn tại.");
            const sinhvien = await SinhVien.find({ Khoa: khoa, Nganh: nganh.TenNganh, ChuyenNganh: chuyennganh.TenChuyenNganh });
            sinhvien.forEach((element) => {
                let sv = {
                    MaSV: element.MaSV,
                    HoSV: element.HoSV,
                    TenSV: element.TenSV,
                    Diem: element.DTBTLHK,
                    ChuyenNganh: element.ChuyenNganh
                }
                array.push(sv);
            });
        }
        
        return sendSuccess(res, "Lấy danh sách sinh viên thành công.", array);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/dk-chuyen-nganh/XoaChuyenNganhDangKy/{MaDKCN}
 * @description Xóa thông tin chuyên ngành sinh viên đăng ký
 * @access public
 */
DangKyChuyenNganhAdminRoute.post('/XoaChuyenNganhDangKy/:MaDKCN', async (req, res) => {
    try{
        const errors = KtraDuLieuDKCNKhiXoaMonChuyenNganh(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaNganh, MaChuyenNganh } = req.body;
        const { MaDKCN } = req.params;

        const isExist = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN }).lean();
        if (!isExist)
            return sendError(res, "Đợt đăng ký chuyên ngành không tồn tại");

        const nganh = await Nganh.findOne({ MaNganh: MaNganh });
        const chuyennganh = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh });

        if (isExist.ThongTin.length > 0){
            let i = 0;
            isExist.ThongTin.forEach((element) => {
                if ( element.Nganh.equals(nganh._id) && element.ChuyenNganh.equals(chuyennganh._id) ){
                    isExist.ThongTin.splice(i,1);
                    return;
                }
                i++;
            });
            await DangKyChuyenNganh.findOneAndUpdate({ MaDKCN: MaDKCN }, { ThongTin: isExist.ThongTin });
        }
        else
            return sendError(res, "Thông tin này không tồn tại nên không thể xóa.");

        return sendSuccess(res, "Xóa chuyên ngành đăng ký thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

export default DangKyChuyenNganhAdminRoute