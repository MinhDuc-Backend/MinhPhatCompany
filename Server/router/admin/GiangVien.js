import express from "express"
import fs from 'fs'
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiGiangVien } from "../../constant.js"
import { uploadImg } from "../../middleware/storage.js"
import { DeleteHinhTrenCloudinary, UploadHinhLenCloudinary } from "../../helper/connectCloudinary.js"
import GiangVien from "../../model/GiangVien.js"
import { createGiangVienDir } from "../../middleware/createDir.js"
import { KtraDuLieuGiangVienKhiChinhSua, KtraDuLieuGiangVienKhiThem } from "../../validation/GiangVien.js"

const GiangVienAdminRoute = express.Router()

/**
 * @route GET /api/admin/giang-vien/DanhSachGiangVien
 * @description Lấy danh sách giang viên
 * @access public
 */
GiangVienAdminRoute.get('/DanhSachGiangVien', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        let trangthai = [TrangThaiGiangVien.ChuaCoTaiKhoan,TrangThaiGiangVien.DaCoTaiKhoan];
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaGV: { $regex: keyword, $options: "i" } },
                    { HoGV: { $regex: keyword, $options: "i" } },
                    { TenGV: { $regex: keyword, $options: "i" } },
                    { Email: { $regex: keyword, $options: "i" } },
                    { SoDienThoai: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const giangviens = await GiangVien.find({ $and: [keywordCondition], TrangThai: trangthai }).limit(pageSize).skip(pageSize * page)
        const length = await GiangVien.find({ $and: [keywordCondition], TrangThai: trangthai }).count();

        if (giangviens.length == 0) 
            return sendError(res, "Không tìm thấy danh sách giảng viên.")
        if (giangviens) 
            return sendSuccess(res, "Lấy danh sách giảng viên thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: giangviens
            })

        return sendError(res, "Không tìm thấy danh sách giảng viên.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/giang-vien/ChiTietGiangVien/{MaGV}
 * @description Lấy thông tin chi tiết giảng viên
 * @access public
 */
GiangVienAdminRoute.get('/ChiTietGiangVien/:MaGV', async (req, res) => {
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
 * @route POST /api/admin/sinh-vien/Them
 * @description Thêm giảng viên
 * @access public
 */
GiangVienAdminRoute.post('/Them', createGiangVienDir, uploadImg.single("Hinh"), async (req, res) => {
    try{
        const errors = KtraDuLieuGiangVienKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaGV, HoGV, TenGV, Email, SoDienThoai, GioiTinh, NgaySinh, DonViCongTac, ChuyenNganh, TrinhDo } = req.body;
        const isExist = await GiangVien.findOne({ MaGV: MaGV }).lean();
        if (isExist)
            return sendError(res, "Mã giảng viên đã tồn tại");
        let hoten = HoGV + " " + TenGV;
        let resultImage = ''
        if (req.file){
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
        const giangvien = await GiangVien.create({ MaGV, HoGV, TenGV, Email, SoDienThoai, GioiTinh, NgaySinh, DonViCongTac, ChuyenNganh, TrinhDo, Hinh: resultImage });

        return sendSuccess(res, "Thêm giảng viên thành công", giangvien);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/giang-vien/ChinhSua/{MaGV}
 * @description Chỉnh sửa thông tin giảng viên
 * @access public
*/
GiangVienAdminRoute.post('/ChinhSua/:MaGV', createGiangVienDir, uploadImg.single("Hinh"), async (req, res) => {
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

/**
 * @route DELETE /api/admin/giang-vien/Xoa/{MaGV}
 * @description Xóa thông tin giảng viên
 * @access private
 */
GiangVienAdminRoute.delete('/Xoa/:MaGV', async (req, res) => {
    try {
        const { MaGV } = req.params
        const isExist = await GiangVien.findOne({ MaGV: MaGV })
        if (!isExist) 
            return sendError(res, "Giảng viên này không tồn tại");

        if (isExist.Hinh != ''){
            let splitUrl = await isExist.Hinh.split('/');
            let file = await `${splitUrl[splitUrl.length - 2]}/${splitUrl[splitUrl.length - 1].split('.')[0]}`;
            await DeleteHinhTrenCloudinary(file);
        }
        await GiangVien.findOneAndDelete({ MaGV: MaGV });
        return sendSuccess(res, "Xóa giảng viên thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default GiangVienAdminRoute