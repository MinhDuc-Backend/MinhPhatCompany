import express from "express"
import fs from "fs"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiSinhVienTotNghiep, TrangThaiTonTai } from "../../constant.js"
import { createTotNghiepDir } from "../../middleware/createDir.js"
import { uploadFile } from "../../middleware/storage.js"
import path from "path"
import Pdfparser from "pdf2json"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import TotNghiep from "../../model/TotNghiep.js"
import { KtraDuLieuTotNghiepKhiChinhSua, KtraDuLieuTotNghiepKhiThem } from "../../validation/TotNghiep.js"
import Nganh from "../../model/Nganh.js"
import SinhVien from "../../model/SinhVien.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TotNghiepAdminRoute = express.Router();

/**
 * @route GET /api/admin/tot-nghiep/DanhSachDotTotNghiep
 * @description Lấy danh sách đợt tốt nghiệp
 * @access public
 */
TotNghiepAdminRoute.get('/DanhSachDotTotNghiep', async (req, res) => {
    try{
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        let trangthai = [TrangThaiTonTai.ChuaXoa];
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaTN: { $regex: keyword, $options: "i" } },
                    { Ten: { $regex: keyword, $options: "i" } },
                    { NienKhoa: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const tn = await TotNghiep.find({ $and: [keywordCondition], TrangThai: trangthai }).limit(pageSize).skip(pageSize * page)
        const length = await TotNghiep.find({ $and: [keywordCondition], TrangThai: trangthai }).count();

        if (tn.length == 0) 
            return sendError(res, "Không tìm thấy danh sách đợt tốt nghiệp.")
        if (tn) 
            return sendSuccess(res, "Lấy danh sách đợt tốt nghiệp thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: tn
            })

        return sendError(res, "Không tìm thấy danh sách đợt tốt nghiệp.")
    }
    catch(error){
        console.log(error);
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/tot-nghiep/ChiTietDotTotNghiep/{MaTN}
 * @description Xóa danh sách sinh viên đã import
 * @access public
 */
TotNghiepAdminRoute.get('/ChiTietDotTotNghiep/:MaTN', async (req, res) => {
    try{
        const { MaTN } = req.params;
        const isExist = await TotNghiep.findOne({ MaTN: MaTN });
        if (!isExist)
            return sendError(res, "Đợt tốt nghiệp không tồn tại.");

        return sendSuccess(res, "Chi tiết đợt tốt nghiệp", isExist);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})


/**
 * @route POST /api/admin/tot-nghiep/ThemDotTotNghiep
 * @description Thêm đợt cảnh báo học tập hoặc cảnh báo điểm rèn luyện
 * @access public
 */
TotNghiepAdminRoute.post('/ThemDotTotNghiep', createTotNghiepDir, uploadFile.single("FilePDF"), async (req, res) => {
    try{
        const errors = KtraDuLieuTotNghiepKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaTN, Ten, NienKhoa } = req.body;
        const isExist = await TotNghiep.findOne({ MaTN: MaTN });
        if (isExist)
            return sendError(res, "Mã tốt nghiệp đã tồn tại");
        let thongtin = [];
        if (req.file){
            let fileName = path.join(__dirname, `../../public/TotNghiep/${req.file.filename}`);
            const pdfParser = new Pdfparser();
            pdfParser.loadPDF(fileName);

            await pdfParser.on('pdfParser_dataError', errData => {
                console.error(errData.parserError);
            });

            await pdfParser.on('pdfParser_dataReady', async pdfData => {
                let lengthPage = pdfData.Pages.length;
                let NganhHoc = '';
                for (let i = 0 ; i < lengthPage; i++){
                    let lengthTexts = pdfData.Pages[i].Texts.length;
                    for (let j = 0; j < lengthTexts; j++){
                        if (decodeURIComponent(pdfData.Pages[i].Texts[j].R[0].T).includes("Ngành học:")){
                            NganhHoc = String(decodeURIComponent(pdfData.Pages[i].Texts[j].R[0].T)).split(": ")[1];
                        }
                        else{
                            if (decodeURIComponent(pdfData.Pages[i].Texts[j].R[0].T).match(/^[0-9]/) && decodeURIComponent(pdfData.Pages[i].Texts[j+1].R[0].T).match(/^[0-9]{10}/)){
                                let ngaysinh = String(decodeURIComponent(pdfData.Pages[i].Texts[j+4].R[0].T));
                                let sv = {
                                    MaSV: decodeURIComponent(pdfData.Pages[i].Texts[j+1].R[0].T),
                                    HoSV: decodeURIComponent(pdfData.Pages[i].Texts[j+2].R[0].T),
                                    TenSV: decodeURIComponent(pdfData.Pages[i].Texts[j+3].R[0].T),
                                    NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0]),
                                    GioiTinh: decodeURIComponent(pdfData.Pages[i].Texts[j+5].R[0].T),
                                    Lop: decodeURIComponent(pdfData.Pages[i].Texts[j+6].R[0].T),
                                    DTBTL: Number(decodeURIComponent(pdfData.Pages[i].Texts[j+7].R[0].T)),
                                    TinChi: Number(decodeURIComponent(pdfData.Pages[i].Texts[j+8].R[0].T)),
                                    XepLoaiTN: decodeURIComponent(pdfData.Pages[i].Texts[j+9].R[0].T),
                                    Nganh: NganhHoc,
                                }
                                thongtin.push(sv);
                                let checkSV = await SinhVien.findOne({ MaSV: sv.MaSV });
                                if (checkSV)
                                    await SinhVien.findOneAndUpdate({ MaSV: sv.MaSV }, { DTBTLHK: sv.DTBTL, TrangThaiTotNghiep: TrangThaiSinhVienTotNghiep.DaTotNghiep})
                                j = j+9;
                            }
                        }
                    }
                }
                await TotNghiep.create({ MaTN: MaTN, Ten: Ten, NienKhoa: NienKhoa, ThongTin: thongtin});
            });

            fs.unlinkSync(fileName, (err) => {
                console.log(err)
            });
        }
        else
            await TotNghiep.create({ MaTN: MaTN, Ten: Ten, NienKhoa: NienKhoa, ThongTin: thongtin});
    
        return sendSuccess(res, "Thêm đợt tốt nghiệp thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/tot-nghiep/importFile/{MaTN}
 * @description Import file đợt tốt nghiệp
 * @access public
 */
TotNghiepAdminRoute.post('/importFile/:MaTN', createTotNghiepDir, uploadFile.single("FilePDF"), async (req, res) => {
    try{
        const { MaTN } = req.params;
        let thongtin = [];
        let fileName = path.join(__dirname, `../../public/TotNghiep/${req.file.filename}`);
        const pdfParser = new Pdfparser();
        pdfParser.loadPDF(fileName);

        await pdfParser.on('pdfParser_dataError', errData => {
            console.error(errData.parserError);
        });

        await pdfParser.on('pdfParser_dataReady', async pdfData => {
            let lengthPage = pdfData.Pages.length;
            let NganhHoc = '';
            for (let i = 0 ; i < lengthPage; i++){
                let lengthTexts = pdfData.Pages[i].Texts.length;
                for (let j = 0; j < lengthTexts; j++){
                    if (decodeURIComponent(pdfData.Pages[i].Texts[j].R[0].T).includes("Ngành học:")){
                        NganhHoc = String(decodeURIComponent(pdfData.Pages[i].Texts[j].R[0].T)).split(": ")[1];
                    }
                    else{
                        if (decodeURIComponent(pdfData.Pages[i].Texts[j].R[0].T).match(/^[0-9]/) && decodeURIComponent(pdfData.Pages[i].Texts[j+1].R[0].T).match(/^[0-9]{10}/)){
                            let ngaysinh = String(decodeURIComponent(pdfData.Pages[i].Texts[j+4].R[0].T));
                            let sv = {
                                MaSV: decodeURIComponent(pdfData.Pages[i].Texts[j+1].R[0].T),
                                HoSV: decodeURIComponent(pdfData.Pages[i].Texts[j+2].R[0].T),
                                TenSV: decodeURIComponent(pdfData.Pages[i].Texts[j+3].R[0].T),
                                NgaySinh: new Date(ngaysinh.split("/")[2] + "-" + ngaysinh.split("/")[1] + "-" + ngaysinh.split("/")[0]),
                                GioiTinh: decodeURIComponent(pdfData.Pages[i].Texts[j+5].R[0].T),
                                Lop: decodeURIComponent(pdfData.Pages[i].Texts[j+6].R[0].T),
                                DTBTL: Number(decodeURIComponent(pdfData.Pages[i].Texts[j+7].R[0].T)),
                                TinChi: Number(decodeURIComponent(pdfData.Pages[i].Texts[j+8].R[0].T)),
                                XepLoaiTN: decodeURIComponent(pdfData.Pages[i].Texts[j+9].R[0].T),
                                Nganh: NganhHoc,
                            }
                            thongtin.push(sv);
                            let checkSV = await SinhVien.findOne({ MaSV: sv.MaSV });
                            if (checkSV)
                                await SinhVien.findOneAndUpdate({ MaSV: sv.MaSV }, { DTBTLHK: sv.DTBTL, TrangThaiTotNghiep: TrangThaiSinhVienTotNghiep.DaTotNghiep})
                            j = j+9;
                        }
                    }
                }
            }
            const tn = await TotNghiep.findOne({ MaTN: MaTN });
            thongtin.forEach((element) => {
                tn.ThongTin.push(element);
            });
            await TotNghiep.findOneAndUpdate({ MaTN: MaTN }, { ThongTin: tn.ThongTin });
            
        });
        fs.unlinkSync(fileName, (err) => {
            console.log(err)
        });
        return sendSuccess(res, "Import file thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/tot-nghiep/ChinhSuaThongTin/{MaTN}
 * @description Chỉnh sửa thông tin đợt tốt nghiệp
 * @access public
 */
TotNghiepAdminRoute.post('/ChinhSuaThongTin/:MaTN', async (req, res) => {
    try{
        const errors = KtraDuLieuTotNghiepKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { Ten, NienKhoa } = req.body;
        const { MaTN } = req.params;

        const isExist = await TotNghiep.findOne({ MaTN: MaTN });
        if (!isExist)
            return sendError(res, "Đợt tốt nghiệp không tồn tại");

        await TotNghiep.findOneAndUpdate({ MaTN: MaTN }, { Ten: Ten, NienKhoa: NienKhoa});
        
        return sendSuccess(res, "Chỉnh sửa thông tin đợt tốt nghiệp thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/tot-nghiep/XoaDanhSachSinhVien/{MaTN}
 * @description Xóa danh sách sinh viên đã import
 * @access public
 */
TotNghiepAdminRoute.post('/XoaDanhSachSinhVien/:MaTN', async (req, res) => {
    try{
        const { MaTN } = req.params;
        const isExist = await TotNghiep.findOne({ MaTN: MaTN });
        if (!isExist)
            return sendError(res, "Đợt tốt nghiệp không tồn tại.");
        if (isExist.ThongTin.length == 0)
            return sendError(res, "Danh sách đang trống không cần xóa.");
        let thongtin = [];
        await TotNghiep.findOneAndUpdate({ MaTN: MaTN }, { ThongTin: thongtin });
        
        return sendSuccess(res, "Xóa danh sách sinh viên thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/tot-nghiep/XoaDotTotNghiep/{MaTN}
 * @description Xóa đợt tốt nghiệp
 * @access public
 */
TotNghiepAdminRoute.delete('/XoaDotTotNghiep/:MaTN', async (req, res) => {
    try{
        const { MaTN } = req.params;
        const isExist = await TotNghiep.findOne({ MaTN: MaTN });
        if (!isExist)
            return sendError(res, "Đợt tốt nghiệp không tồn tại.");
        await TotNghiep.findOneAndDelete({ MaTN: MaTN });
        
        return sendSuccess(res, "Xóa đợt tốt nghiệp thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/tot-nghiep/ThongKeTotNghiepSinhVien/{MaTN}
 * @description Thống kê sinh viên tốt nghiệp
 * @access public
 */
TotNghiepAdminRoute.post('/ThongKeTotNghiepSinhVien/:MaTN', async (req, res) => {
    try{
        const { MaTN } = req.params;
        const isExist = await TotNghiep.findOne({ MaTN: MaTN });
        if (!isExist)
            return sendError(res, "Đợt tốt nghiệp không tồn tại.");
        const { ThongKeTheo, LocTheoNganh, KieuThongKe } = req.body;
        let tn = null;
        let data = [];
        if (KieuThongKe == "Xếp loại"){
            if (ThongKeTheo == "Ngành" && LocTheoNganh == "Tất cả"){
                tn = await TotNghiep.aggregate([
                    {
                        $match: { "MaTN": MaTN }
                    },
                    { $unwind: '$ThongTin' },
                    {
                        $group: {
                            _id: { Key: '$ThongTin.Nganh', XepLoaiTN: '$ThongTin.XepLoaiTN' },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort : { "_id.Key": 1 }
                    }
                ]);
                for (let i = 0; i < tn.length ; i++){
                    let demsx = 0;
                    let demgioi = 0;
                    let demkha = 0;
                    let demtb = 0;
                    const element = await TotNghiep.aggregate([
                        {
                            $match: { "MaTN": MaTN }
                        },
                        {
                            $unwind: '$ThongTin',
                        },
                        {
                            $match: {
                                'ThongTin.Nganh': tn[i]._id.Key,
                            },
                        },
                    ]);
                    element.forEach((doc) => {
                        if (doc.XepLoaiTN == "Xuất sắc")
                            demsx++;
                        if (doc.XepLoaiTN == "Giỏi")
                            demgioi++;
                        if (doc.XepLoaiTN == "Khá")
                            demkha++;
                        if (doc.XepLoaiTN == "Trung bình")
                            demtb++;
                    });
                    let thongtin =    {
                        Khoa: tn[i]._id.Key,
                        ThongKe:{
                            XuatSac: demsx,
                            Gioi: demgioi,
                            Kha: demkha,
                            TrungBinh: demtb,
                        }
                    }
                    data.push(thongtin);
                }
            }
            if (ThongKeTheo == "Lớp"){
                if (LocTheoNganh == "Tất cả"){
                    tn = await TotNghiep.aggregate([
                        {
                            $match: { "MaTN": MaTN }
                        },
                        { $unwind: '$ThongTin' },
                        {
                            $group: {
                                _id: { Key: '$ThongTin.Lop', XepLoaiTN: '$ThongTin.XepLoaiTN' },
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $sort : { "_id.Key": 1 }
                        }
                    ]);
                    for (let i = 0; i < tn.length ; i++){
                        let demsx = 0;
                        let demgioi = 0;
                        let demkha = 0;
                        let demtb = 0;
                        const element = await TotNghiep.aggregate([
                            {
                                $match: { "MaTN": MaTN }
                            },
                            {
                                $unwind: '$ThongTin',
                            },
                            {
                                $match: {
                                    'ThongTin.Lop': tn[i]._id.Key,
                                },
                            },
                        ]);
                        element.forEach((doc) => {
                            if (doc.XepLoaiTN == "Xuất sắc")
                                demsx++;
                            if (doc.XepLoaiTN == "Giỏi")
                                demgioi++;
                            if (doc.XepLoaiTN == "Khá")
                                demkha++;
                            if (doc.XepLoaiTN == "Trung bình")
                                demtb++;
                        });
                        let thongtin =    {
                            Khoa: tn[i]._id.Key,
                            ThongKe:{
                                XuatSac: demsx,
                                Gioi: demgioi,
                                Kha: demkha,
                                TrungBinh: demtb,
                            }
                        }
                        data.push(thongtin);
                    }
                }
                else{
                    tn = await TotNghiep.aggregate([
                        {
                            $match: { "MaTN": MaTN }
                        },
                        { $unwind: '$ThongTin' },
                        {
                            $match: { "ThongTin.Nganh": LocTheoNganh }
                        },
                        {
                            $group: {
                                _id: { Key: '$ThongTin.Lop', XepLoaiTN: '$ThongTin.XepLoaiTN' },
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $sort : { "_id.Key": 1 }
                        }
                    ]);
                    for (let i = 0; i < tn.length ; i++){
                        let demsx = 0;
                        let demgioi = 0;
                        let demkha = 0;
                        let demtb = 0;
                        const element = await TotNghiep.aggregate([
                            {
                                $match: { "MaTN": MaTN }
                            },
                            {
                                $unwind: '$ThongTin',
                            },
                            {
                                $match: {
                                    'ThongTin.Lop': tn[i]._id.Key,
                                    'ThongTin.Nganh': LocTheoNganh,
                                },
                            },
                        ]);
                        element.forEach((doc) => {
                            if (doc.XepLoaiTN == "Xuất sắc")
                                demsx++;
                            if (doc.XepLoaiTN == "Giỏi")
                                demgioi++;
                            if (doc.XepLoaiTN == "Khá")
                                demkha++;
                            if (doc.XepLoaiTN == "Trung bình")
                                demtb++;
                        });
                        let thongtin =    {
                            Khoa: tn[i]._id.Key,
                            ThongKe:{
                                XuatSac: demsx,
                                Gioi: demgioi,
                                Kha: demkha,
                                TrungBinh: demtb,
                            }
                        }
                        data.push(thongtin);
                    }
                }
            }
        }
        if (KieuThongKe == "Tốt nghiệp"){
            if (ThongKeTheo == "Ngành" && LocTheoNganh == "Tất cả"){
                tn = await SinhVien.aggregate([
                    {
                        $group: {
                            _id: { Key: '$Nganh', TrangThaiTotNghiep: '$TrangThaiTotNghiep' },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort : { "_id.Key": 1 }
                    }
                ]);
            }
            if (ThongKeTheo == "Lớp"){
                if (LocTheoNganh == "Tất cả"){
                    tn = await SinhVien.aggregate([
                        {
                            $group: {
                                _id: { Key: '$Lop', TrangThaiTotNghiep: '$TrangThaiTotNghiep' },
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $sort : { "_id.Key": 1 }
                        }
                    ]);
                }
                else{
                    tn = await SinhVien.aggregate([
                        {
                            $match: { "Nganh": LocTheoNganh }
                        },
                        {
                            $group: {
                                _id: { Key: '$Lop', TrangThaiTotNghiep: '$TrangThaiTotNghiep' },
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $sort : { "_id.Key": 1 }
                        }
                    ]);
                }
            }
            data = [];
            for (let i = 0; i < tn.length ; i++){
                if (i != tn.length - 1){
                    if (tn[i]._id.Key === tn[i+1]._id.Key){
                        let thongtin = {
                            Khoa: tn[i]._id.Key,
                            ThongKe:{
                                TN: tn[i+1].count,
                                CTN: tn[i].count,
                            }
                        }
                        i++;
                        data.push(thongtin);
                    }
                    else{
                        if (tn[i]._id.TrangThaiTotNghiep == "Đã tốt nghiệp"){
                            let thongtin = {
                                Khoa: tn[i]._id.Key,
                                ThongKe:{
                                    TN: tn[i].count,
                                    CTN: 0,
                                }
                            }
                            data.push(thongtin);
                        }
                        else{
                            let thongtin = {
                                Khoa: tn[i]._id.Key,
                                ThongKe:{
                                    TN: 0,
                                    CTN: tn[i].count,
                                }
                            }
                            data.push(thongtin);
                        }
                    }
                }
                else{
                    if (tn[i]._id.TrangThaiTotNghiep == "Đã tốt nghiệp"){
                        let thongtin = {
                            Khoa: tn[i]._id.Key,
                            ThongKe:{
                                TN: tn[i].count,
                                CTN: 0,
                            }
                        }
                        data.push(thongtin);
                    }
                    else{
                        let thongtin = {
                            Khoa: tn[i]._id.Key,
                            ThongKe:{
                                TN: 0,
                                CTN: tn[i].count,
                            }
                        }
                        data.push(thongtin);
                    }
                }
                
            }
        }
        return sendSuccess(res, "Thống kê sinh viên tốt nghiệp thành công", data);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/tot-nghiep/TraCuuSinhVienTotNghiep
 * @description Tra cứu sinh viên bị cảnh báo
 * @access public
 */
TotNghiepAdminRoute.get('/TraCuuSinhVienTotNghiep', async (req, res) => {
    try{
        const { MaSV } = req.body;
        if (!MaSV.match(/^[0-9]{10}/))
            return sendError(res, "Mã sinh viên không đúng định dạng");
        const tn = await TotNghiep.aggregate([
            {
                $project: {
                    _id: 0, // Loại bỏ trường _id
                    Ten: "$Ten",
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
        return sendSuccess(res, "Tra cứu sinh viên thành công.", {
            TenDotTotNghiep: tn[0].Ten,
            SinhVien: tn[0].ThongTin[0]
        });
    }
    catch(error){
        console.log(error);
        return sendServerError(res);
    }
})

export default TotNghiepAdminRoute