import express from "express"
import fs from 'fs'
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { CapTaiKhoanChoSinhVienKhiImportFile, TrangThaiSinhVien } from "../../constant.js"
import SinhVien from "../../model/SinhVien.js"
import { createSinhVienDir } from "../../middleware/createDir.js"
import { uploadFile } from "../../middleware/storage.js"
import { KtraDuLieuSinhVienKhiChinhSua, KtraDuLieuSinhVienKhiThem } from "../../validation/SinhVien.js"
import ExcelJS from 'exceljs'
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Nganh from "../../model/Nganh.js"
import TaiKhoan from "../../model/TaiKhoan.js"
import QuyenTaiKhoan from "../../model/QuyenTaiKhoan.js"
import argon2 from "argon2"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const SinhVienAdminRoute = express.Router()

/**
 * @route GET /api/admin/sinh-vien/DanhSachSinhVien
 * @description Lấy danh sách sinh viên
 * @access public
 */
SinhVienAdminRoute.get('/DanhSachSinhVien', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        let trangthai = [TrangThaiSinhVien.ChuaCoTaiKhoan,TrangThaiSinhVien.DaCoTaiKhoan];
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaSV: { $regex: keyword, $options: "i" } },
                    { HoSV: { $regex: keyword, $options: "i" } },
                    { TenSV: { $regex: keyword, $options: "i" } },
                    { Email: { $regex: keyword, $options: "i" } },
                    { SoDienThoai: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const sinhviens = await SinhVien.find({ $and: [keywordCondition], TrangThai: trangthai }).limit(pageSize).skip(pageSize * page)
        const length = await SinhVien.find({ $and: [keywordCondition], TrangThai: trangthai }).count();

        if (sinhviens.length == 0) 
            return sendError(res, "Không tìm thấy danh sách sinh viên.")
        if (sinhviens) 
            return sendSuccess(res, "Lấy danh sách sinh viên thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: sinhviens
            })

        return sendError(res, "Không tìm thấy danh sách sinh viên.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/sinh-vien/ChiTietSinhVien/{MaSV}
 * @description Lấy thông tin chi tiết sinh viên
 * @access public
 */
SinhVienAdminRoute.get('/ChiTietSinhVien/:MaSV', async (req, res) => {
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
 * @route POST /api/admin/sinh-vien/Them
 * @description Thêm sinh viên
 * @access public
 */
SinhVienAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuSinhVienKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaSV, HoSV, TenSV, Email, SoDienThoai, GioiTinh, NgaySinh, Khoa, ChuyenNganh, Nganh, Lop } = req.body;
        const isExist = await SinhVien.findOne({ MaSV: MaSV }).lean();
        if (isExist)
            return sendError(res, "Mã sinh viên đã tồn tại");
        const sinhvien = await SinhVien.create({ MaSV, HoSV, TenSV, Email, SoDienThoai, GioiTinh, NgaySinh, Khoa, ChuyenNganh, Nganh, Lop });

        return sendSuccess(res, "Thêm sinh viên thành công", sinhvien);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/sinh-vien/ChinhSua/{MaSV}
 * @description Chỉnh sửa thông tin sinh viên
 * @access public
*/
SinhVienAdminRoute.put('/ChinhSua/:MaSV', async (req, res) => {
    try{
        const errors = KtraDuLieuSinhVienKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { HoSV, TenSV, Email, SoDienThoai, GioiTinh, NgaySinh, Khoa, ChuyenNganh, Nganh, Lop } = req.body;
        const { MaSV } = req.params;
        const sinhvien = await SinhVien.findOne({ MaSV: MaSV }).lean();
        if (!sinhvien)
            return sendError(res, "Mã sinh viên không tồn tại");
        
        await SinhVien.findOneAndUpdate({ MaSV: MaSV },{ HoSV, TenSV, Email, SoDienThoai, GioiTinh, NgaySinh, Khoa, ChuyenNganh, Nganh, Lop });

        return sendSuccess(res, "Chỉnh sửa thông tin sinh viên thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/sinh-vien/Xoa/{MaSV}
 * @description Xóa thông tin sinh viên
 * @access private
 */
SinhVienAdminRoute.delete('/Xoa/:MaSV', async (req, res) => {
    try {
        const { MaSV } = req.params
        const isExist = await SinhVien.findOne({ MaSV: MaSV })
        if (!isExist) 
            return sendError(res, "Sinh viên này không tồn tại");
        await SinhVien.findOneAndDelete({ MaSV: MaSV });
        return sendSuccess(res, "Xóa sinh viên thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/sinh-vien/importFileSV
 * @description Import file thông tin sinh viên
 * @access public
 */
SinhVienAdminRoute.post('/importFileSV', createSinhVienDir, uploadFile.single("FileExcel"), async (req, res) => {
    try{
        const { CapTaiKhoan, MatKhauMacDinh } = req.body;
        if (CapTaiKhoan == '' || MatKhauMacDinh == '')
            return sendError(res, "Vui lòng điền đầy đủ thông tin");
        let thongtinCreate = [];
        let thongtinUpdate = [];
        let fileName = path.join(__dirname, `../../public/SinhVien/${req.file.filename}`);
        const nganh = await Nganh.find({});
        const sinhvien = await SinhVien.find({});
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(fileName)
            .then(() => {
                const sheetCount = workbook.worksheets.length;
                for (let i = 1; i <= sheetCount; i++){
                    const worksheet = workbook.getWorksheet(i);
                    worksheet.eachRow((row, rowNumber) => {
                        if ( rowNumber > 1 ){
                            let NganhHoc = nganh.find( ({MaNganh}) => MaNganh === row.getCell("AU").value );
                            let KhoaHoc = row.getCell("AX").value;
                            let ngaysinh = String(row.getCell("D").value)
                            let sv = {
                                MaSV: row.getCell("A").value,
                                HoSV: row.getCell("B").value,
                                TenSV: row.getCell("C").value,
                                NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0] ),
                                DTBTLHK: row.getCell("F").value,
                                Lop: row.getCell("J").value,
                                Nganh: NganhHoc.TenNganh,
                                Khoa: String(KhoaHoc).substring(0,4),
                            }
                            let checkSV = sinhvien.find( ({MaSV}) => MaSV === row.getCell("A").value )
                            if (checkSV)
                                thongtinUpdate.push(sv)
                            else
                                thongtinCreate.push(sv);
                        }
                        
                    });
                }
            })
            .catch(err => {
                console.error(err);
            });
        fs.unlinkSync(fileName, (err) => {
            console.log(err)
        })
        if (CapTaiKhoan == CapTaiKhoanChoSinhVienKhiImportFile.TaoTaiKhoan){
            const qtk = await QuyenTaiKhoan.findOne({ MaQTK: "SINHVIEN" });
            let password = await argon2.hash(MatKhauMacDinh);
            if ( thongtinUpdate.length > 0 ){
                await thongtinUpdate.forEach( async (element) => {
                    let checkSV = sinhvien.find( ({MaSV}) => MaSV === element.MaSV )
                    if (checkSV.MaTK == null){
                        let taikhoan = await TaiKhoan.create({
                                                MaTK: "TK" + element.MaSV,
                                                MaQTK: qtk._id,
                                                TenDangNhap: element.MaSV,
                                                MatKhau: password
                                            })
                        let sv = await SinhVien.findOneAndUpdate({ MaSV: element.MaSV },{ 
                            HoSV: element.HoSV, 
                            TenSV: element.TenSV, 
                            NgaySinh: element.NgaySinh, 
                            Khoa: element.Khoa, 
                            DTBTLHK: element.DTBTLHK, 
                            Nganh: element.Nganh, 
                            Lop : element.Lop,
                            MaTK: taikhoan._id,
                            TrangThai: TrangThaiSinhVien.DaCoTaiKhoan
                        });
                    }
                    else{
                        let sv = await SinhVien.findOneAndUpdate({ MaSV: element.MaSV },{ 
                            HoSV: element.HoSV, 
                            TenSV: element.TenSV, 
                            NgaySinh: element.NgaySinh, 
                            Khoa: element.Khoa, 
                            DTBTLHK: element.DTBTLHK, 
                            Nganh: element.Nganh, 
                            Lop : element.Lop,
                            TrangThai: TrangThaiSinhVien.DaCoTaiKhoan
                        });
                    }
                })
            }
            if (thongtinCreate.length > 0 ){
                await thongtinCreate.forEach( async (element) => {
                    let taikhoan = await TaiKhoan.create({
                        MaTK: "TK" + element.MaSV,
                        MaQTK: qtk._id,
                        TenDangNhap: element.MaSV,
                        MatKhau: password
                    })
                    let sv = await SinhVien.create({ 
                        MaSV: element.MaSV,
                        HoSV: element.HoSV, 
                        TenSV: element.TenSV,
                        NgaySinh: element.NgaySinh, 
                        Khoa: element.Khoa,
                        Nganh: element.Nganh, 
                        Lop: element.Lop ,
                        DTBTLHK: element.DTBTLHK,
                        MaTK: taikhoan._id,
                        TrangThai: TrangThaiSinhVien.DaCoTaiKhoan
                    });
                });
            }
        }
        else{
            if ( thongtinUpdate.length > 0 ){
                await thongtinUpdate.forEach( async (element) => {
                    let sv = await SinhVien.findOneAndUpdate({ MaSV: element.MaSV },{ 
                        HoSV: element.HoSV, 
                        TenSV: element.TenSV, 
                        NgaySinh: element.NgaySinh, 
                        Khoa: element.Khoa, 
                        DTBTLHK: element.DTBTLHK, 
                        Nganh: element.Nganh, 
                        Lop : element.Lop
                    });
                })
            }
            if (thongtinCreate.length > 0 ){
                await thongtinCreate.forEach( async (element) => {
                    let sv = await SinhVien.create({ 
                        MaSV: element.MaSV,
                        HoSV: element.HoSV, 
                        TenSV: element.TenSV,
                        NgaySinh: element.NgaySinh, 
                        Khoa: element.Khoa,
                        Nganh: element.Nganh, 
                        Lop: element.Lop ,
                        DTBTLHK: element.DTBTLHK
                    });
                });
            }
        }
        return sendSuccess(res, "Import file thông tin sinh viên thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

export default SinhVienAdminRoute