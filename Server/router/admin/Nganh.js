import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiTonTai } from "../../constant.js"
import Nganh from "../../model/Nganh.js"
import { KtraDuLieuNganhKhiChinhSua, KtraDuLieuNganhKhiThem } from "../../validation/Nganh.js"
import ChuyenNganh from "../../model/ChuyenNganh.js"

const NganhAdminRoute = express.Router()

/**
 * @route GET /api/admin/nganh/DanhSachNganh
 * @description Lấy danh sách ngành
 * @access public
 */
NganhAdminRoute.get('/DanhSachNganh', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaNganh: { $regex: keyword, $options: "i" } },
                    { TenNganh: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const nganhs = await Nganh.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).limit(pageSize).skip(pageSize * page)
        const length = await Nganh.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).count();

        if (nganhs.length == 0) 
            return sendError(res, "Không tìm thấy danh sách ngành.")
        if (nganhs) 
            return sendSuccess(res, "Lấy danh sách ngành thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: nganhs
            })

        return sendError(res, "Không tìm thấy danh sách ngành.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/nganh/ChiTietNganh/{MaNganh}
 * @description Lấy thông tin chi tiết ngành
 * @access public
 */
NganhAdminRoute.get('/ChiTietNganh/:MaNganh', async (req, res) => {
    try {
        const { MaNganh } = req.params;
        const isExist = await Nganh.findOne({ MaNganh: MaNganh }).lean();
        if (!isExist)
            return sendError(res, "Ngành không tồn tại");
        const chuyennganh = await ChuyenNganh.find({ MaNganh: isExist._id });
        return sendSuccess(res, "Chi tiết ngành.", {
            Nganh: isExist,
            ChuyenNganh: chuyennganh
        });
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/nganh/Them
 * @description Thêm ngành
 * @access public
 */
NganhAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuNganhKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaNganh, TenNganh } = req.body;

        const isExistMa = await Nganh.findOne({ MaNganh: MaNganh }).lean();
        if (isExistMa)
            return sendError(res, "Mã ngành đã tồn tại");
        const isExistTen = await Nganh.findOne({ TenNganh: TenNganh }).lean();
        if (isExistTen)
            return sendError(res, "Tên ngành đã tồn tại");

        const nganh = await Nganh.create({ MaNganh: MaNganh, TenNganh: TenNganh });
        return sendSuccess(res, "Thêm ngành thành công", nganh);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/nganh/ChinhSua/{MaNganh}
 * @description Chỉnh sửa thông tin ngành
 * @access public
 */
NganhAdminRoute.put('/ChinhSua/:MaNganh', async (req, res) => {
    try{
        const errors = KtraDuLieuNganhKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenNganh } = req.body;
        const { MaNganh } = req.params;

        const isExistMa = await Nganh.findOne({ MaNganh: MaNganh }).lean();
        if (!isExistMa)
            return sendError(res, "Ngành không tồn tại");
        const isExistTen = await Nganh.findOne({ TenNganh: TenNganh }).lean();
        if (isExistTen){
            if (isExistTen.MaNganh != isExistMa.MaNganh)
                return sendError(res, "Tên ngành đã tồn tại");
        }
        await Nganh.findOneAndUpdate({ MaNganh: MaNganh },{ TenNganh: TenNganh });
        return sendSuccess(res, "Chỉnh sửa ngành thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/nganh/Xoa/{MaNganh}
 * @description Xóa ngành
 * @access private
 */
NganhAdminRoute.delete('/Xoa/:MaNganh', async (req, res) => {
    try {
        const { MaNganh } = req.params
        const isExist = await Nganh.findOne({ MaNganh: MaNganh })
        if (!isExist) 
            return sendError(res, "Ngành này không tồn tại");
        const KtraChuyenNganh = await ChuyenNganh.find({ MaNganh: isExist._id });
        if (KtraChuyenNganh.length > 0)
            return sendError(res, "Ngành này không thể xóa vì còn chuyên ngành liên quan.")
        await Nganh.findOneAndDelete({ MaNganh: MaNganh });
        return sendSuccess(res, "Xóa ngành thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default NganhAdminRoute