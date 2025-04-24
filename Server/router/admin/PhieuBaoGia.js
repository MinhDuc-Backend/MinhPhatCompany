import express from "express"
import mongoose from "mongoose";
import fs from 'fs'
import ExcelJS from 'exceljs'
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
// import { DoiDinhDangNgay, XuLyNgaySinh } from "../../helper/XuLyDuLieu.js"
import path from "path"
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import PhieuBaoGia from "../../model/PhieuBaoGia.js"
import KhachHang from "../../model/KhachHang.js"
import { KtraDuLieuPhieuBaoGiaKhiChinhSua, KtraDuLieuPhieuBaoGiaKhiThem, KtraDuLieuSanPhamBaoGia } from "../../validation/PhieuBaoGia.js"
import { DinhDangNgayBaoGia, DinhDangSoBaoGia, TaoMaPhieuBaoGia } from "../../helper/XuLyDuLieu.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PhieuBaoGiaAdminRoute = express.Router()

/**
 * @route GET /api/admin/phieu-bao-gia/DanhSachPBG
 * @description Lấy danh sách các phiếu báo giá
 * @access public
 */
PhieuBaoGiaAdminRoute.get('/DanhSachPBG', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { TenPBG: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const pbg = await PhieuBaoGia.find({ $and: [keywordCondition] }).limit(pageSize).skip(pageSize * page).populate([
            {
                path: "KhachHangPBG",
                select: "HoKH TenKH SoDienThoai",
                populate: {
                    path: "CongTy",
                    select: "MaCongTy TenCongTy"
                }
            }
        ]).sort({ createdAt: -1 })

        if (pbg.length == 0) 
            return sendError(res, "Không tìm thấy danh sách phiếu báo giá.")
        if (pbg) 
            return sendSuccess(res, "Lấy danh sách phiếu báo giá thành công.", { 
                TrangThai: "Thành công",
                SoLuong: pbg.length,
                DanhSach: pbg
            })

        return sendError(res, "Không tìm thấy danh sách phiếu báo giá.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/phieu-bao-gia/ChiTietKLTN/{MaPBG}
 * @description Lấy thông tin chi tiết phiếu báo giá
 * @access public
 */
PhieuBaoGiaAdminRoute.get('/ChiTietPBG/:MaPBG', async (req, res) => {
    try {
        const { MaPBG } = req.params
        const isExist = await PhieuBaoGia.findOne({ MaPBG: MaPBG }).populate([
            {
                path: "KhachHangPBG",
                select: "MaKH HoKH TenKH SoDienThoai Email",
                populate: {
                    path: "CongTy",
                    select: "MaCongTy TenCongTy"
                }
            }
        ]).lean();
        if (!isExist)
            return sendError(res, "Phiếu báo giá không tồn tại"); 

        return sendSuccess(res, "Chi tiết thông tin phiếu báo giá.", isExist)
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/phieu-bao-gia/Them
 * @description Thêm phiếu báo giá
 * @access public
 */
PhieuBaoGiaAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuPhieuBaoGiaKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { NgayBaoGia, TenPBG, KhachHangPBG, ThoiGianGiaoHang, DiaDiemGiaoHang, ThoiGianBaoHanh, ThanhToan, HieuLucBaoGia } = req.body;

        const isExistKhachHang = await KhachHang.findOne({ MaKH: KhachHangPBG }).populate(
            {
                path: "CongTy",
                select: "MaCongTy TenCongTy",
            }).lean();
        if (!isExistKhachHang)
            return sendError(res, "Khách hàng không tồn tại");

        const MaPBG = TaoMaPhieuBaoGia();
        let macty = isExistKhachHang.CongTy
        let sobaogia = DinhDangSoBaoGia(macty.MaCongTy, NgayBaoGia);

        const pbg = await PhieuBaoGia.create({ MaPBG: MaPBG, NgayBaoGia: NgayBaoGia, SoBaoGia: sobaogia, TenPBG: TenPBG, 
                                                KhachHangPBG: isExistKhachHang._id, ThoiGianGiaoHang: ThoiGianGiaoHang, DiaDiemGiaoHang: DiaDiemGiaoHang,
                                                ThoiGianBaoHanh: ThoiGianBaoHanh, ThanhToan: ThanhToan, HieuLucBaoGia: HieuLucBaoGia, SanPhamPBG: [] });
                                            
        return sendSuccess(res, "Thêm phiếu báo giá thành công", pbg);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/phieu-bao-gia/ChinhSua/{MaPBG}
 * @description Chỉnh sửa phiếu báo giá
 * @access public
 */
PhieuBaoGiaAdminRoute.put('/ChinhSua/:MaPBG', async (req, res) => {
    try{
        const errors = KtraDuLieuPhieuBaoGiaKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { NgayBaoGia, TenPBG, KhachHangPBG, ThoiGianGiaoHang, DiaDiemGiaoHang, ThoiGianBaoHanh, ThanhToan, HieuLucBaoGia } = req.body;
        const { MaPBG } = req.params;

        const isExist = await PhieuBaoGia.findOne({ MaPBG: MaPBG }).lean();
        if (!isExist)
            return sendError(res, "Phiếu báo giá không tồn tại"); 

        const isExistKhachHang = await KhachHang.findOne({ MaKH: KhachHangPBG }).populate(
            {
                path: "CongTy",
                select: "MaCongTy TenCongTy",
            }).lean();
        if (!isExistKhachHang)
            return sendError(res, "Khách hàng không tồn tại");

        let macty = isExistKhachHang.CongTy
        let sobaogia = DinhDangSoBaoGia(macty.MaCongTy, NgayBaoGia);

        await PhieuBaoGia.findOneAndUpdate({ MaPBG: MaPBG }, { NgayBaoGia: NgayBaoGia, SoBaoGia: sobaogia, TenPBG: TenPBG, 
                                            KhachHangPBG: isExistKhachHang._id, ThoiGianGiaoHang: ThoiGianGiaoHang, DiaDiemGiaoHang: DiaDiemGiaoHang,
                                            ThoiGianBaoHanh: ThoiGianBaoHanh, ThanhToan: ThanhToan, HieuLucBaoGia: HieuLucBaoGia });
        return sendSuccess(res, "Chỉnh sửa phiếu báo giá thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/phieu-bao-gia/Xoa/{MaPBG}
 * @description Xóa phiếu báo giá
 * @access private
 */
PhieuBaoGiaAdminRoute.delete('/Xoa/:MaPBG', async (req, res) => {
    try {
        const { MaPBG } = req.params
        const isExist = await PhieuBaoGia.findOne({ MaPBG: MaPBG })
        if (!isExist) 
            return sendError(res, "Phiếu báo giá này không tồn tại");
        await PhieuBaoGia.findOneAndDelete({ MaPBG: MaPBG });
        return sendSuccess(res, "Xóa phiếu báo giá thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/phieu-bao-gia/ThemSanPhamBaoGia/{MaPBG}
 * @description Thêm sản phẩm báo giá vào phiếu báo giá
 * @access public
 */
PhieuBaoGiaAdminRoute.post('/ThemSanPhamBaoGia/:MaPBG', async (req, res) => {
    try{
        const errors = KtraDuLieuSanPhamBaoGia(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenSP, QuyCachKyThuat, DonViTinh, SoLuong, Thue, DonGia, ThanhTien, ThanhTienSauThue } = req.body;
        const { MaPBG } = req.params;

        const isExist = await PhieuBaoGia.findOne({ MaPBG: MaPBG }).lean();
        if (!isExist)
            return sendError(res, "Phiếu báo giá không tồn tại");

        let thongtin = {
            TenSP: TenSP,
            QuyCachKyThuat: QuyCachKyThuat,
            DonViTinh: DonViTinh,
            SoLuong: SoLuong,
            Thue: Thue,
            DonGia: DonGia,
            ThanhTien: ThanhTien,
            ThanhTienSauThue: ThanhTienSauThue,
        }
        isExist.SanPhamPBG.push(thongtin);
        const products = isExist.SanPhamPBG;
        const totalTongTien = products.reduce((accumulator, currentProduct) => {
            return accumulator + currentProduct.ThanhTienSauThue;
        }, 0);
        await PhieuBaoGia.findOneAndUpdate({ MaPBG: MaPBG }, { SanPhamPBG: isExist.SanPhamPBG, TongTien: totalTongTien });

        return sendSuccess(res, "Thêm sản phẩm báo giá thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/phieu-bao-gia/ChinhSuaSanPhamBaoGia/{MaPBG}
 * @description Chỉnh sửa sản phẩm báo giá
 * @access public
 */
PhieuBaoGiaAdminRoute.put('/ChinhSuaSanPhamBaoGia/:MaPBG', async (req, res) => {
    try{
        const errors = KtraDuLieuSanPhamBaoGia(req.body)
        if (errors)
            return sendError(res, errors)
        const { id, TenSP, QuyCachKyThuat, DonViTinh, SoLuong, Thue, DonGia, ThanhTien, ThanhTienSauThue } = req.body;
        const { MaPBG } = req.params;

        const isExist = await PhieuBaoGia.findOne({ MaPBG: MaPBG }).lean();
        if (!isExist)
            return sendError(res, "Phiếu báo giá không tồn tại");

        let thongtin = {
            TenSP: TenSP,
            QuyCachKyThuat: QuyCachKyThuat,
            DonViTinh: DonViTinh,
            SoLuong: SoLuong,
            Thue: Thue,
            DonGia: DonGia,
            ThanhTien: ThanhTien,
            ThanhTienSauThue: ThanhTienSauThue,
        }
        if (isExist.SanPhamPBG.length > 0){
            let arr = isExist.SanPhamPBG;
            const index = arr.findIndex(item => item._id.equals(new mongoose.Types.ObjectId(id)));
            if (index !== -1) {
                //Sử dụng spread operator để gộp các thuộc tính (nếu bạn muốn giữ lại các thuộc tính khác)
                arr[index] = { ...arr[index], ...thongtin };
                const totalTongTien = arr.reduce((accumulator, currentProduct) => {
                    return accumulator + currentProduct.ThanhTienSauThue;
                }, 0);
                await PhieuBaoGia.findOneAndUpdate({ MaPBG: MaPBG }, { SanPhamPBG: arr, TongTien: totalTongTien });
            return sendSuccess(res, "Chỉnh sửa sản phẩm báo giá thành công");
            } 
            else 
                return sendError(res, "Không tìm thấy sản phẩm cần chỉnh sửa");
        }
        
        return sendError(res, "Không tìm thấy sản phẩm cần chỉnh sửa");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/phieu-bao-gia/XoaSanPhamBaoGia/{MaPBG}
 * @description Xóa sản phẩm báo giá
 * @access public
 */
PhieuBaoGiaAdminRoute.put('/XoaSanPhamBaoGia/:MaPBG', async (req, res) => {
    try{
        const { id } = req.body;
        const { MaPBG } = req.params;

        const isExist = await PhieuBaoGia.findOne({ MaPBG: MaPBG }).lean();
        if (!isExist)
            return sendError(res, "Phiếu báo giá không tồn tại");

        if (isExist.SanPhamPBG.length > 0){
            let arr = isExist.SanPhamPBG;
            const index = arr.findIndex(item => item._id.equals(new mongoose.Types.ObjectId(id)));
            if (index !== -1) {
                //Sử dụng spread operator để gộp các thuộc tính (nếu bạn muốn giữ lại các thuộc tính khác)
                arr.splice(index,1)
                const totalTongTien = arr.reduce((accumulator, currentProduct) => {
                    return accumulator + currentProduct.ThanhTienSauThue;
                }, 0);
                await PhieuBaoGia.findOneAndUpdate({ MaPBG: MaPBG }, { SanPhamPBG: arr, TongTien: totalTongTien });
                return sendSuccess(res, "Xóa sản phẩm báo giá thành công");
            } 
            else 
                return sendError(res, "Không tìm thấy sản phẩm cần xóa");
        }
        return sendError(res, "Thông tin này không tồn tại nên không thể xóa.");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

// /**
//  * @route GET /api/admin/phieu-bao-gia/ExportFileExcelDsDeTai/{MaPBG}
//  * @description Export file danh sách đề tài và sinh viên đăng ký đề tài
//  * @access public
//  */
// PhieuBaoGiaAdminRoute.get('/ExportFileExcelDsDeTai/:MaPBG', async (req, res) => {
//     try{
//         const { MaPBG } = req.params;
//         const now = new Date();

//         const kltn = await PhieuBaoGia.findOne({ MaPBG: MaPBG }).populate([
//             {
//                 path: "Nganh",
//                 select: "MaNganh TenNganh",
//             },
//             {
//                 path: "DSDeTai",
//                 select: "GVHD",
//                 populate: [
//                     {
//                         path: "GVHD",
//                         select: "MaGV HoGV TenGV DonViCongTac"
//                     },
//                 ]
//             },
//         ]).lean();
//         if (!kltn)
//             return sendError(res, "Đợt phiếu báo giá này không tồn tại");

//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('DS Đăng ký');

//         worksheet.getColumn("A").width = 5;
//         worksheet.getColumn("B").width = 27;
//         worksheet.getColumn("C").width = 14;
//         worksheet.getColumn("D").width = 8;
//         worksheet.getColumn("E").width = 10;
//         worksheet.getColumn("F").width = 30;
//         worksheet.getColumn("G").width = 14;
//         worksheet.getColumn("H").width = 61;
//         worksheet.getColumn("I").width = 19;
//         worksheet.getColumn("J").width = 20;
//         worksheet.getColumn("K").width = 18;
//         worksheet.getColumn("L").width = 9;
//         worksheet.getColumn("M").width = 10;

//         worksheet.getRow(7).height = 28;
//         worksheet.getRow(8).height = 28;

//         const sizeFont = 12;
//         const fontType = "Times New Roman";
//         const borderRound = {
//             top: {style:'thin'},
//             left: {style:'thin'},
//             bottom: {style:'thin'},
//             right: {style:'thin'}
//         };

//         worksheet.mergeCells('A2:M2');
//         const row2 = worksheet.getRow(2).getCell(1);
//         row2.value = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
//         row2.alignment = { vertical: 'middle', horizontal: 'center' };
//         row2.font = { bold: true, size: sizeFont, name: fontType }

//         worksheet.mergeCells('A3:M3');
//         const row3 = worksheet.getRow(3).getCell(1);
//         row3.value = "Độc lập – Tự do – Hạnh phúc";
//         row3.alignment = { vertical: 'middle', horizontal: 'center' };
//         row3.font = { size: sizeFont, name: fontType }

//         worksheet.mergeCells('A4:M4');
//         const row4 = worksheet.getRow(4).getCell(1);
//         row4.value = "Thành phố Hồ Chí Minh, ngày.....tháng.....năm " + now.getFullYear();
//         row4.alignment = { vertical: 'middle', horizontal: 'center' };
//         row4.font = { size: sizeFont, name: fontType }

//         worksheet.mergeCells('A5:M5');
//         const row5 = worksheet.getRow(5).getCell(1);
//         row5.value = kltn.Ten;
//         row5.alignment = { vertical: 'middle', horizontal: 'center' };
//         row5.font = { bold: true, size: sizeFont, name: fontType }

//         worksheet.mergeCells('A6:M6');
//         const row6 = worksheet.getRow(6).getCell(1);
//         row6.value = "Ngành: " + kltn.Nganh.TenNganh + ". Khoa: Công nghệ Thông tin";
//         row6.alignment = { vertical: 'middle', horizontal: 'center' };
//         row6.font = { size: sizeFont, name: fontType }

//         worksheet.mergeCells('A7:A8');
//         const stt = worksheet.getRow(7).getCell(1);
//         stt.value = "STT";
//         stt.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         stt.font = { bold: true, size: sizeFont, name: fontType }
//         stt.border = borderRound;

//         worksheet.mergeCells('B7:C7');
//         const svThucHienDeTai = worksheet.getRow(7).getCell("B");
//         svThucHienDeTai.value = "Sinh viên thực hiện đề tài";
//         svThucHienDeTai.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         svThucHienDeTai.font = { bold: true, size: sizeFont, name: fontType }
//         svThucHienDeTai.border = borderRound

//         const hotensv = worksheet.getRow(8).getCell("B");
//         hotensv.value = "Họ tên sinh viên";
//         hotensv.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         hotensv.font = { bold: true, size: sizeFont, name: fontType }
//         hotensv.border = borderRound

//         const masosv = worksheet.getRow(8).getCell("C");
//         masosv.value = "Mã số SV";
//         masosv.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         masosv.font = { bold: true, size: sizeFont, name: fontType }
//         masosv.border = borderRound

//         worksheet.mergeCells('D7:D8');
//         const sotinchi = worksheet.getRow(7).getCell("D");
//         sotinchi.value = "Số tín chỉ tích lũy";
//         sotinchi.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         sotinchi.font = { bold: true, size: sizeFont, name: fontType }
//         sotinchi.border = borderRound

//         worksheet.mergeCells('E7:E8');
//         const dtbtl = worksheet.getRow(7).getCell("E");
//         dtbtl.value = "Điểm TB tích lũy hệ 4";
//         dtbtl.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         dtbtl.font = { bold: true, size: sizeFont, name: fontType }
//         dtbtl.border = borderRound

//         worksheet.mergeCells('F7:F8');
//         const email = worksheet.getRow(7).getCell("F");
//         email.value = "Email";
//         email.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         email.font = { bold: true, size: sizeFont, name: fontType }
//         email.border = borderRound

//         worksheet.mergeCells('G7:G8');
//         const sdt = worksheet.getRow(7).getCell("G");
//         sdt.value = "Điện thoại";
//         sdt.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         sdt.font = { bold: true, size: sizeFont, name: fontType }
//         sdt.border = borderRound

//         worksheet.mergeCells('H7:H8');
//         const tendetai = worksheet.getRow(7).getCell("H");
//         tendetai.value = "Tên đề tài";
//         tendetai.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         tendetai.font = { bold: true, size: sizeFont, name: fontType }
//         tendetai.border = borderRound

//         worksheet.mergeCells('I7:J7');
//         const gvhuongdan = worksheet.getRow(7).getCell("I");
//         gvhuongdan.value = "Giảng viên hướng dẫn";
//         gvhuongdan.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         gvhuongdan.font = { bold: true, size: sizeFont, name: fontType }
//         gvhuongdan.border = borderRound

//         const hotengv = worksheet.getRow(8).getCell("I");
//         hotengv.value = "Họ tên";
//         hotengv.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         hotengv.font = { bold: true, size: sizeFont, name: fontType }
//         hotengv.border = borderRound

//         const dvcongtac = worksheet.getRow(8).getCell("J");
//         dvcongtac.value = "Đơn vị công tác";
//         dvcongtac.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         dvcongtac.font = { bold: true, size: sizeFont, name: fontType }
//         dvcongtac.border = borderRound

//         worksheet.mergeCells('K7:K8');
//         const ngaybaocao = worksheet.getRow(7).getCell("K");
//         ngaybaocao.value = "Ngày báo cáo";
//         ngaybaocao.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         ngaybaocao.font = { bold: true, size: sizeFont, name: fontType }
//         ngaybaocao.border = borderRound

//         worksheet.mergeCells('L7:L8');
//         const diem = worksheet.getRow(7).getCell("L");
//         diem.value = "Điểm";
//         diem.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         diem.font = { bold: true, size: sizeFont, name: fontType }
//         diem.border = borderRound

//         worksheet.mergeCells('M7:M8');
//         const ghichu = worksheet.getRow(7).getCell("M");
//         ghichu.value = "Ghi chú";
//         ghichu.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//         ghichu.font = { bold: true, size: sizeFont, name: fontType }
//         ghichu.border = borderRound

//         let i = 9;
//         let dem = 1;
//         kltn.DSDeTai.forEach((element) => {
//             if (element.SVChinhThuc.length == 2){
//                 worksheet.getRow(i).height = 28;
//                 worksheet.getRow(i+1).height = 28;

//                 worksheet.mergeCells( 'A' + i + ':A' + (i+1) );
//                 worksheet.getRow(i).getCell("A").value = dem;

//                 worksheet.getRow(i).getCell("B").value = element.SVChinhThuc[0].HoSV + " " + element.SVChinhThuc[0].TenSV;
//                 worksheet.getRow(i+1).getCell("B").value = element.SVChinhThuc[1].HoSV + " " + element.SVChinhThuc[1].TenSV;

//                 worksheet.getRow(i).getCell("C").value = element.SVChinhThuc[0].MaSV;
//                 worksheet.getRow(i+1).getCell("C").value = element.SVChinhThuc[1].MaSV;

//                 worksheet.getRow(i).getCell("D").value = element.SVChinhThuc[0].TinChiTL;
//                 worksheet.getRow(i+1).getCell("D").value = element.SVChinhThuc[1].TinChiTL;

//                 worksheet.getRow(i).getCell("E").value = element.SVChinhThuc[0].DTBTL;
//                 worksheet.getRow(i+1).getCell("E").value = element.SVChinhThuc[1].DTBTL;

//                 worksheet.getRow(i).getCell("F").value = element.SVChinhThuc[0].Email;
//                 worksheet.getRow(i+1).getCell("F").value = element.SVChinhThuc[1].Email;

//                 worksheet.getRow(i).getCell("G").value = element.SVChinhThuc[0].SoDienThoai;
//                 worksheet.getRow(i+1).getCell("G").value = element.SVChinhThuc[1].SoDienThoai;

//                 worksheet.mergeCells( 'H' + i + ':H' + (i+1) );
//                 worksheet.getRow(i).getCell("H").value = element.TenDeTai;

//                 worksheet.mergeCells( 'I' + i + ':I' + (i+1) );
//                 worksheet.getRow(i).getCell("I").value = element.GVHD.HoGV + " " + element.GVHD.TenGV;

//                 worksheet.mergeCells( 'J' + i + ':J' + (i+1) );
//                 worksheet.getRow(i).getCell("J").value = element.GVHD.DonViCongTac;

//                 worksheet.mergeCells( 'K' + i + ':K' + (i+1) );
//                 worksheet.getRow(i).getCell("K").value = "";

//                 worksheet.mergeCells( 'L' + i + ':L' + (i+1) );
//                 worksheet.getRow(i).getCell("L").value = "";

//                 worksheet.mergeCells( 'M' + i + ':M' + (i+1) );
//                 worksheet.getRow(i).getCell("M").value = "";
//                 i++;
//             }
//             if (element.SVChinhThuc.length == 1){
//                 worksheet.getRow(i).height = 28;

//                 worksheet.mergeCells( 'A' + i + ':A' + (i+1) );
//                 worksheet.getRow(i).getCell("A").value = dem;

//                 worksheet.mergeCells( 'B' + i + ':B' + (i+1) );
//                 worksheet.getRow(i).getCell("B").value = element.SVChinhThuc[0].HoSV + " " + element.SVChinhThuc[0].TenSV;

//                 worksheet.mergeCells( 'C' + i + ':C' + (i+1) );
//                 worksheet.getRow(i).getCell("C").value = element.SVChinhThuc[0].MaSV;

//                 worksheet.mergeCells( 'D' + i + ':D' + (i+1) );
//                 worksheet.getRow(i).getCell("D").value = element.SVChinhThuc[0].TinChiTL;

//                 worksheet.mergeCells( 'E' + i + ':E' + (i+1) );
//                 worksheet.getRow(i).getCell("E").value = element.SVChinhThuc[0].DTBTL;

//                 worksheet.mergeCells( 'F' + i + ':F' + (i+1) );
//                 worksheet.getRow(i).getCell("F").value = element.SVChinhThuc[0].Email;

//                 worksheet.mergeCells( 'G' + i + ':G' + (i+1) );
//                 worksheet.getRow(i).getCell("G").value = element.SVChinhThuc[0].SoDienThoai;

//                 worksheet.mergeCells( 'H' + i + ':H' + (i+1) );
//                 worksheet.getRow(i).getCell("H").value = element.TenDeTai;

//                 worksheet.mergeCells( 'I' + i + ':I' + (i+1) );
//                 worksheet.getRow(i).getCell("I").value = element.GVHD.HoGV + " " + element.GVHD.TenGV;

//                 worksheet.mergeCells( 'J' + i + ':J' + (i+1) );
//                 worksheet.getRow(i).getCell("J").value = element.GVHD.DonViCongTac;

//                 worksheet.mergeCells( 'K' + i + ':K' + (i+1) );
//                 worksheet.getRow(i).getCell("K").value = "";

//                 worksheet.mergeCells( 'L' + i + ':L' + (i+1) );
//                 worksheet.getRow(i).getCell("L").value = "";

//                 worksheet.mergeCells( 'M' + i + ':M' + (i+1) );
//                 worksheet.getRow(i).getCell("M").value = "";
//                 i++;
//             }
//             if (element.SVChinhThuc.length == 0){
//                 worksheet.getRow(i).height = 28;
//                 worksheet.getRow(i+1).height = 28;
                
//                 worksheet.mergeCells( 'A' + i + ':A' + (i+1) );
//                 worksheet.getRow(i).getCell("A").value = dem;
                
//                 worksheet.getRow(i).getCell("B").value = "";
//                 worksheet.getRow(i+1).getCell("B").value = "";

//                 worksheet.getRow(i).getCell("C").value = "";
//                 worksheet.getRow(i+1).getCell("C").value = "";

//                 worksheet.getRow(i).getCell("D").value = "";
//                 worksheet.getRow(i+1).getCell("D").value = "";

//                 worksheet.getRow(i).getCell("E").value = "";
//                 worksheet.getRow(i+1).getCell("E").value = "";

//                 worksheet.getRow(i).getCell("F").value = "";
//                 worksheet.getRow(i+1).getCell("F").value = "";

//                 worksheet.getRow(i).getCell("G").value = "";
//                 worksheet.getRow(i+1).getCell("G").value = "";

//                 worksheet.mergeCells( 'H' + i + ':H' + (i+1) );
//                 worksheet.getRow(i).getCell("H").value = element.TenDeTai;

//                 worksheet.mergeCells( 'I' + i + ':I' + (i+1) );
//                 worksheet.getRow(i).getCell("I").value = element.GVHD.HoGV + " " + element.GVHD.TenGV;

//                 worksheet.mergeCells( 'J' + i + ':J' + (i+1) );
//                 worksheet.getRow(i).getCell("J").value = element.GVHD.DonViCongTac;

//                 worksheet.mergeCells( 'K' + i + ':K' + (i+1) );
//                 worksheet.getRow(i).getCell("K").value = "";

//                 worksheet.mergeCells( 'L' + i + ':L' + (i+1) );
//                 worksheet.getRow(i).getCell("L").value = "";

//                 worksheet.mergeCells( 'M' + i + ':M' + (i+1) );
//                 worksheet.getRow(i).getCell("M").value = "";
//                 i++;
//             }
//             dem++;
//             i++;
//         });
//         for (let k = 9; k < i; k++){
//             worksheet.getRow(k).eachCell((cell) => {
//                 cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
//                 cell.font = { size: sizeFont, name: fontType }
//                 cell.border = borderRound
//             });
//         };

//         // Xuất file Excel
//         await res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet")
//         await res.setHeader("Content-Disposition", `attachment; filename=DSDangKyKhoaLuan.xlsx`)
//         return workbook.xlsx.write(res)
//             .then(() => {
//                 res.status(200)
//             })
//             .catch((error) => {
//                 console.error('Lỗi khi xuất file Excel:', error);
//             });
//     }
//     catch (error){
//         console.log(error)
//         return sendServerError(res)
//     }
// })

export default PhieuBaoGiaAdminRoute