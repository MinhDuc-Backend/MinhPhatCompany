import express from "express"
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import { TrangThaiTonTai } from "../../constant.js"
import QuyenTaiKhoan from "../../model/QuyenTaiKhoan.js"
import { KtraDuLieuQuyenTaiKhoanKhiChinhSua, KtraDuLieuQuyenTaiKhoanKhiThem } from "../../validation/QuyenTaiKhoan.js"
import TaiKhoan from "../../model/TaiKhoan.js"
import ChucNang from "../../model/ChucNang.js"

const QuyenTaiKhoanAdminRoute = express.Router()

/**
 * @route GET /api/admin/quyen-tai-khoan/DanhSachQuyenTK
 * @description Lấy danh sách quyền tài khoản
 * @access public
 */
QuyenTaiKhoanAdminRoute.get('/DanhSachQuyenTK', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { MaQTK: { $regex: keyword, $options: "i" } },
                    { TenQuyenTK: { $regex: keyword, $options: "i" } },
                ],
            } : {};
        const quyentks = await QuyenTaiKhoan.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).limit(pageSize).skip(pageSize * page).populate([
            {
                path: "ChucNang",
                select: "MaCN",
                populate: {
                    path: "MaCN",
                    select: "MaCN TenChucNang"
                }
            },
        ]);
        const length = await QuyenTaiKhoan.find({ $and: [keywordCondition], TrangThai: TrangThaiTonTai.ChuaXoa }).count();

        if (quyentks.length == 0) 
            return sendError(res, "Không tìm thấy danh sách quyền tài khoản.")
        if (quyentks) 
            return sendSuccess(res, "Lấy danh sách quyền tài khoản thành công.", { 
                TrangThai: "Thành công",
                SoLuong: length,
                DanhSach: quyentks
            })

        return sendError(res, "Không tìm thấy danh sách quyền tài khoản.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/quyen-tai-khoan/ChiTietQuyenTK/{MaQTK}
 * @description Lấy chi tiết quyền tài khoản
 * @access public
 */
QuyenTaiKhoanAdminRoute.get('/ChiTietQuyenTK/:MaQTK', async (req, res) => {
    try {
        const { MaQTK } = req.params;
        const isExistMa = await QuyenTaiKhoan.findOne({ MaQTK: MaQTK }).populate([
            {
                path: "ChucNang",
                select: "MaCN",
                populate: {
                    path: "MaCN",
                    select: "MaCN TenChucNang"
                }
            },
        ]).lean();
        if (!isExistMa)
            return sendError(res, "Quyền tài khoản không tồn tại");

        return sendSuccess(res, "Chi tiết quyền tài khoản.", isExistMa);
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/quyen-tai-khoan/Them
 * @description Thêm quyền tài khoản
 * @access public
 */
QuyenTaiKhoanAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuQuyenTaiKhoanKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { MaQTK, TenQuyenTK, MaCN, ChucNangCon } = req.body;

        const isExistMa = await QuyenTaiKhoan.findOne({ MaQTK: MaQTK }).lean();
        if (isExistMa)
            return sendError(res, "Mã quyền tài khoản đã tồn tại");

        if (MaCN != "" && ChucNangCon != ""){
            let maChucNang = MaCN.split(';');
            let cnCon = ChucNangCon.split(';');
            let chucnangs = [];
            let dem = 0;
            await maChucNang.forEach( async (element) => {
                const layIDChucNang = await ChucNang.findOne({MaCN: element});
                let object = {
                    MaCN: layIDChucNang._id,
                    ChucNangCon: cnCon[dem].split(','),
                };
                chucnangs.push(object);
                dem++;
                if (dem === maChucNang.length){
                    await QuyenTaiKhoan.create({ MaQTK: MaQTK, TenQuyenTK: TenQuyenTK, ChucNang: chucnangs });
                }
            });
        }
        else
            await QuyenTaiKhoan.create({ MaQTK: MaQTK, TenQuyenTK: TenQuyenTK });
        
        return sendSuccess(res, "Thêm quyền tài khoản thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/quyen-tai-khoan/ChinhSua/{MaQTK}
 * @description Chỉnh sửa thông tin quyền tài khoản
 * @access public
 */
QuyenTaiKhoanAdminRoute.put('/ChinhSua/:MaQTK', async (req, res) => {
    try{
        const errors = KtraDuLieuQuyenTaiKhoanKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenQuyenTK, MaCN, ChucNangCon } = req.body;
        const { MaQTK } = req.params;

        const isExistMa = await QuyenTaiKhoan.findOne({ MaQTK: MaQTK }).lean();
        if (!isExistMa)
            return sendError(res, "Quyền tài khoản không tồn tại");

        if (MaCN != "" && ChucNangCon != ""){
            let maChucNang = MaCN.split(';');
            let cnCon = ChucNangCon.split(';');
            let chucnangs = [];
            let dem = 0;
            await maChucNang.forEach( async (element) => {
                const layIDChucNang = await ChucNang.findOne({MaCN: element});
                let object = {
                    MaCN: layIDChucNang._id,
                    ChucNangCon: cnCon[dem].split(','),
                };
                chucnangs.push(object);
                dem++;
                if (dem === maChucNang.length){
                    await QuyenTaiKhoan.findOneAndUpdate({ MaQTK: MaQTK },{ TenQuyenTK: TenQuyenTK, ChucNang: chucnangs });
                }
            });
        }

        await QuyenTaiKhoan.findOneAndUpdate({ MaQTK: MaQTK },{ TenQuyenTK: TenQuyenTK });
        
        return sendSuccess(res, "Chỉnh sửa quyền tài khoản thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/quyen-tai-khoan/Xoa/{MaQTK}
 * @description Xóa quyền tài khoản
 * @access private
 */
QuyenTaiKhoanAdminRoute.delete('/Xoa/:MaQTK', async (req, res) => {
    try {
        const { MaQTK } = req.params
        const isExist = await QuyenTaiKhoan.findOne({ MaQTK: MaQTK })
        if (!isExist) 
            return sendError(res, "Quyền tài khoản này không tồn tại");
        const KtraTaiKhoan = await TaiKhoan.find({ MaQTK: isExist._id }).lean();
        if (KtraTaiKhoan.length > 0)
            return sendError(res, "Quyền tài khoản này đang còn được phân quyền cho các tài khoản khác.")
        await QuyenTaiKhoan.findOneAndDelete({ MaQTK: MaQTK });
        return sendSuccess(res, "Xóa quyền tài khoản thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

export default QuyenTaiKhoanAdminRoute