import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiTonTai } from "../../constant.js"
import ThongTinCty from "../../model/ThongTinCty.js"
import { KtraDuLieuThongTinCtyKhiChinhSua, KtraDuLieuThongTinCtyKhiThem } from "../../validation/ThongTinCty.js"
import { createThongTinCtyDir } from "../../middleware/createDir.js"
import { uploadImg } from "../../middleware/storage.js"
import { DeleteHinhTrenCloudinary, UploadHinhLenCloudinary } from "../../helper/connectCloudinary.js"
import fs from 'fs'
import NhanVien from "../../model/NhanVien.js"

const ThongTinCtyAdminRoute = express.Router()

/**
 * @route GET /api/admin/thong-tin-cty/ChiTietThongTinCty/{MaTTCty}
 * @description Lấy thông tin chi tiết của công ty
 * @access public
 */
ThongTinCtyAdminRoute.get('/ChiTietThongTinCty/:MaTTCty', async (req, res) => {
    try {
        const { MaTTCty } = req.params;
        const isExist = await ThongTinCty.findOne({ MaTTCty: MaTTCty }).lean();
        if (!isExist)
            return sendError(res, "Thông tin công ty không tồn tại");
        return sendSuccess(res, "Chi tiết thông tin công ty.", {
            ChiTiet: isExist,
        });
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/thong-tin-cty/Them
 * @description Thêm thông tin chi tiết của công ty
 * @access public
 */
ThongTinCtyAdminRoute.post('/Them', createThongTinCtyDir, uploadImg.single("Logo"), async (req, res) => {
    try{
        const errors = KtraDuLieuThongTinCtyKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaTTCty, TenCty, MaSoThue, DiaChi, GiamDoc } = req.body;
        let lienhe = [];

        const isExistMa = await ThongTinCty.findOne({ MaTTCty: MaTTCty }).lean();
        if (isExistMa)
            return sendError(res, "Mã thông tin công ty đã tồn tại");
        const isExistNV = await NhanVien.findOne({ MaNV: GiamDoc }).lean();
        if (!isExistNV)
            return sendError(res, "Mã nhân viên không tồn tại");

        let resultImage = ''
        if (req.file){
            let fileImage = await `${req.file.destination}${req.file.filename}`;
            let nameImage = await MaTTCty.normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                                        .replace(/ /g, '');
            resultImage = await UploadHinhLenCloudinary(fileImage, "ThongTinCty", nameImage);
            if (resultImage) {
                fs.unlinkSync(fileImage, (err) => {
                    console.log(err);
                })
            }
        }

        const ttcty = await ThongTinCty.create({ MaTTCty: MaTTCty, TenCty: TenCty, MaSoThue: MaSoThue, DiaChi: DiaChi, 
                                                Logo: resultImage, GiamDoc: isExistNV._id, LienHe: lienhe 
                                                });
        return sendSuccess(res, "Thêm thông tin công ty thành công", ttcty);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/thong-tin-cty/ChinhSua/{MaTTCty}
 * @description Chỉnh sửa thông tin công ty
 * @access public
 */
ThongTinCtyAdminRoute.put('/ChinhSua/:MaTTCty', async (req, res) => {
    try{
        const errors = KtraDuLieuThongTinCtyKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenCty, MaSoThue, DiaChi } = req.body;
        const { MaTTCty } = req.params;

        const isExistMa = await ThongTinCty.findOne({ MaTTCty: MaTTCty }).lean();
        if (!isExistMa)
            return sendError(res, "Thông tin công ty không tồn tại");

        await ThongTinCty.findOneAndUpdate({ MaTTCty: MaTTCty },{ TenCty: TenCty, MaSoThue: MaSoThue, DiaChi: DiaChi });
        return sendSuccess(res, "Chỉnh sửa thông tin công ty thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/thong-tin-cty/ChinhSuaLogo/{MaTTCty}
 * @description Chỉnh sửa logo công ty
 * @access public
*/
ThongTinCtyAdminRoute.post('/ChinhSuaLogo/:MaTTCty', createThongTinCtyDir, uploadImg.single("Logo"), async (req, res) => {
    try{
        const { MaTTCty } = req.params;

        const isExist = await ThongTinCty.findOne({ MaTTCty: MaTTCty }).lean();
        if (!isExist)
            return sendError(res, "Thông tin công ty không tồn tại");

        if (isExist.Logo != ''){
            let splitUrl = await isExist.Logo.split('/');
            let file = await `${splitUrl[splitUrl.length - 2]}/${splitUrl[splitUrl.length - 1].split('.')[0]}`;
            await DeleteHinhTrenCloudinary(file);
        }
        
        let resultImage = ''
        if (req.file){
            let tenlogo = isExist.MaTTCty;
            let fileImage = await `${req.file.destination}${req.file.filename}`;
            let nameImage = await tenlogo.normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                                        .replace(/ /g, '');
            resultImage = await UploadHinhLenCloudinary(fileImage, "ThongTinCty", nameImage);
            if (resultImage) {
                fs.unlinkSync(fileImage, (err) => {
                    console.log(err);
                })
            }
        }

        const ttcty = await ThongTinCty.findOneAndUpdate({ MaTTCty: MaTTCty }, { Logo: resultImage });
        return sendSuccess(res, "Chỉnh sửa logo công ty thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

export default ThongTinCtyAdminRoute