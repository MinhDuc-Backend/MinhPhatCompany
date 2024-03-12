import express from "express"
import SinhVien from "../model/SinhVien.js";
import { KtraDuLieuSinhVienKhiChinhSuaClient } from "../validation/SinhVien.js";
import { sendError, sendServerError, sendSuccess } from "../helper/client.js";

const SinhVienRoute = express.Router()

/**
 * @route GET /api/sinh-vien/ChiTietSinhVien/{MaSV}
 * @description Lấy thông tin chi tiết sinh viên
 * @access public
 */
SinhVienRoute.get('/ChiTietSinhVien/:MaSV', async (req, res) => {
    try {
        const { MaSV } = req.params;
        const isExist = await SinhVien.findOne({ MaSV: MaSV }).lean();
        if (!isExist)
            return sendError(res, "Sinh viên không tồn tại");
        return sendSuccess(res, "Chi tiết sinh viên.", isExist);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/sinh-vien/ChinhSuaThongTin/{MaSV}
 * @description Chỉnh sửa thông tin sinh viên
 * @access public
*/
SinhVienRoute.put('/ChinhSuaThongTin/:MaSV', async (req, res) => {
    try{
        const errors = KtraDuLieuSinhVienKhiChinhSuaClient(req.body)
        if (errors)
            return sendError(res, errors)
        const { HoSV, TenSV, Email, SoDienThoai, GioiTinh, NgaySinh } = req.body;
        const { MaSV } = req.params;
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV }).lean();
        if (!sinhvien)
            return sendError(res, "Mã sinh viên không tồn tại");
        
        await SinhVien.findOneAndUpdate({ MaSV: MaSV },{ HoSV: HoSV, TenSV: TenSV, Email: Email, SoDienThoai: SoDienThoai, GioiTinh: GioiTinh, NgaySinh: NgaySinh });

        return sendSuccess(res, "Chỉnh sửa thông tin sinh viên thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

export default SinhVienRoute