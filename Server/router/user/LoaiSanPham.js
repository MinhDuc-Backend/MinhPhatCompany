import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiTonTai } from "../../constant.js"
import LoaiSanPhamCha from "../../model/LoaiSanPhamCha.js"

const LoaiSanPhamUserRoute = express.Router()

/**
 * @route GET /api/user/lsp/DanhSachLSP
 * @description Lấy danh sách loại sản phẩm 
 * @access public
 */
LoaiSanPhamUserRoute.get('/DanhSachLSP', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaLSPCha: { $regex: keyword, $options: "i" } },
                    { TenLoai: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const lspchas = await LoaiSanPhamCha.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).limit(pageSize).skip(pageSize * page)
        const length = await LoaiSanPhamCha.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).count();

        if (lspchas.length == 0) 
            return sendError(res, "Không tìm thấy danh sách loại sản phẩm.")
        if (lspchas) 
            return sendSuccess(res, "Lấy danh sách loại sản phẩm thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: lspchas
            })

        return sendError(res, "Không tìm thấy danh sách loại sản phẩm.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default LoaiSanPhamUserRoute