import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiTonTai } from "../../constant.js"
import KhachHang from "../../model/KhachHang.js"
import { KtraDuLieuKhachHangKhiThem, KtraDuLieuKhachHangKhiChinhSua } from "../../validation/KhachHang.js"
import CongTy from "../../model/CongTy.js"

const KhachHangAdminRoute = express.Router()

/**
 * @route GET /api/admin/khach-hang/DanhSachKhachHang
 * @description Lấy danh sách khách hàng
 * @access public
 */
KhachHangAdminRoute.get('/DanhSachKhachHang', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        let trangthai = [TrangThaiTonTai.ChuaXoa];
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaKH: { $regex: keyword, $options: "i" } },
                    { HoKH: { $regex: keyword, $options: "i" } },
                    { TenKH: { $regex: keyword, $options: "i" } },
                    { Email: { $regex: keyword, $options: "i" } },
                    { SoDienThoai: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const khachhangs = await KhachHang.find({ $and: [keywordCondition], TrangThai: trangthai }).limit(pageSize).skip(pageSize * page)
                                            .populate(
                                            {
                                                path: "CongTy",
                                                select: "MaCongTy TenCongTy",
                                            }).sort({ createdAt: -1 })
        const length = await KhachHang.find({ $and: [keywordCondition], TrangThai: trangthai }).count();

        if (khachhangs.length == 0) 
            return sendError(res, "Không tìm thấy danh sách khách hàng.")
        if (khachhangs) 
            return sendSuccess(res, "Lấy danh sách khách hàng thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: khachhangs
            })

        return sendError(res, "Không tìm thấy danh sách khách hàng.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/khach-hang/ChiTietKhachHang/{MaKH}
 * @description Lấy thông tin chi tiết khách hàng
 * @access public
 */
KhachHangAdminRoute.get('/ChiTietKhachHang/:MaKH', async (req, res) => {
    try {
        const { MaKH } = req.params;
        const isExist = await KhachHang.findOne({ MaKH: MaKH }).populate(
            {
                path: "CongTy",
                select: "MaCongTy TenCongTy",
            }).lean();
        if (!isExist)
            return sendError(res, "Khách hàng không tồn tại");
        return sendSuccess(res, "Chi tiết thông tin khách hàng.", isExist);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/khach-hang/Them
 * @description Thêm khách hàng
 * @access public
 */
KhachHangAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuKhachHangKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaKH, HoKH, TenKH, Email, SoDienThoai, GioiTinh, MaCongTy } = req.body;
        const isExist = await KhachHang.findOne({ MaKH: MaKH }).lean();
        if (isExist)
            return sendError(res, "Mã khách hàng đã tồn tại");
        const isExistCty = await CongTy.findOne({ MaCongTy: MaCongTy });
        if (!isExistCty)
            return sendError(res, "Công ty này không tồn tại");
        const khachhang = await KhachHang.create({ MaKH, HoKH, TenKH, Email, SoDienThoai, GioiTinh, CongTy: isExistCty._id });

        return sendSuccess(res, "Thêm khách hàng thành công", khachhang);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/khach-hang/ChinhSua/{MaKH}
 * @description Chỉnh sửa thông tin khách hàng
 * @access public
*/
KhachHangAdminRoute.put('/ChinhSua/:MaKH', async (req, res) => {
    try{
        const errors = KtraDuLieuKhachHangKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { HoKH, TenKH, Email, SoDienThoai, GioiTinh, MaCongTy } = req.body;
        const { MaKH } = req.params;
        const khachhang = await KhachHang.findOne({ MaKH: MaKH }).lean();
        if (!khachhang)
            return sendError(res, "Mã khách hàng không tồn tại");
        const isExistCty = await CongTy.findOne({ MaCongTy: MaCongTy });
        if (!isExistCty)
            return sendError(res, "Công ty này không tồn tại");
        
        await KhachHang.findOneAndUpdate({ MaKH: MaKH },{ HoKH, TenKH, Email, SoDienThoai, GioiTinh, CongTy: isExistCty._id });

        return sendSuccess(res, "Chỉnh sửa thông tin khách hàng thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/khach-hang/Xoa/{MaKH}
 * @description Xóa thông tin khách hàng
 * @access private
 */
KhachHangAdminRoute.delete('/Xoa/:MaKH', async (req, res) => {
    try {
        const { MaKH } = req.params
        const isExist = await KhachHang.findOne({ MaKH: MaKH })
        if (!isExist) 
            return sendError(res, "Khách hàng này không tồn tại");
        await KhachHang.findOneAndDelete({ MaKH: MaKH });
        return sendSuccess(res, "Xóa khách hàng thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default KhachHangAdminRoute