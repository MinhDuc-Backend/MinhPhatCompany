import express from "express"
import fs from 'fs'
import { sendError, sendServerError, sendSuccess } from "../helper/client.js"
import Nganh from "../model/Nganh.js"
import ChuyenNganh from "../model/ChuyenNganh.js"
import SinhVien from "../model/SinhVien.js"
import DangKyThucTap from "../model/DangKyThucTap.js"
import { TrangThaiDangKyThucTap, TrangThaiThucTap } from "../constant.js"
import { KtraSVDangKyThucTapCtyNgoaiDS, KtraSVDangKyThucTapCtyTrongDS } from "../validation/DangKyThucTap.js"
import { verifyToken, verifyUser } from "../middleware/verify.js"

const DangKyThucTapRoute = express.Router()

/**
 * @route GET /api/dk-thuc-tap/ChiTietDKTTDangMo
 * @description Lấy thông tin chi tiết đợt đăng ký thực tập đang mở
 * @access public
 */
DangKyThucTapRoute.get('/ChiTietDKTTDangMo', async (req, res) => {
    try {
        const { MaDKTT } = req.params
        const isExist = await DangKyThucTap.findOne({ TrangThai: TrangThaiDangKyThucTap.TrongThoiGianDangKy }).lean();
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
 * @route POST /api/dk-thuc-tap/DSCtyTrongDanhSach/{MaDKTT}
 * @description Lấy danh sách công ty đợt đăng ký thực tập
 * @access public
 */
DangKyThucTapRoute.post('/DSCtyTrongDanhSach/:MaDKTT', async (req, res) => {
    try {
        const { MaDKTT } = req.params;
        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT });
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");

        let thongtin = [];
        dktt.CongTyTrongDS.forEach((element) => {
            thongtin.push(element);
        });
        
        return sendSuccess(res, "Lấy danh sách công ty trong danh sách thành công", thongtin);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/dk-thuc-tap/SVDangKyCtyTrongDS/{MaDKTT}
 * @description Sinh viên đăng ký thực tập công ty trong danh sách
 * @access public
 */
DangKyThucTapRoute.post('/SVDangKyCtyTrongDS/:MaDKTT', verifyToken, verifyUser, async (req, res) => {
    try {
        const err = KtraSVDangKyThucTapCtyTrongDS(req.body);
        if (err)
            return sendError(res, err);
        const { MaDKTT } = req.params;
        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT });
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");
        const { EmailCty, ViTri, MaSV } = req.body;
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV });
        if (!sinhvien)
            return sendError(res, "Sinh viên này không tồn tại");
        if (sinhvien.TrangThaiThucTap == TrangThaiThucTap.DaThucTap)
            return sendError(res, "Bạn đã đăng ký thông tin thực tập");
        let check = 0;
        dktt.SinhVienDuocDKTT.forEach((element) => {
            if (element.equals(sinhvien._id)){
                check = 1;
                return;
            }
        });
        if (check == 0)
            return sendError(res, "Bạn không được phép đăng ký thực tập");

        check = 0;
        dktt.CongTyTrongDS.forEach((element) => {
            if (element.Email.includes(EmailCty)){
                element.DangKy.forEach((data) => {
                    if (data.ViTri.includes(ViTri)){
                    if (data.ConLai == 0){
                            check = 2;
                            return;
                        }
                        else{
                            check = 1;
                            data.SinhVien.push(sinhvien._id);
                            data.DaDangKy = data.DaDangKy + 1;
                            data.ConLai = data.ToiDa - data.DaDangKy;
                            return;
                        }
                    }
                });
                if (check == 2 || check == 1)
                    return;
            }
        });
        if (check == 2)
            return sendError(res, "Đã hết số lượng đăng ký");
        if (check == 1){
            await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyTrongDS: dktt.CongTyTrongDS });
            await SinhVien.findOneAndUpdate({ MaSV: MaSV }, { TrangThaiThucTap: TrangThaiThucTap.DaThucTap });
        }
        
        return sendSuccess(res, "Sinh viên đăng ký thực tập thành công");
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/dk-thuc-tap/SVDangKyCtyNgoaiDS/{MaDKTT}
 * @description Sinh viên đăng ký thực tập công ty ngoài danh sách
 * @access public
 */
DangKyThucTapRoute.post('/SVDangKyCtyNgoaiDS/:MaDKTT', verifyToken, verifyUser, async (req, res) => {
    try {
        const err = KtraSVDangKyThucTapCtyNgoaiDS(req.body);
        if (err)
            return sendError(res, err);
        const { MaDKTT } = req.params;
        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT });
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");
        const { Ho, Ten, TenCongTy, Website, SoDienThoai, EmailCty, DiaChi, ViTri, MaSV } = req.body;
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV });
        if (!sinhvien)
            return sendError(res, "Sinh viên này không tồn tại");
        if (sinhvien.TrangThaiThucTap == TrangThaiThucTap.DaThucTap)
            return sendError(res, "Bạn đã đăng ký thông tin thực tập");
        let check = 0;
        dktt.SinhVienDuocDKTT.forEach((element) => {
            if (element.equals(sinhvien._id)){
                check = 1;
                return;
            }
        });
        if (check == 0)
            return sendError(res, "Bạn không được phép đăng ký thực tập");
        
        let thongtin = {
            HoNguoiLienHe: Ho,
            TenNguoiLienHe: Ten,
            TenCongTy: TenCongTy,
            Website: Website,
            SoDienThoai: SoDienThoai,
            Email: EmailCty,
            DiaChi: DiaChi,
            ViTri: ViTri,
            SinhVien: sinhvien._id
        }

        dktt.CongTyNgoaiDS.push(thongtin);
        await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyNgoaiDS: dktt.CongTyNgoaiDS });
        await SinhVien.findOneAndUpdate({ MaSV: MaSV }, { TrangThaiThucTap: TrangThaiThucTap.DaThucTap });
        
        return sendSuccess(res, "Sinh viên đăng ký thực tập thành công");
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/dk-thuc-tap/SVHuyDangKyThucTap/{MaDKTT}
 * @description Sinh viên hủy đăng ký thực tập
 * @access public
 */
DangKyThucTapRoute.post('/SVHuyDangKyThucTap/:MaDKTT', verifyToken, verifyUser, async (req, res) => {
    try {
        const { MaDKTT } = req.params;
        const dktt = await DangKyThucTap.findOne({ MaDKTT: MaDKTT });
        if (!dktt)
            return sendError(res, "Đợt đăng ký thực tập không tồn tại");
        const { MaSV } = req.body;
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV });
        if (!sinhvien)
            return sendError(res, "Sinh viên này không tồn tại");
        if (sinhvien.TrangThaiThucTap == TrangThaiThucTap.ChuaThucTap)
            return sendError(res, "Bạn chưa đăng ký thực tập nên không thể hủy");
        let check = 0;
        dktt.SinhVienDuocDKTT.forEach((element) => {
            if (element.equals(sinhvien._id)){
                check = 1;
                return;
            }
        });
        if (check == 0)
            return sendError(res, "Bạn không được phép thực hiện chức năng này");

        check = 0;
        dktt.CongTyTrongDS.forEach((element) => {
            element.DangKy.forEach((data) => {
                let i = 0;
                data.SinhVien.forEach((sv) => {
                    if (sv.equals(sinhvien._id)){
                        check = 1;
                        data.SinhVien.slice(i,1);
                        return;
                    }
                    i++;
                });
                if (check == 1){
                    data.DaDangKy = data.DaDangKy - 1;
                    data.ConLai = data.ToiDa - data.DaDangKy;
                    return;
                }
            });
            if (check == 1)
                return;
        });
        if (check == 1){
            await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyTrongDS: dktt.CongTyTrongDS });
            await SinhVien.findOneAndUpdate({ MaSV: MaSV }, { TrangThaiThucTap: TrangThaiThucTap.ChuaThucTap });
        }
        else{
            let i = 0;
            dktt.CongTyNgoaiDS.forEach((element) => {
                if (element.SinhVien.equals(sinhvien._id)){
                    check = 1;
                    dktt.CongTyNgoaiDS.splice(i,1);
                    return;
                }
                i++;
            });
            if (check == 1){
                await DangKyThucTap.findOneAndUpdate({ MaDKTT: MaDKTT }, { CongTyNgoaiDS: dktt.CongTyNgoaiDS });
                await SinhVien.findOneAndUpdate({ MaSV: MaSV }, { TrangThaiThucTap: TrangThaiThucTap.ChuaThucTap });
            }
        }
        
        return sendSuccess(res, "Sinh viên hủy đăng ký thực tập thành công");
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default DangKyThucTapRoute