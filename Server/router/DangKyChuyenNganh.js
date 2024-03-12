import express from "express"
import fs from 'fs'
import { sendError, sendServerError, sendSuccess } from "../helper/client.js"
import { TrangThaiDangKyChuyenNganh, TrangThaiTonTai } from "../constant.js"
import DangKyChuyenNganh from "../model/DangKyChuyenNganh.js"
import Nganh from "../model/Nganh.js"
import ChuyenNganh from "../model/ChuyenNganh.js"
import SinhVien from "../model/SinhVien.js"
import { KtraSVDangKyChuyenNganh } from "../validation/DangKyChuyenNganh.js"
import { verifyToken, verifyUser } from "../middleware/verify.js"

const DangKyChuyenNganhRoute = express.Router()

/**
 * @route GET /api/dk-chuyen-nganh/LayDotDKCNDangMo
 * @description Lấy thông tin đợt đăng ký chuyên ngành đang mở
 * @access public
 */
DangKyChuyenNganhRoute.get('/LayDotDKCNDangMo', async (req, res) => {
    try {
        const isExist = await DangKyChuyenNganh.findOne({ TrangThai: TrangThaiDangKyChuyenNganh.TrongThoiGianDangKy }).populate([
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
 * @route POST /api/dk-chuyen-nganh/SVDangKyChuyenNganh/{MaDKCN}
 * @description Sinh viên đăng ký chuyên ngành
 * @access public
 */
DangKyChuyenNganhRoute.post('/SVDangKyChuyenNganh/:MaDKCN', verifyToken, verifyUser, async (req, res) => {
    try {
        const err = KtraSVDangKyChuyenNganh(req.body);
        if (err)
            return sendError(res,err);
        const { MaSV, MaNganh, MaChuyenNganh } = req.body;
        const { MaDKCN } = req.params;
        const dkcn = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN }).lean();
        if (!dkcn)
            return sendError(res, "Đợt đăng ký chuyên ngành không tồn tại"); 
        const nganh = await Nganh.findOne({ MaNganh: MaNganh });
        if (!nganh)
            return sendError(res, "Ngành này không tồn tại");
        const chuyennganh = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh });
        if (!chuyennganh)
            return sendError(res, "Chuyên ngành này không tồn tại");
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV });
        if (!sinhvien)
            return sendError(res, "Sinh viên này không tồn tại");

        if (sinhvien.Khoa != dkcn.Khoa)
            return sendError(res, "Bạn không được phép đăng ký chuyên ngành");
        if (sinhvien.Nganh != nganh.TenNganh)
            return sendError(res, "Bạn không được phép đăng ký chuyên ngành này");
        if (sinhvien.ChuyenNganh != null)
            return sendError(res, "Bạn đã đăng ký chuyên ngành khác");

        const KtraDKCN = await DangKyChuyenNganh.aggregate([
            {
                $match: { "MaDKCN": MaDKCN }
            },
            {
                $unwind: '$ThongTin',
            },
            {
                $match: {
                    'ThongTin.Nganh': nganh._id,
                    'ThongTin.ChuyenNganh': chuyennganh._id
                },
            },
        ]);
        if (KtraDKCN.length == 0)
            return sendError(res, "Chuyên ngành đăng ký không tồn tại");
        let check = 0;
        dkcn.ThongTin.forEach((element) => {
            if (element.ChuyenNganh.equals(chuyennganh._id) && element.Nganh.equals(nganh._id)){
                if (element.ConLai > 0){
                    check = 1;
                    element.SinhVien.push(sinhvien._id);
                    element.DaDangKy = element.DaDangKy + 1;
                    element.ConLai = element.ToiDa - element.DaDangKy;
                    return;
                }
            }
        });
        if (check == 0)
            return sendError(res, "Hết chỗ đăng ký chuyên ngành này.")
        await DangKyChuyenNganh.findOneAndUpdate({ MaDKCN: MaDKCN }, { ThongTin: dkcn.ThongTin });
        await SinhVien.findOneAndUpdate({ MaSV: MaSV }, { ChuyenNganh: chuyennganh.TenChuyenNganh });

        return sendSuccess(res, "Sinh viên đăng ký chuyên ngành thành công.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/dk-chuyen-nganh/SVHuyDangKyChuyenNganh/{MaDKCN}
 * @description Sinh viên đăng ký chuyên ngành
 * @access public
 */
DangKyChuyenNganhRoute.post('/SVHuyDangKyChuyenNganh/:MaDKCN', verifyToken, verifyUser, async (req, res) => {
    try {
        const err = KtraSVDangKyChuyenNganh(req.body);
        if (err)
            return sendError(res,err);
        const { MaSV, MaNganh, MaChuyenNganh } = req.body;
        const { MaDKCN } = req.params;
        const dkcn = await DangKyChuyenNganh.findOne({ MaDKCN: MaDKCN }).lean();
        if (!dkcn)
            return sendError(res, "Đợt đăng ký chuyên ngành không tồn tại"); 
        const nganh = await Nganh.findOne({ MaNganh: MaNganh });
        if (!nganh)
            return sendError(res, "Ngành này không tồn tại");
        const chuyennganh = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh });
        if (!chuyennganh)
            return sendError(res, "Chuyên ngành này không tồn tại");
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV });
        if (!sinhvien)
            return sendError(res, "Sinh viên này không tồn tại");

        if (sinhvien.Khoa != dkcn.Khoa)
            return sendError(res, "Bạn không được phép đăng ký chuyên ngành");
        if (sinhvien.Nganh != nganh.TenNganh)
            return sendError(res, "Bạn không được phép đăng ký chuyên ngành này");
        if (sinhvien.ChuyenNganh == null)
            return sendError(res, "Bạn chưa đăng ký chuyên ngành nên không thể hủy");

        const KtraDKCN = await DangKyChuyenNganh.aggregate([
            {
                $match: { "MaDKCN": MaDKCN }
            },
            {
                $unwind: '$ThongTin',
            },
            {
                $match: {
                    'ThongTin.Nganh': nganh._id,
                    'ThongTin.ChuyenNganh': chuyennganh._id
                },
            },
        ]);
        if (KtraDKCN.length == 0)
            return sendError(res, "Chuyênh ngành hoặc ngành này không tồn tại.");

        dkcn.ThongTin.forEach((element) => {
            if (element.ChuyenNganh.equals(chuyennganh._id) && element.Nganh.equals(nganh._id)){
                let i = 0;
                element.SinhVien.forEach((data) => {
                    if (data.equals(sinhvien._id)){
                        element.SinhVien.splice(i,1);
                        return;
                    }
                    i++;
                });
                element.DaDangKy = element.DaDangKy - 1;
                element.ConLai = element.ToiDa - element.DaDangKy;
                return;
            }
        });
        await DangKyChuyenNganh.findOneAndUpdate({ MaDKCN: MaDKCN }, { ThongTin: dkcn.ThongTin });
        await SinhVien.findOneAndUpdate({ MaSV: MaSV }, { ChuyenNganh: null });

        return sendSuccess(res, "Sinh viên hủy đăng ký chuyên ngành thành công.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/dk-chuyen-nganh/DSSVDangKyChuyenNganh/{MaDKCN}
 * @description Lấy danh sách sinh viên đăng ký chuyên ngành
 * @access public
 */
DangKyChuyenNganhRoute.post('/DSSVDangKyChuyenNganh/:MaDKCN', async (req, res) => {
    try {
        const { MaNganh, MaChuyenNganh } = req.body;
        const { MaDKCN } = req.params;
        const nganh = await Nganh.findOne({ MaNganh: MaNganh });
        if (!nganh)
            return sendError(res, "Ngành này không tồn tại");
        const chuyennganh = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh });
        if (!chuyennganh)
            return sendError(res, "Chuyên ngành này không tồn tại");
        const isExist = await DangKyChuyenNganh.aggregate([
            {
                $match: { "MaDKCN": MaDKCN }
            },
            {
                $unwind: '$ThongTin',
            },
            {
                $match: {
                    'ThongTin.Nganh': nganh._id,
                    'ThongTin.ChuyenNganh': chuyennganh._id,
                },
            },
            {
                $lookup: {
                    from: "sinhviens",
                    localField: "ThongTin.SinhVien",
                    foreignField: "_id",
                    as: "sv"
                }
            }
        ]);
        if (!isExist)
            return sendError(res, "Không tìm thấy danh sách sinh viên"); 
        return sendSuccess(res, "Lấy danh sách sinh viên thành công.", isExist[0].sv)
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/dk-chuyen-nganh/LayDSChuyenNganhDK
 * @description Lấy danh sách chuyên ngành
 * @access public
 */
DangKyChuyenNganhRoute.post('/LayDSChuyenNganhDK', async (req, res) => {
    try {
        const { TenNganh } = req.body;
        const nganh = await Nganh.findOne({ TenNganh: TenNganh });
        if (!nganh)
            return sendError(res, "Ngành này không tồn tại");

        const isExist = await ChuyenNganh.findOne({ MaNganh: nganh._id });
        if (!isExist)
            return sendError(res, "Danh sách chuyên ngành không tồn tại"); 

        return sendSuccess(res, "Danh sách chuyên ngành.", isExist)
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default DangKyChuyenNganhRoute