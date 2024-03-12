import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiTonTai } from "../../constant.js"
import ChuyenNganh from "../../model/ChuyenNganh.js"
import { KtraDuLieuChuyenNganhKhiChinhSua, KtraDuLieuChuyenNganhKhiThem } from "../../validation/ChuyenNganh.js"
import Nganh from "../../model/Nganh.js"

const ChuyenNganhAdminRoute = express.Router()

/**
 * @route GET /api/admin/chuyen-nganh/DanhSachChuyenNganh
 * @description Lấy danh sách chuyên ngành
 * @access public
 */
ChuyenNganhAdminRoute.get('/DanhSachChuyenNganh', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaChuyenNganh: { $regex: keyword, $options: "i" } },
                    { TenChuyenNganh: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const chuyennganhs = await ChuyenNganh.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).limit(pageSize).skip(pageSize * page).populate(
            {
                path: "MaNganh",
                select: "MaNganh TenNganh",
            })
        const length = await ChuyenNganh.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).count();

        if (chuyennganhs.length == 0) 
            return sendError(res, "Không tìm thấy danh sách chuyên ngành.")
        if (chuyennganhs) 
            return sendSuccess(res, "Lấy danh sách chuyên ngành thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: chuyennganhs
            })

        return sendError(res, "Không tìm thấy danh sách chuyên ngành.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/chuyen-nganh/ChiTietChuyenNganh/{MaChuyenNganh}
 * @description Lấy chi tiết chuyên ngành
 * @access public
 */
ChuyenNganhAdminRoute.get('/ChiTietChuyenNganh/:MaChuyenNganh', async (req, res) => {
    try {
        const { MaChuyenNganh } = req.params;
        const isExist = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh }).populate(
            {
                path: "MaNganh",
                select: "MaNganh TenNganh",
            }).lean();
        if (!isExist)
            return sendError(res, "Chuyên ngành không tồn tại");
        return sendSuccess(res, "Chi tiết chuyên ngành.", isExist);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/chuyen-nganh/Them
 * @description Thêm chuyên ngành
 * @access public
 */
ChuyenNganhAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuChuyenNganhKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaChuyenNganh, MaNganh, TenChuyenNganh } = req.body;

        const isExistMa = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh }).lean();
        if (isExistMa)
            return sendError(res, "Mã chuyên ngành đã tồn tại");
        const isExistTen = await ChuyenNganh.findOne({ TenChuyenNganh: TenChuyenNganh }).lean();
        if (isExistTen)
            return sendError(res, "Tên chuyên ngành đã tồn tại");

        const isExistMaNganh = await Nganh.findOne({ MaNganh: MaNganh }).lean();
        if (!isExistMaNganh)
            return sendError(res, "Mã ngành không tồn tại");

        const chuyennganh = await ChuyenNganh.create({ MaChuyenNganh: MaChuyenNganh, MaNganh: isExistMaNganh._id, TenChuyenNganh: TenChuyenNganh });
        return sendSuccess(res, "Thêm chuyên ngành thành công", chuyennganh);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/chuyen-nganh/ChinhSua/{MaChuyenNganh}
 * @description Chỉnh sửa thông tin chuyên ngành
 * @access public
 */
ChuyenNganhAdminRoute.put('/ChinhSua/:MaChuyenNganh', async (req, res) => {
    try{
        const errors = KtraDuLieuChuyenNganhKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaNganh, TenChuyenNganh } = req.body;
        const { MaChuyenNganh } = req.params;

        const isExistMa = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh }).lean();
        if (!isExistMa)
            return sendError(res, "Chuyên ngành không tồn tại");
        const isExistTen = await ChuyenNganh.findOne({ TenChuyenNganh: TenChuyenNganh }).lean();
        if (isExistTen){
            if (isExistTen.MaChuyenNganh != isExistMa.MaChuyenNganh)
                return sendError(res, "Tên chuyên ngành đã tồn tại");
        }

        const isExistMaNganh = await Nganh.findOne({ MaNganh: MaNganh }).lean();
        if (!isExistMaNganh)
            return sendError(res, "Mã ngành không tồn tại");
        
        await ChuyenNganh.findOneAndUpdate({ MaChuyenNganh: MaChuyenNganh },{ MaNganh: isExistMaNganh._id, TenChuyenNganh: TenChuyenNganh });
        return sendSuccess(res, "Chỉnh sửa chuyên ngành thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/chuyen-nganh/Xoa/{MaChuyenNganh}
 * @description Xóa chuyên ngành
 * @access private
 */
ChuyenNganhAdminRoute.delete('/Xoa/:MaChuyenNganh', async (req, res) => {
    try {
        const { MaChuyenNganh } = req.params
        const isExist = await ChuyenNganh.findOne({ MaChuyenNganh: MaChuyenNganh })
        if (!isExist) 
            return sendError(res, "Chuyên ngành này không tồn tại");
        await ChuyenNganh.findOneAndDelete({ MaChuyenNganh: MaChuyenNganh });
        return sendSuccess(res, "Xóa chuyên ngành thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default ChuyenNganhAdminRoute