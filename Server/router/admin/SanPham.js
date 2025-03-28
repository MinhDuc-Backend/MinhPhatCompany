import express from "express"
import fs from 'fs'
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiSanPham } from "../../constant.js"
import { uploadImg } from "../../middleware/storage.js"
import { DeleteHinhTrenCloudinary, UploadHinhLenCloudinary } from "../../helper/connectCloudinary.js"
import { createSanPhamDir } from "../../middleware/createDir.js"
import { KtraDuLieuKhiChinhSua, KtraDuLieuKhiThem } from "../../validation/SanPham.js"
import SanPham from "../../model/SanPham.js"
import LoaiSanPhamCha from "../../model/LoaiSanPhamCha.js"
import LoaiSanPhamCon from "../../model/LoaiSanPhamCon.js"

const SanPhamAdminRoute = express.Router()

/**
 * @route GET /api/admin/san-pham/DanhSachSanPham
 * @description Lấy danh sách sản phẩm
 * @access public
 */
SanPhamAdminRoute.get('/DanhSachSanPham', async (req, res) => {
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
                SoLuong: length,
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
 * @route GET /api/admin/san-pham/ChiTietSanPham/{MaSP}
 * @description Lấy thông tin chi tiết sản phẩm
 * @access public
 */
SanPhamAdminRoute.get('/ChiTietSanPham/:MaSP', async (req, res) => {
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
 * @route POST /api/admin/san-pham/Them
 * @description Thêm sản phẩm
 * @access public
 */
SanPhamAdminRoute.post('/Them', createSanPhamDir, uploadImg.single("Hinh"), async (req, res) => {
    try{
        const errors = KtraDuLieuKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaSP, MaLSPCha, MaLSPCon, TenSP, Gia, MoTa, SoLuong } = req.body;

        const isExist = await SanPham.findOne({ MaSP: MaSP }).lean();
        if (isExist)
            return sendError(res, "Mã sản phẩm đã tồn tại");

        const isExistLSPCha = await LoaiSanPhamCha.findOne({ MaLSPCha: MaLSPCha });
        if (!isExistLSPCha)
            return sendError(res, "Mã loại sản phẩm không tồn tại");
        
        let resultImage = ''
        if (req.file){
            let fileImage = await `${req.file.destination}${req.file.filename}`;
            let nameImage = await TenSP.normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                                        .replace(/ /g, '') + Date.now();
            resultImage = await UploadHinhLenCloudinary(fileImage, "SanPham", nameImage);
            if (resultImage) {
                fs.unlinkSync(fileImage, (err) => {
                    console.log(err);
                })
            }
        }

        if (MaLSPCon != ""){
            const isExistLSPCon = await LoaiSanPhamCon.findOne({ MaLSPCon: MaLSPCon });
            if (!isExistLSPCon)
                return sendError(res, "Mã loại sản phẩm con không tồn tại");

            const sanpham = await SanPham.create({ MaSP, MaLSPCha: isExistLSPCha._id, MaLSPCon: isExistLSPCon._id, TenSP, Gia, MoTa, SoLuong, Hinh: resultImage });
            return sendSuccess(res, "Thêm sản phẩm thành công", sanpham);
        }

        const sanpham = await SanPham.create({ MaSP, MaLSPCha: isExistLSPCha._id, TenSP, Gia, MoTa, SoLuong, Hinh: resultImage });
        return sendSuccess(res, "Thêm sản phẩm thành công", sanpham);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/san-pham/ChinhSua/{MaSP}
 * @description Chỉnh sửa thông tin sản phẩm
 * @access public
*/
SanPhamAdminRoute.post('/ChinhSua/:MaSP', async (req, res) => {
    try{
        const errors = KtraDuLieuKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaLSPCha, MaLSPCon, TenSP, Gia, MoTa, SoLuong } = req.body;
        const { MaSP } = req.params;

        const isExistLSPCha = await LoaiSanPhamCha.findOne({ MaLSPCha: MaLSPCha });
        if (!isExistLSPCha)
            return sendError(res, "Mã loại sản phẩm không tồn tại");

        const sanpham = await SanPham.findOne({ MaSP: MaSP }).lean();
        if (!sanpham)
            return sendError(res, "Mã sản phẩm không tồn tại");

        if (MaLSPCon != ""){
            const isExistLSPCon = await LoaiSanPhamCon.findOne({ MaLSPCon: MaLSPCon });
            if (!isExistLSPCon)
                return sendError(res, "Mã loại sản phẩm con không tồn tại");

            const sp = await SanPham.findOneAndUpdate({ MaSP: MaSP }, { MaLSPCha: isExistLSPCha._id, MaLSPCon: isExistLSPCon._id, TenSP, Gia, MoTa, SoLuong });
            return sendSuccess(res, "Chỉnh sửa thông tin sản phẩm thành công", sp);
        }

        const sp = await SanPham.findOneAndUpdate({ MaSP: MaSP }, { MaLSPCha: isExistLSPCha._id, TenSP, Gia, MoTa, SoLuong });
        return sendSuccess(res, "Chỉnh sửa thông tin sản phẩm thành công", sp);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/san-pham/ChinhSuaHinhAnh/{MaSP}
 * @description Chỉnh sửa thông tin sản phẩm
 * @access public
*/
SanPhamAdminRoute.post('/ChinhSuaHinhAnh/:MaSP', createSanPhamDir, uploadImg.single("Hinh"), async (req, res) => {
    try{
        const { MaSP } = req.params;
        const sanpham = await SanPham.findOne({ MaSP: MaSP }).lean();
        if (!sanpham)
            return sendError(res, "Mã sản phẩm không tồn tại");

        if (sanpham.Hinh != ''){
            let splitUrl = await sanpham.Hinh.split('/');
            let file = await `${splitUrl[splitUrl.length - 2]}/${splitUrl[splitUrl.length - 1].split('.')[0]}`;
            await DeleteHinhTrenCloudinary(file);
        }
        
        let resultImage = ''
        if (req.file){
	    let tensp = sanpham.TenSP;
            let fileImage = await `${req.file.destination}${req.file.filename}`;
            let nameImage = await tensp.normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                                        .replace(/ /g, '') + Date.now();
            resultImage = await UploadHinhLenCloudinary(fileImage, "SanPham", nameImage);
            if (resultImage) {
                fs.unlinkSync(fileImage, (err) => {
                    console.log(err);
                })
            }
        }

        const sp = await SanPham.findOneAndUpdate({ MaSP: MaSP }, { Hinh: resultImage });
        return sendSuccess(res, "Chỉnh sửa hình ảnh sản phẩm thành công", sp);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/san-pham/Xoa/{MaSP}
 * @description Xóa thông tin sản phẩm
 * @access private
 */
SanPhamAdminRoute.delete('/Xoa/:MaSP', async (req, res) => {
    try {
        const { MaSP } = req.params
        const isExist = await SanPham.findOne({ MaSP: MaSP })
        if (!isExist) 
            return sendError(res, "Sản phẩm này không tồn tại");

        if (isExist.Hinh != ''){
            let splitUrl = await isExist.Hinh.split('/');
            let file = await `${splitUrl[splitUrl.length - 2]}/${splitUrl[splitUrl.length - 1].split('.')[0]}`;
            await DeleteHinhTrenCloudinary(file);
        }
        
        await SanPham.findOneAndDelete({ MaSP: MaSP });
        return sendSuccess(res, "Xóa sản phẩm thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default SanPhamAdminRoute