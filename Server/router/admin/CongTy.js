import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiTonTai } from "../../constant.js"
import CongTy from "../../model/CongTy.js"
import { KtraDuLieuCongTyKhiChinhSua, KtraDuLieuCongTyKhiThem } from "../../validation/CongTy.js"

const CongTyAdminRoute = express.Router()

/**
 * @route GET /api/admin/cong-ty/DanhSachCongTy
 * @description Lấy danh sách công ty
 * @access public
 */
CongTyAdminRoute.get('/DanhSachCongTy', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaCongTy: { $regex: keyword, $options: "i" } },
                    { TenCongTy: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const congtys = await CongTy.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).limit(pageSize).skip(pageSize * page).sort({ createdAt: -1 })
        const length = await CongTy.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).count();

        if (congtys.length == 0) 
            return sendError(res, "Không tìm thấy danh sách công ty.")
        if (congtys) 
            return sendSuccess(res, "Lấy danh sách công ty thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: congtys
            })

        return sendError(res, "Không tìm thấy danh sách công ty.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/cong-ty/ChiTietCongTy/{MaCongTy}
 * @description Lấy thông tin chi tiết công ty
 * @access public
 */
CongTyAdminRoute.get('/ChiTietCongTy/:MaCongTy', async (req, res) => {
    try {
        const { MaCongTy } = req.params;
        const isExist = await CongTy.findOne({ MaCongTy: MaCongTy });
        if (!isExist)
            return sendError(res, "Công ty không tồn tại");
        return sendSuccess(res, "Chi tiết công ty.", isExist);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/cong-ty/Them
 * @description Thêm công ty
 * @access public
 */
CongTyAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuCongTyKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaCongTy, TenCongTy, DiaChi } = req.body;

        const isExistMa = await CongTy.findOne({ MaCongTy: MaCongTy }).lean();
        if (isExistMa)
            return sendError(res, "Mã công ty đã tồn tại");
        const isExistTen = await CongTy.findOne({ TenCongTy: TenCongTy }).lean();
        if (isExistTen)
            return sendError(res, "Tên công ty đã tồn tại");

        const congty = await CongTy.create({ MaCongTy: MaCongTy, TenCongTy: TenCongTy, DiaChi: DiaChi });
        return sendSuccess(res, "Thêm công ty thành công", congty);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/cong-ty/ChinhSua/{MaCongTy}
 * @description Chỉnh sửa thông tin công ty
 * @access public
 */
CongTyAdminRoute.put('/ChinhSua/:MaCongTy', async (req, res) => {
    try{
        const errors = KtraDuLieuCongTyKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenCongTy, DiaChi } = req.body;
        const { MaCongTy } = req.params;

        const isExistMa = await CongTy.findOne({ MaCongTy: MaCongTy }).lean();
        if (!isExistMa)
            return sendError(res, "Công ty không tồn tại");
        const isExistTen = await CongTy.findOne({ TenCongTy: TenCongTy }).lean();
        if (isExistTen){
            if (isExistTen.MaCongTy != isExistMa.MaCongTy)
                return sendError(res, "Tên công ty đã tồn tại");
        }

        await CongTy.findOneAndUpdate({ MaCongTy: MaCongTy },{ TenCongTy: TenCongTy, DiaChi: DiaChi });
        return sendSuccess(res, "Chỉnh sửa thông tin công ty thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/cong-ty/Xoa/{MaCongTy}
 * @description Xóa chuyên ngành
 * @access private
 */
CongTyAdminRoute.delete('/Xoa/:MaCongTy', async (req, res) => {
    try {
        const { MaCongTy } = req.params
        const isExist = await CongTy.findOne({ MaCongTy: MaCongTy })
        if (!isExist) 
            return sendError(res, "Công ty này không tồn tại");
        await CongTy.findOneAndDelete({ MaCongTy: MaCongTy });
        return sendSuccess(res, "Xóa công ty thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default CongTyAdminRoute