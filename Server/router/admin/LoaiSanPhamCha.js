import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiTonTai } from "../../constant.js"
import { KtraDuLieuKhiChinhSua, KtraDuLieuKhiThem } from "../../validation/LoaiSanPhamCha.js"
import LoaiSanPhamCha from "../../model/LoaiSanPhamCha.js"
import LoaiSanPhamCon from "../../model/LoaiSanPhamCon.js"
import SanPham from "../../model/SanPham.js"

const LoaiSanPhamChaAdminRoute = express.Router()

/**
 * @route GET /api/admin/lsp-cha/DanhSachLSPCha
 * @description Lấy danh sách loại sản phẩm cha
 * @access public
 */
LoaiSanPhamChaAdminRoute.get('/DanhSachLSPCha', async (req, res) => {
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
        const lspchas = await LoaiSanPhamCha.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).limit(pageSize).skip(pageSize * page).sort({ createdAt: -1 })
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

/**
 * @route GET /api/admin/lsp-cha/ChiTietLSP/{MaLSPCha}
 * @description Lấy thông tin chi tiết loại sản phẩm cha
 * @access public
 */
LoaiSanPhamChaAdminRoute.get('/ChiTietLSP/:MaLSPCha', async (req, res) => {
    try {
        const { MaLSPCha } = req.params;
        const isExist = await LoaiSanPhamCha.findOne({ MaLSPCha: MaLSPCha }).lean();
        if (!isExist)
            return sendError(res, "Loại sản phẩm không tồn tại");
        const lspcons = await LoaiSanPhamCon.find({ MaLSPCha: isExist._id });
        return sendSuccess(res, "Chi tiết loại sản phẩm.", {
            LSPCha: isExist,
            LSPCon: lspcons
        });
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/lsp-cha/Them
 * @description Thêm loại sản phẩm cha
 * @access public
 */
LoaiSanPhamChaAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaLSPCha, TenLoai } = req.body;

        const isExistMa = await LoaiSanPhamCha.findOne({ MaLSPCha: MaLSPCha }).lean();
        if (isExistMa)
            return sendError(res, "Mã loại sản phẩm đã tồn tại");
        const isExistTen = await LoaiSanPhamCha.findOne({ TenLoai: TenLoai }).lean();
        if (isExistTen)
            return sendError(res, "Tên loại sản phẩm đã tồn tại");

        const lspcha = await LoaiSanPhamCha.create({ MaLSPCha: MaLSPCha, TenLoai: TenLoai });
        return sendSuccess(res, "Thêm loại sản phẩm thành công", lspcha);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/lsp-cha/ChinhSua/{MaLSPCha}
 * @description Chỉnh sửa thông tin loại sản phẩm cha
 * @access public
 */
LoaiSanPhamChaAdminRoute.put('/ChinhSua/:MaLSPCha', async (req, res) => {
    try{
        const errors = KtraDuLieuKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenLoai } = req.body;
        const { MaLSPCha } = req.params;

        const isExistMa = await LoaiSanPhamCha.findOne({ MaLSPCha: MaLSPCha }).lean();
        if (!isExistMa)
            return sendError(res, "Mã loại sản phẩm không tồn tại");
        const isExistTen = await LoaiSanPhamCha.findOne({ TenLoai: TenLoai }).lean();
        if (isExistTen){
            if (isExistTen.MaLSPCha != isExistMa.MaLSPCha)
                return sendError(res, "Tên loại sản phẩm đã tồn tại");
        }
        await LoaiSanPhamCha.findOneAndUpdate({ MaLSPCha: MaLSPCha },{ TenLoai: TenLoai });
        return sendSuccess(res, "Chỉnh sửa loại sản phẩm thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/lsp-cha/Xoa/{MaLSPCha}
 * @description Xóa loại sản phẩm
 * @access private
 */
LoaiSanPhamChaAdminRoute.delete('/Xoa/:MaLSPCha', async (req, res) => {
    try {
        const { MaLSPCha } = req.params

        const isExist = await LoaiSanPhamCha.findOne({ MaLSPCha: MaLSPCha })
        if (!isExist) 
            return sendError(res, "Loại sản phẩm này không tồn tại");

        const KtraLSPCon = await LoaiSanPhamCon.find({ MaLSPCha: isExist._id });
        if (KtraLSPCon.length > 0)
            return sendError(res, "Loại sản phẩm này không thể xóa vì còn loại sản phẩm con liên quan.")

        const KtraSanPham = await SanPham.find({ MaLSPCha: isExist._id });
        if (KtraSanPham.length > 0)
            return sendError(res, "Loại sản phẩm này không thể xóa vì còn sản phẩm liên quan")

        await LoaiSanPhamCha.findOneAndDelete({ MaLSPCha: MaLSPCha });
        return sendSuccess(res, "Xóa loại sản phẩm thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default LoaiSanPhamChaAdminRoute