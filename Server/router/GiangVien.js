import express from "express"
import fs from 'fs'
import GiangVien from "../model/GiangVien.js";
import { sendError, sendServerError, sendSuccess } from "../helper/client.js";
import { createGiangVienDir } from "../middleware/createDir.js";
import { uploadImg } from "../middleware/storage.js";
import { KtraDuLieuGiangVienKhiChinhSua } from "../validation/GiangVien.js";
import { DeleteHinhTrenCloudinary, UploadHinhLenCloudinary } from "../helper/connectCloudinary.js"

const GiangVienRoute = express.Router()

/**
 * @route GET /api/giang-vien/ChiTietGiangVien/{MaGV}
 * @description Lấy thông tin chi tiết giảng viên
 * @access public
 */
GiangVienRoute.get('/ChiTietGiangVien/:MaGV', async (req, res) => {
    try {
        const { MaGV } = req.params;
        const isExist = await GiangVien.findOne({ MaGV: MaGV }).lean();
        if (!isExist)
            return sendError(res, "Giảng viên không tồn tại");
        return sendSuccess(res, "Chi tiết giảng viên.", isExist);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/giang-vien/ChinhSuaThongTin/{MaGV}
 * @description Chỉnh sửa thông tin giảng viên
 * @access public
*/
GiangVienRoute.post('/ChinhSuaThongTin/:MaGV', createGiangVienDir, uploadImg.single("Hinh"), async (req, res) => {
    try{
        const errors = KtraDuLieuGiangVienKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { HoGV, TenGV, Email, SoDienThoai, GioiTinh, NgaySinh, DonViCongTac, ChuyenNganh, TrinhDo } = req.body;
        const { MaGV } = req.params;
        const giangvien = await GiangVien.findOne({ MaGV: MaGV }).lean();
        if (!giangvien)
            return sendError(res, "Mã giảng viên không tồn tại");
        if (giangvien.Hinh != ''){
            let splitUrl = await giangvien.Hinh.split('/');
            let file = await `${splitUrl[splitUrl.length - 2]}/${splitUrl[splitUrl.length - 1].split('.')[0]}`;
            await DeleteHinhTrenCloudinary(file);
        }
        
        let resultImage = ''
        if (req.file){
            let hoten = HoGV + " " + TenGV;
            let fileImage = await `${req.file.destination}${req.file.filename}`;
            let nameImage = await hoten.normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                                        .replace(/ /g, '') + Date.now();
            resultImage = await UploadHinhLenCloudinary(fileImage, "GiangVien", nameImage);
            if (resultImage) {
                fs.unlinkSync(fileImage, (err) => {
                    console.log(err);
                })
            }
        }
        await GiangVien.findOneAndUpdate({ MaGV: MaGV },{ HoGV, TenGV, Email, SoDienThoai, GioiTinh, NgaySinh, DonViCongTac, ChuyenNganh, TrinhDo, Hinh: resultImage });

        return sendSuccess(res, "Chỉnh sửa thông tin giảng viên thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

export default GiangVienRoute