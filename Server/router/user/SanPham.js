import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiSanPham } from "../../constant.js"
import SanPham from "../../model/SanPham.js"
import LoaiSanPhamCha from "../../model/LoaiSanPhamCha.js"
import LoaiSanPhamCon from "../../model/LoaiSanPhamCon.js"

const SanPhamUserRoute = express.Router()

/**
 * @route GET /api/user/san-pham/DSSanPham
 * @description Lấy danh sách sản phẩm
 * @access public
 */
SanPhamUserRoute.get('/DSSanPham', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        let trangthai = [TrangThaiSanPham.Con,TrangThaiSanPham.Het];
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaSP: { $regex: keyword, $options: "i" } },
                    { TenSP: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const sanphams = await SanPham.find({ $and: [keywordCondition], TrangThaiHangHoa: trangthai }).populate([
            {
                path: "MaLSPCha",
                select: "MaLSPCha TenLoai",
            },
            {
                path: "MaLSPCon",
                select: "MaLSPCon TenLoai",
            },
        ]).limit(pageSize).skip(pageSize * page).sort({ createdAt: -1 })
        const length = await SanPham.find({ $and: [keywordCondition], TrangThaiHangHoa: trangthai }).count();

        if (sanphams.length == 0) 
            return sendError(res, "Không tìm thấy danh sách sản phẩm.")
        if (sanphams) 
            return sendSuccess(res, "Lấy danh sách sản phẩm thành công.", { 
                TrangThai: "Thành công",
                TongSoLuong: length,
                SoLuong: sanphams.length,
                DanhSach: sanphams
            })

        return sendError(res, "Không tìm thấy danh sách sản phẩm.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/user/san-pham/ChiTietSanPham/{MaSP}
 * @description Lấy thông tin chi tiết sản phẩm
 * @access public
 */
SanPhamUserRoute.get('/ChiTietSP/:MaSP', async (req, res) => {
    try {
        const { MaSP } = req.params;
        const isExist = await SanPham.findOne({ MaSP: MaSP }).populate([
            {
                path: "MaLSPCha",
                select: "MaLSPCha TenLoai",
            },
            {
                path: "MaLSPCon",
                select: "MaLSPCon TenLoai",
            },
        ]).lean();

        if (!isExist)
            return sendError(res, "Sản phẩm không tồn tại");
        return sendSuccess(res, "Chi tiết sản phẩm.", isExist);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/user/san-pham/DSSanPhamTheoLoai
 * @description Lấy danh sách sản phẩm theo loại sản phẩm
 * @access public
 */
SanPhamUserRoute.get('/DSSanPhamTheoLoai', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword, MaLSP } = req.query
        let trangthai = [TrangThaiSanPham.Con,TrangThaiSanPham.Het];
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaSP: { $regex: keyword, $options: "i" } },
                    { TenSP: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const isExistLSP = await LoaiSanPhamCon.findOne({ MaLSPCon: MaLSP });
        if (!isExistLSP)
            return sendError(res, "Không tìm thấy mã loại sản phẩm");
        const sanphams = await SanPham.find({ $and: [keywordCondition], TrangThaiHangHoa: trangthai, MaLSPCon: isExistLSP._id }).populate([
            {
                path: "MaLSPCha",
                select: "MaLSPCha TenLoai",
            },
            {
                path: "MaLSPCon",
                select: "MaLSPCon TenLoai",
            },
        ]).limit(pageSize).skip(pageSize * page).sort({ createdAt: -1 })
        const length = await SanPham.find({ $and: [keywordCondition], TrangThaiHangHoa: trangthai, MaLSPCon: isExistLSP._id }).count();

        if (sanphams.length == 0) 
            return sendSuccess(res, "Danh sách sản phẩm trống.",{
                TrangThai: "Thành công",
            })
        if (sanphams) 
            return sendSuccess(res, "Lấy danh sách sản phẩm thành công.", { 
                TrangThai: "Thành công",
                TongSoLuong: length,
                SoLuong: sanphams.length,
                DanhSach: sanphams
            })

        return sendError(res, "Không tìm thấy danh sách sản phẩm.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default SanPhamUserRoute