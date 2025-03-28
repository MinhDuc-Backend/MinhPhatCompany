import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiTonTai } from "../../constant.js"
import { KtraDuLieuKhiChinhSua, KtraDuLieuKhiThem } from "../../validation/LoaiSanPhamCon.js"
import LoaiSanPhamCon from "../../model/LoaiSanPhamCon.js"
import LoaiSanPhamCha from "../../model/LoaiSanPhamCha.js"
import SanPham from "../../model/SanPham.js"

const LoaiSanPhamConAdminRoute = express.Router()

/**
 * @route GET /api/admin/lsp-con/DanhSachLSPCon
 * @description Lấy danh sách loại sản phẩm con
 * @access public
 */
LoaiSanPhamConAdminRoute.get('/DanhSachLSPCon', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaLSPCon: { $regex: keyword, $options: "i" } },
                    { TenLoai: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const lspcons = await LoaiSanPhamCon.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).limit(pageSize).skip(pageSize * page).populate(
            {
                path: "MaLSPCha",
                select: "MaLSPCha TenLoai",
            })
        const length = await LoaiSanPhamCon.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).count();

        if (lspcons.length == 0) 
            return sendError(res, "Không tìm thấy danh sách loại sản phẩm con.")
        if (lspcons) 
            return sendSuccess(res, "Lấy danh sách loại sản phẩm con thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: lspcons
            })

        return sendError(res, "Không tìm thấy danh sách loại sản phẩm con.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/lsp-con/ChiTietLSPCon/{MaLSPCon}
 * @description Lấy chi tiết loại sản phẩm con
 * @access public
 */
LoaiSanPhamConAdminRoute.get('/ChiTietLSPCon/:MaLSPCon', async (req, res) => {
    try {
        const { MaLSPCon } = req.params;
        const isExist = await LoaiSanPhamCon.findOne({ MaLSPCon: MaLSPCon }).populate(
            {
                path: "MaLSPCha",
                select: "MaLSPCha TenLoai",
            }).lean();
        if (!isExist)
            return sendError(res, "Loại sản phẩm con không tồn tại");
        return sendSuccess(res, "Chi tiết loại sản phẩm con.", isExist);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/lsp-con/DSLSPConTheoLSPCha/{MaLSPCha}
 * @description Lấy danh sách loại sản phẩm con theo mã loại sản phẩm cha
 * @access public
 */
LoaiSanPhamConAdminRoute.get('/DSLSPConTheoLSPCha/:MaLSPCha', async (req, res) => {
    try {
        const { MaLSPCha } = req.params;
        const isExistLSPCha = await LoaiSanPhamCha.findOne({ MaLSPCha: MaLSPCha });
        if (!isExistLSPCha)
            return sendError(res, "Loại sản phẩm cha không tồn tại");
        const isExist = await LoaiSanPhamCon.find({ MaLSPCha: isExistLSPCha._id }).populate(
            {
                path: "MaLSPCha",
                select: "MaLSPCha TenLoai",
            }).lean();
        if (!isExist)
            return sendError(res, "Loại sản phẩm con không tồn tại");
        return sendSuccess(res, "Danh sách loại sản phẩm con theo mã loại sản phẩm cha.", { 
            TrangThai: "Thành công",
            DanhSach: isExist
        });
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/lsp-con/Them
 * @description Thêm loại sản phẩm con
 * @access public
 */
LoaiSanPhamConAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaLSPCon, MaLSPCha, TenLoai } = req.body;

        const isExistMa = await LoaiSanPhamCon.findOne({ MaLSPCon: MaLSPCon }).lean();
        if (isExistMa)
            return sendError(res, "Mã loại sản phẩm con đã tồn tại");

        const isExistTen = await LoaiSanPhamCon.findOne({ TenLoai: TenLoai }).lean();
        if (isExistTen)
            return sendError(res, "Tên loại sản phẩm con đã tồn tại");

        const isExistMaLSPCha = await LoaiSanPhamCha.findOne({ MaLSPCha: MaLSPCha }).lean();
        if (!isExistMaLSPCha)
            return sendError(res, "Mã loại sản phẩm không tồn tại");

        const lspcon = await LoaiSanPhamCon.create({ MaLSPCon: MaLSPCon, MaLSPCha: isExistMaLSPCha._id, TenLoai: TenLoai });
        return sendSuccess(res, "Thêm loại sản phẩm con thành công", lspcon);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/lsp-con/ChinhSua/{MaLSPCon}
 * @description Chỉnh sửa thông tin loại sản phẩm con
 * @access public
 */
LoaiSanPhamConAdminRoute.put('/ChinhSua/:MaLSPCon', async (req, res) => {
    try{
        const errors = KtraDuLieuKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaLSPCha, TenLoai } = req.body;
        const { MaLSPCon } = req.params;

        const isExistMa = await LoaiSanPhamCon.findOne({ MaLSPCon: MaLSPCon }).lean();
        if (!isExistMa)
            return sendError(res, "Loại sản phẩm con không tồn tại");

        const isExistTen = await LoaiSanPhamCon.findOne({ TenLoai: TenLoai }).lean();
        if (isExistTen){
            if (isExistTen.MaLSPCon != isExistMa.MaLSPCon)
                return sendError(res, "Tên loại sản phẩm con đã tồn tại");
        }

        const isExistMaLSPCha = await LoaiSanPhamCha.findOne({ MaLSPCha: MaLSPCha }).lean();
        if (!isExistMaLSPCha)
            return sendError(res, "Mã loại sản phẩm cha không tồn tại");
        
        await LoaiSanPhamCon.findOneAndUpdate({ MaLSPCon: MaLSPCon },{ MaLSPCha: isExistMaLSPCha._id, TenLoai: TenLoai });
        return sendSuccess(res, "Chỉnh sửa loại sản phẩm con thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/lsp-con/Xoa/{MaLSPCon}
 * @description Xóa chuyên ngành
 * @access private
 */
LoaiSanPhamConAdminRoute.delete('/Xoa/:MaLSPCon', async (req, res) => {
    try {
        const { MaLSPCon } = req.params

        const isExist = await LoaiSanPhamCon.findOne({ MaLSPCon: MaLSPCon })
        if (!isExist) 
            return sendError(res, "Loại sản phẩm con này không tồn tại");

        const KtraSanPham = await SanPham.find({ MaLSPCon: isExist._id });
        if (KtraSanPham.length > 0)
            return sendError(res, "Loại sản phẩm con này không thể xóa vì còn sản phẩm liên quan")

        await LoaiSanPhamCon.findOneAndDelete({ MaLSPCon: MaLSPCon });
        return sendSuccess(res, "Xóa loại sản phẩm con thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default LoaiSanPhamConAdminRoute