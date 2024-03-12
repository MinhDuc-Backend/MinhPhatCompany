import express from "express"
import fs from "fs"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { KetQuaDRLSinhVien, KieuCanhBaoSV, TrangThaiTonTai } from "../../constant.js"
import { createCanhBaoHocTapDir } from "../../middleware/createDir.js"
import { uploadFile } from "../../middleware/storage.js"
import { KtraDuLieuCBHTKhiChinhSua, KtraDuLieuCBHTKhiThem } from "../../validation/CanhBaoHocTap.js"
import ExcelJS from 'exceljs'
import path from "path"
import Pdfparser from "pdf2json"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import CanhBaoHocTap from "../../model/CanhBaoHocTap.js"
import Nganh from "../../model/Nganh.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CanhBaoHocTapAdminRoute = express.Router();

/**
 * @route GET /api/admin/canh-bao-hoc-tap/DanhSachDotCanhBao
 * @description Lấy danh sách đợt cảnh báo
 * @access public
 */
CanhBaoHocTapAdminRoute.get('/DanhSachDotCanhBao', async (req, res) => {
    try{
        const { KieuCanhBao } = req.query;
        if (KieuCanhBao != KieuCanhBaoSV.DRL && KieuCanhBao != KieuCanhBaoSV.DHT && KieuCanhBao != KieuCanhBaoSV.NoFile)
                return sendError(res,"Kiểu cảnh báo phải là Điểm rèn luyện hoặc là Điểm học tập");
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        let trangthai = [TrangThaiTonTai.ChuaXoa];
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaCBHT: { $regex: keyword, $options: "i" } },
                    { Ten: { $regex: keyword, $options: "i" } },
                    { Dot: { $regex: keyword, $options: "i" } },
                    { NienKhoa: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const cbht = await CanhBaoHocTap.find({ $and: [keywordCondition], TrangThai: trangthai, KieuCanhBao: KieuCanhBao }).limit(pageSize).skip(pageSize * page)
        const length = await CanhBaoHocTap.find({ $and: [keywordCondition], TrangThai: trangthai, KieuCanhBao: KieuCanhBao }).count();

        if (cbht.length == 0) 
            return sendError(res, "Không tìm thấy danh sách đợt cảnh báo.")
        if (cbht) 
            return sendSuccess(res, "Lấy danh sách đợt cảnh báo thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: cbht
            })

        return sendError(res, "Không tìm thấy danh sách đợt cảnh báo.")
    }
    catch(error){
        console.log(error);
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/canh-bao-hoc-tap/ChiTietDotCanhBao/{MaCBHT}
 * @description Chi tiết đợt cảnh báo
 * @access public
 */
CanhBaoHocTapAdminRoute.get('/ChiTietDotCanhBao/:MaCBHT', async (req, res) => {
    try{
        const { MaCBHT } = req.params;
        const isExist = await CanhBaoHocTap.findOne({ MaCBHT: MaCBHT });
        if (!isExist)
            return sendError(res, "Đợt cảnh báo học tập không tồn tại.");

        return sendSuccess(res, "Chi tiết đợt cảnh báo", isExist);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})


/**
 * @route POST /api/admin/canh-bao-hoc-tap/ThemDotCanhBao
 * @description Thêm đợt cảnh báo học tập hoặc cảnh báo điểm rèn luyện
 * @access public
 */
CanhBaoHocTapAdminRoute.post('/ThemDotCanhBao', createCanhBaoHocTapDir, uploadFile.single("FileExcelPDF"), async (req, res) => {
    try{
        const errors = KtraDuLieuCBHTKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaCBHT, Ten, Dot, NienKhoa, KieuCanhBao, KetQuaDRL } = req.body;
        const isExist = await CanhBaoHocTap.findOne({ MaCBHT: MaCBHT });
        if (isExist)
            return sendError(res, "Mã cảnh báo học tập đã tồn tại");
        let thongtin = [];
        if (req.file){
            if (KieuCanhBao != KieuCanhBaoSV.DRL && KieuCanhBao != KieuCanhBaoSV.DHT && KieuCanhBao != KieuCanhBaoSV.NoFile)
                return sendError(res,"Kiểu cảnh báo phải là Điểm rèn luyện hoặc là Điểm học tập");
            let fileName = path.join(__dirname, `../../public/CanhBaoHocTap/${req.file.filename}`);
            if (KieuCanhBao == KieuCanhBaoSV.DHT){
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.readFile(fileName)
                        .then(() => {
                            const sheetCount = workbook.worksheets.length;
                            let NganhHoc = "";
                            let KhoaHoc = "";
                            let LopHoc = "";
                            for (let i = 1; i <= sheetCount; i++){
                                const worksheet = workbook.getWorksheet(i);
                                worksheet.eachRow((row, rowNumber) => {
                                    if ( row.getCell("A").value.richText ){
                                        if ( row.getCell("A").value.richText[0].text.includes("Ngành:") ){
                                            NganhHoc = row.getCell("A").value.richText[0].text.split('(')[1].split(')')[0];
                                        }
                                        if ( row.getCell("A").value.richText[0].text.includes("Khóa học:") ){
                                            KhoaHoc = row.getCell("A").value.richText[0].text.split(': ')[1];
                                        }
                                        if ( row.getCell("A").value.richText[0].text.includes("Lớp:") ){
                                            LopHoc = row.getCell("A").value.richText[0].text.split('(')[1].split(')')[0];
                                        }
                                    }
                                    else{
                                        if (row.cellCount > 12){
                                            let slcblt = '';
                                            let ghichu = '';
                                            if ( row.getCell("H").value != null )
                                                slcblt = row.getCell("H").value;
                                            if ( row.getCell("M").value != null )
                                                ghichu = row.getCell("M").value.richText[0].text;
                                            let ngaysinh = String(row.getCell("E").value);
                                            let sv = {
                                                MaSV: row.getCell("B").value,
                                                HoSV: row.getCell("C").value.richText[0].text,
                                                TenSV: row.getCell("D").value.richText[0].text,
                                                NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0]),
                                                NamThu: row.getCell("F").value,
                                                HocKyThu: row.getCell("G").value,
                                                SoLanCBLienTiep: slcblt,
                                                TongSoLanCB: row.getCell("I").value,
                                                DTBCHK: row.getCell("J").value,
                                                DTBCTL: row.getCell("K").value,
                                                KQ: row.getCell("L").value.richText[0].text,
                                                GhiChu: ghichu,
                                                Lop: LopHoc,
                                                Nganh: NganhHoc,
                                                Khoa: KhoaHoc,
                                            }
                                            thongtin.push(sv);
                                        }
                                        else{
                                            let slcblt = '';
                                            let ghichu = '';
                                            if ( row.getCell("H").value != null )
                                                slcblt = row.getCell("G").value;
                                            if ( row.getCell("M").value != null )
                                                ghichu = row.getCell("L").value.richText[0].text;
                                            let ngaysinh = String(row.getCell("D").value);
                                            let hoten = row.getCell("C").value.richText[0].text.trim();
                                            let ho = hoten.split(' ')[0] + " " + hoten.split(' ')[1];
                                            let ten = hoten.split(' ')[hoten.split(' ').length - 1];
                                            let sv = {
                                                MaSV: row.getCell("B").value,
                                                HoSV: ho,
                                                TenSV: ten,
                                                NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0]),
                                                NamThu: row.getCell("E").value,
                                                HocKyThu: row.getCell("F").value,
                                                SoLanCBLienTiep: slcblt,
                                                TongSoLanCB: row.getCell("H").value,
                                                DTBCHK: row.getCell("I").value,
                                                DTBCTL: row.getCell("J").value,
                                                KQ: row.getCell("K").value.richText[0].text,
                                                GhiChu: ghichu,
                                                Lop: LopHoc,
                                                Nganh: NganhHoc,
                                                Khoa: KhoaHoc,
                                            }
                                            thongtin.push(sv);
                                        }
                                    }
                                });
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        });
                await CanhBaoHocTap.create({ MaCBHT: MaCBHT, Ten: Ten, Dot: Dot, NienKhoa: NienKhoa, KieuCanhBao: KieuCanhBao, ThongTin: thongtin });
            }

            if (KieuCanhBao == KieuCanhBaoSV.DRL){
                if (KetQuaDRL != KetQuaDRLSinhVien.BTH && KetQuaDRL != KetQuaDRLSinhVien.CB && KetQuaDRL != KetQuaDRLSinhVien.TD)
                    return sendError(res, "Kiểu cảnh báo điểm rèn luyện không chính xác");
                const pdfParser = new Pdfparser();
                pdfParser.loadPDF(fileName);

                await pdfParser.on('pdfParser_dataError', errData => {
                    console.error(errData.parserError);
                });

                await pdfParser.on('pdfParser_dataReady', async pdfData => {
                    let lengthPage = pdfData.Pages.length;
                    for (let i = 0 ; i < lengthPage; i++){
                        let lengthTexts = pdfData.Pages[i].Texts.length;
                        for (let j = 0; j < lengthTexts; j++){
                            if (decodeURIComponent(pdfData.Pages[i].Texts[j].R[0].T).match(/^[0-9]/) && decodeURIComponent(pdfData.Pages[i].Texts[j+1].R[0].T).match(/^[0-9]{10}/)){
                                let xeploai = decodeURIComponent(pdfData.Pages[i].Texts[j+8].R[0].T);
                                if (decodeURIComponent(pdfData.Pages[i].Texts[j+7].R[0].T) == 0)
                                    xeploai = 'Kém';
                                let ngaysinh = String(decodeURIComponent(pdfData.Pages[i].Texts[j+5].R[0].T));
                                let sv = {
                                    MaSV: decodeURIComponent(pdfData.Pages[i].Texts[j+1].R[0].T),
                                    HoSV: decodeURIComponent(pdfData.Pages[i].Texts[j+2].R[0].T),
                                    TenSV: decodeURIComponent(pdfData.Pages[i].Texts[j+3].R[0].T),
                                    GioiTinh: decodeURIComponent(pdfData.Pages[i].Texts[j+4].R[0].T),
                                    NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0]),
                                    Lop: decodeURIComponent(pdfData.Pages[i].Texts[j+6].R[0].T),
                                    DiemRenLuyen: decodeURIComponent(pdfData.Pages[i].Texts[j+7].R[0].T),
                                    XepLoaiDRL: xeploai,
                                    KQ: KetQuaDRL,
                                }
                                thongtin.push(sv);
                                if (decodeURIComponent(pdfData.Pages[i].Texts[j+7].R[0].T) == 0 && decodeURIComponent(pdfData.Pages[i].Texts[j+8].R[0].T).match(/^[0-9]/))
                                    j = j +7;
                                else
                                    j = j+8;
                            }
                        }
                    }
                    await CanhBaoHocTap.create({ MaCBHT: MaCBHT, Ten: Ten, Dot: Dot, NienKhoa: NienKhoa, KieuCanhBao: KieuCanhBao, ThongTin: thongtin });
                });
            }   
            fs.unlinkSync(fileName, (err) => {
                console.log(err)
            })
        }
        else
            await CanhBaoHocTap.create({ MaCBHT: MaCBHT, Ten: Ten, Dot: Dot, NienKhoa: NienKhoa, KieuCanhBao: KieuCanhBao, ThongTin: thongtin });
        

        return sendSuccess(res, "Thêm đợt cảnh báo thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/canh-bao-hoc-tap/importFile/{MaCBHT}
 * @description Import file cảnh báo học tập hoặc cảnh báo điểm rèn luyện
 * @access public
 */
CanhBaoHocTapAdminRoute.post('/importFile/:MaCBHT', createCanhBaoHocTapDir, uploadFile.single("FileExcelPDF"), async (req, res) => {
    try{
        const { KieuCanhBao, KetQuaDRL } = req.body;
        const { MaCBHT } = req.params;
        if (KieuCanhBao != KieuCanhBaoSV.DRL && KieuCanhBao != KieuCanhBaoSV.DHT && KieuCanhBao != KieuCanhBaoSV.NoFile)
            return sendError(res,"Kiểu cảnh báo phải là Điểm rèn luyện hoặc là Điểm học tập");
        let thongtin = [];
        let fileName = path.join(__dirname, `../../public/CanhBaoHocTap/${req.file.filename}`);
        if (KieuCanhBao == KieuCanhBaoSV.DHT){
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(fileName)
                    .then(() => {
                        const sheetCount = workbook.worksheets.length;
                        let NganhHoc = "";
                        let KhoaHoc = "";
                        let LopHoc = "";
                        for (let i = 1; i <= sheetCount; i++){
                            const worksheet = workbook.getWorksheet(i);
                            worksheet.eachRow((row, rowNumber) => {
                                if ( row.getCell("A").value.richText ){
                                    if ( row.getCell("A").value.richText[0].text.includes("Ngành:") ){
                                        NganhHoc = row.getCell("A").value.richText[0].text.split('(')[1].split(')')[0];
                                    }
                                    if ( row.getCell("A").value.richText[0].text.includes("Khóa học:") ){
                                        KhoaHoc = row.getCell("A").value.richText[0].text.split(': ')[1];
                                    }
                                    if ( row.getCell("A").value.richText[0].text.includes("Lớp:") ){
                                        if ( row.getCell("A").value.richText[0].text.includes("(CLC)") )
                                            LopHoc = row.getCell("A").value.richText[0].text.split('(')[2].split(')')[0];
                                        else
                                            LopHoc = row.getCell("A").value.richText[0].text.split('(')[1].split(')')[0];
                                    }
                                }
                                else{
                                    if (row.cellCount > 12){
                                        let slcblt = '';
                                        let ghichu = '';
                                        if ( row.getCell("H").value != null )
                                            slcblt = row.getCell("H").value;
                                        if ( row.getCell("M").value != null )
                                            ghichu = row.getCell("M").value.richText[0].text;
                                        let ngaysinh = String(row.getCell("E").value);
                                        let sv = {
                                            MaSV: row.getCell("B").value,
                                            HoSV: row.getCell("C").value.richText[0].text,
                                            TenSV: row.getCell("D").value.richText[0].text,
                                            NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0]),
                                            NamThu: row.getCell("F").value,
                                            HocKyThu: row.getCell("G").value,
                                            SoLanCBLienTiep: slcblt,
                                            TongSoLanCB: row.getCell("I").value,
                                            DTBCHK: row.getCell("J").value,
                                            DTBCTL: row.getCell("K").value,
                                            KQ: row.getCell("L").value.richText[0].text,
                                            GhiChu: ghichu,
                                            Lop: LopHoc,
                                            Nganh: NganhHoc,
                                            Khoa: KhoaHoc,
                                        }
                                        thongtin.push(sv);
                                    }
                                    else{
                                        let slcblt = '';
                                        let ghichu = '';
                                        if ( row.getCell("H").value != null )
                                            slcblt = row.getCell("G").value;
                                        if ( row.getCell("M").value != null )
                                            ghichu = row.getCell("L").value.richText[0].text;
                                        let ngaysinh = String(row.getCell("D").value);
                                        let hoten = row.getCell("C").value.richText[0].text.trim();
                                        let ho = hoten.split(' ')[0] + " " + hoten.split(' ')[1];
                                        let ten = hoten.split(' ')[hoten.split(' ').length - 1];
                                        let sv = {
                                            MaSV: row.getCell("B").value,
                                            HoSV: ho,
                                            TenSV: ten,
                                            NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0]),
                                            NamThu: row.getCell("E").value,
                                            HocKyThu: row.getCell("F").value,
                                            SoLanCBLienTiep: slcblt,
                                            TongSoLanCB: row.getCell("H").value,
                                            DTBCHK: row.getCell("I").value,
                                            DTBCTL: row.getCell("J").value,
                                            KQ: row.getCell("K").value.richText[0].text,
                                            GhiChu: ghichu,
                                            Lop: LopHoc,
                                            Nganh: NganhHoc,
                                            Khoa: KhoaHoc,
                                        }
                                        thongtin.push(sv);
                                    }
                                }
                            });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    });
            const cbht = await CanhBaoHocTap.findOne({ MaCBHT: MaCBHT });
            thongtin.forEach((element) => {
                cbht.ThongTin.push(element);
            });;
            await CanhBaoHocTap.findOneAndUpdate({ MaCBHT: MaCBHT }, { KieuCanhBao: KieuCanhBao, ThongTin: cbht.ThongTin });
        }

        if (KieuCanhBao == KieuCanhBaoSV.DRL){
            if (KetQuaDRL != KetQuaDRLSinhVien.BTH && KetQuaDRL != KetQuaDRLSinhVien.CB && KetQuaDRL != KetQuaDRLSinhVien.TD)
                return sendError(res, "Kiểu cảnh báo điểm rèn luyện không chính xác");
            const pdfParser = new Pdfparser();
            pdfParser.loadPDF(fileName);

            await pdfParser.on('pdfParser_dataError', errData => {
                console.error(errData.parserError);
            });

            await pdfParser.on('pdfParser_dataReady', async pdfData => {
                let lengthPage = pdfData.Pages.length;
                for (let i = 0 ; i < lengthPage; i++){
                    let lengthTexts = pdfData.Pages[i].Texts.length;
                    for (let j = 0; j < lengthTexts; j++){
                        if (decodeURIComponent(pdfData.Pages[i].Texts[j].R[0].T).match(/^[0-9]/) && decodeURIComponent(pdfData.Pages[i].Texts[j+1].R[0].T).match(/^[0-9]{10}/)){
                            let xeploai = decodeURIComponent(pdfData.Pages[i].Texts[j+8].R[0].T);
                            if (decodeURIComponent(pdfData.Pages[i].Texts[j+7].R[0].T) == 0)
                                xeploai = 'Kém';
                            let ngaysinh = String(decodeURIComponent(pdfData.Pages[i].Texts[j+5].R[0].T));
                            let sv = {
                                MaSV: decodeURIComponent(pdfData.Pages[i].Texts[j+1].R[0].T),
                                HoSV: decodeURIComponent(pdfData.Pages[i].Texts[j+2].R[0].T),
                                TenSV: decodeURIComponent(pdfData.Pages[i].Texts[j+3].R[0].T),
                                GioiTinh: decodeURIComponent(pdfData.Pages[i].Texts[j+4].R[0].T),
                                NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0]),
                                Lop: decodeURIComponent(pdfData.Pages[i].Texts[j+6].R[0].T),
                                DiemRenLuyen: decodeURIComponent(pdfData.Pages[i].Texts[j+7].R[0].T),
                                XepLoaiDRL: xeploai,
                                KQ: KetQuaDRL,
                            }
                            thongtin.push(sv);
                            if (decodeURIComponent(pdfData.Pages[i].Texts[j+7].R[0].T) == 0 && decodeURIComponent(pdfData.Pages[i].Texts[j+8].R[0].T).match(/^[0-9]/))
                                j = j +7;
                            else
                                j = j+8;
                        }
                    }
                }
                const cbht = await CanhBaoHocTap.findOne({ MaCBHT: MaCBHT });
                thongtin.forEach((element) => {
                    cbht.ThongTin.push(element);
                });;
                await CanhBaoHocTap.findOneAndUpdate({ MaCBHT: MaCBHT }, { KieuCanhBao: KieuCanhBao, ThongTin: cbht.ThongTin });
            });
        }   
        fs.unlinkSync(fileName, (err) => {
            console.log(err)
        })

        return sendSuccess(res, "Import file thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/canh-bao-hoc-tap/ChinhSuaThongTin/{MaCBHT}
 * @description Chỉnh sửa thông tin đợt cảnh báo học tập hoặc cảnh báo điểm rèn luyện
 * @access public
 */
CanhBaoHocTapAdminRoute.post('/ChinhSuaThongTin/:MaCBHT', async (req, res) => {
    try{
        const errors = KtraDuLieuCBHTKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { Ten, Dot, NienKhoa } = req.body;
        const { MaCBHT } = req.params;

        const isExist = await CanhBaoHocTap.findOne({ MaCBHT: MaCBHT });
        if (!isExist)
            return sendError(res, "Đợt cảnh báo học tập không tồn tại");

        await CanhBaoHocTap.findOneAndUpdate({ MaCBHT: MaCBHT }, { Ten: Ten, Dot: Dot, NienKhoa: NienKhoa});
        
        return sendSuccess(res, "Chỉnh sửa thông tin đợt cảnh báo thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/canh-bao-hoc-tap/XoaDanhSachSinhVien/{MaCBHT}
 * @description Xóa danh sách sinh viên đã import
 * @access public
 */
CanhBaoHocTapAdminRoute.post('/XoaDanhSachSinhVien/:MaCBHT', async (req, res) => {
    try{
        const { MaCBHT } = req.params;
        const isExist = await CanhBaoHocTap.findOne({ MaCBHT: MaCBHT });
        if (!isExist)
            return sendError(res, "Đợt cảnh báo học tập không tồn tại.");
        if (isExist.ThongTin.length == 0)
            return sendError(res, "Danh sách đang trống không cần xóa.");
        let thongtin = [];
        await CanhBaoHocTap.findOneAndUpdate({ MaCBHT: MaCBHT }, { ThongTin: thongtin });
        
        return sendSuccess(res, "Xóa danh sách sinh viên thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/canh-bao-hoc-tap/XoaDotCanhBao/{MaCBHT}
 * @description Xóa đợt cảnh báo
 * @access public
 */
CanhBaoHocTapAdminRoute.delete('/XoaDotCanhBao/:MaCBHT', async (req, res) => {
    try{
        const { MaCBHT } = req.params;
        const isExist = await CanhBaoHocTap.findOne({ MaCBHT: MaCBHT });
        if (!isExist)
            return sendError(res, "Đợt cảnh báo học tập không tồn tại.");
        await CanhBaoHocTap.findOneAndDelete({ MaCBHT: MaCBHT });
        
        return sendSuccess(res, "Xóa đợt cảnh báo thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/canh-bao-hoc-tap/ThongKeCBHTSinhVien/{MaCBHT}
 * @description Thống kê sinh viên bị cảnh báo
 * @access public
 */
CanhBaoHocTapAdminRoute.post('/ThongKeCBHTSinhVien/:MaCBHT', async (req, res) => {
    try{
        const { MaCBHT } = req.params;
        const isExist = await CanhBaoHocTap.findOne({ MaCBHT: MaCBHT });
        if (!isExist)
            return sendError(res, "Đợt cảnh báo học tập không tồn tại.");
        const { ThongKeTheo, LocTheoNganh, LocTheoKhoa } = req.body;
        let cbht = null;
        if (ThongKeTheo == "Ngành" && LocTheoNganh == "Tất cả" && LocTheoKhoa == "Tất cả"){
            cbht = await CanhBaoHocTap.aggregate([
                {
                    $match: { "MaCBHT": MaCBHT }
                },
                { $unwind: '$ThongTin' },
                {
                    $group: {
                        _id: { Key: '$ThongTin.Nganh', KQ: '$ThongTin.KQ' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort : { "_id.Key": 1, "_id.KQ": 1 }
                }
            ]);
        }
        if (ThongKeTheo == "Khóa" && LocTheoKhoa == "Tất cả"){
            if (LocTheoNganh == "Tất cả"){
                cbht = await CanhBaoHocTap.aggregate([
                    {
                        $match: { "MaCBHT": MaCBHT }
                    },
                    { $unwind: '$ThongTin' },
                    {
                        $group: {
                            _id: { Key: '$ThongTin.Khoa', KQ: '$ThongTin.KQ' },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort : { "_id.Key": 1, "_id.KQ": 1 }
                    }
                ]);
            }
            else{
                const manganh = await Nganh.findOne({ TenNganh: LocTheoNganh });
                cbht = await CanhBaoHocTap.aggregate([
                    {
                        $match: { "MaCBHT": MaCBHT }
                    },
                    { $unwind: '$ThongTin' },
                    {
                        $match: { "ThongTin.Nganh": manganh.MaNganh }
                    },
                    {
                        $group: {
                            _id: { Key: '$ThongTin.Khoa', KQ: '$ThongTin.KQ' },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort : { "_id.Key": 1, "_id.KQ": 1 }
                    }
                ]);
            }
        }
        if (ThongKeTheo == "Lớp"){
            if ( LocTheoNganh == "Tất cả" && LocTheoKhoa == "Tất cả" ){
                cbht = await CanhBaoHocTap.aggregate([
                    {
                        $match: { "MaCBHT": MaCBHT }
                    },
                    { $unwind: '$ThongTin' },
                    {
                        $group: {
                            _id: { Key: '$ThongTin.Lop', KQ: '$ThongTin.KQ' },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort : { "_id.Key": 1, "_id.KQ": 1 }
                    }
                ]);
            }
            if ( LocTheoNganh != "Tất cả" && LocTheoKhoa == "Tất cả" ){
                const manganh = await Nganh.findOne({ TenNganh: LocTheoNganh });
                cbht = await CanhBaoHocTap.aggregate([
                    {
                        $match: { "MaCBHT": MaCBHT }
                    },
                    { $unwind: '$ThongTin' },
                    {
                        $match: { "ThongTin.Nganh": manganh.MaNganh }
                    },
                    {
                        $group: {
                            _id: { Key: '$ThongTin.Lop', KQ: '$ThongTin.KQ' },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort : { "_id.Key": 1, "_id.KQ": 1 }
                    }
                ]);
            }
            if ( LocTheoNganh == "Tất cả" && LocTheoKhoa != "Tất cả" ){
                cbht = await CanhBaoHocTap.aggregate([
                    {
                        $match: { "MaCBHT": MaCBHT }
                    },
                    { $unwind: '$ThongTin' },
                    {
                        $match: { "ThongTin.Khoa": LocTheoKhoa }
                    },
                    {
                        $group: {
                            _id: { Key: '$ThongTin.Lop', KQ: '$ThongTin.KQ' },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort : { "_id.Key": 1, "_id.KQ": 1 }
                    }
                ]);
            }
            if ( LocTheoNganh != "Tất cả" && LocTheoKhoa != "Tất cả" ){
                const manganh = await Nganh.findOne({ TenNganh: LocTheoNganh });
                cbht = await CanhBaoHocTap.aggregate([
                    {
                        $match: { "MaCBHT": MaCBHT }
                    },
                    { $unwind: '$ThongTin' },
                    {
                        $match: { "ThongTin.Nganh": manganh.MaNganh, "ThongTin.Khoa": LocTheoKhoa }
                    },
                    {
                        $group: {
                            _id: { Key: '$ThongTin.Lop', KQ: '$ThongTin.KQ' },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort : { "_id.Key": 1, "_id.KQ": 1 }
                    }
                ]);
            }
        }
        let data = [];
        for (let i = 0; i < cbht.length ; i++){
            if (i != cbht.length - 1){
                if (cbht[i]._id.Key === cbht[i+1]._id.Key){
                    let thongtin =    {
                        Khoa: cbht[i]._id.Key,
                        ThongKe:{
                            BTH: cbht[i].count,
                            CC: cbht[i+1].count,
                        }
                    }
                    i++;
                    data.push(thongtin);
                }
                else{
                    if (cbht[i]._id.KQ == "BTH"){
                        let thongtin =    {
                            Khoa: cbht[i]._id.Key,
                            ThongKe:{
                                BTH: cbht[i].count,
                                CC: 0,
                            }
                        }
                        data.push(thongtin);
                    }
                    else{
                        let thongtin =    {
                            Khoa: cbht[i]._id.Key,
                            ThongKe:{
                                BTH: 0,
                                CC: cbht[i].count,
                            }
                        }
                        data.push(thongtin);
                    }
                    
                }
            }
            else{
                if (cbht[i]._id.KQ == "BTH"){
                    let thongtin =    {
                        Khoa: cbht[i]._id.Key,
                        ThongKe:{
                            BTH: cbht[i].count,
                            CC: 0,
                        }
                    }
                    data.push(thongtin);
                }
                else{
                    let thongtin =    {
                        Khoa: cbht[i]._id.Key,
                        ThongKe:{
                            BTH: 0,
                            CC: cbht[i].count,
                        }
                    }
                    data.push(thongtin);
                }
            }
            
        }
        
        return sendSuccess(res, "Thống kê sinh viên bị cảnh báo thành công", data);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/canh-bao-hoc-tap/TraCuuCBHTSinhVien
 * @description Tra cứu sinh viên bị cảnh báo
 * @access public
 */
CanhBaoHocTapAdminRoute.post('/TraCuuCBHTSinhVien', async (req, res) => {
    try{
        const { MaSV } = req.body;
        if (!MaSV.match(/^[0-9]{10}/))
            return sendError(res, "Mã sinh viên không đúng định dạng");
        let drl = [];
        let dht = [];
        const cbht = await CanhBaoHocTap.aggregate([
            {
                $project: {
                    _id: 0, // Loại bỏ trường _id
                    KieuCanhBao: "$KieuCanhBao",
                    ThongTin: {
                        $filter: {
                            input: '$ThongTin',
                            as: 'thongtin',
                            cond: { $eq: ['$$thongtin.MaSV', MaSV] }, // Thêm điều kiện where theo MaSV
                        },
                    },
                },
            },
        ]);
        cbht.forEach((data) => {
            if (data.ThongTin.length != 0){
                if (data.KieuCanhBao == KieuCanhBaoSV.DHT)
                    dht = data.ThongTin;
                else
                    drl = data.ThongTin;
            }
        });
        return sendSuccess(res, "Tra cứu sinh viên thành công.", {
            DiemRenLuyen: drl,
            DiemHocTap: dht,
        });
    }
    catch(error){
        console.log(error);
        return sendServerError(res);
    }
})

export default CanhBaoHocTapAdminRoute