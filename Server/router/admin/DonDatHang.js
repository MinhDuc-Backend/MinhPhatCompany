import express from "express"
import mongoose from "mongoose";
import fs from 'fs'
import { sendError, sendServerError, sendSuccess } from "../../helper/client.js"
import path from "path"
import PhieuBaoGia from "../../model/PhieuBaoGia.js"
import CongTy from "../../model/CongTy.js"
import { TaoMaDonDatHang } from "../../helper/XuLyDuLieu.js"
import DonDatHang from "../../model/DonDatHang.js";
import { KtraDuLieuDonDatHangKhiChinhSua, KtraDuLieuDonDatHangKhiThem, KtraDuLieuSanPhamDatHang } from "../../validation/DonDatHang.js";

const DonDatHangAdminRoute = express.Router()

/**
 * @route GET /api/admin/don-dat-hang/DanhSachDDH
 * @description Lấy danh sách các đơn đặt hàng
 * @access public
 */
DonDatHangAdminRoute.get('/DanhSachDDH', async (req, res) => {
    try {
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const page = req.query.page ? parseInt(req.query.page) : 0
        const { keyword} = req.query
        var keywordCondition = keyword
            ? {
                $or: [
                    { TenDDH: { $regex: keyword, $options: "i" } },
                    { MaDDH: { $regex: keyword, $options: "i" } }
                ],
            } : {};
        const ddh = await DonDatHang.find({ $and: [keywordCondition] }).limit(pageSize).skip(pageSize * page).populate([
            {
                path: "CongTyDatHang",
                select: "TenCongTy",
            }
        ]).sort({ createdAt: -1 })

        return sendSuccess(res, "Lấy danh sách đơn đặt hàng thành công.", { 
            TrangThai: "Thành công",
            SoLuong: ddh.length,
            DanhSach: ddh
        })

        return sendError(res, "Không tìm thấy danh sách đơn đặt hàng.")
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route GET /api/admin/don-dat-hang/ChiTietDDH/{MaDDH}
 * @description Lấy thông tin chi tiết đơn đặt hàng
 * @access public
 */
DonDatHangAdminRoute.get('/ChiTietDDH/:MaDDH', async (req, res) => {
    try {
        const { MaDDH } = req.params
        const isExist = await DonDatHang.findOne({ MaDDH: MaDDH }).populate([
            {
                path: "CongTyDatHang",
                select: "MaCongTy TenCongTy",
            }
        ]).lean();
        if (!isExist)
            return sendError(res, "Đơn đặt hàng không tồn tại"); 

        return sendSuccess(res, "Chi tiết thông tin đơn đặt hàng.", isExist)
    }
    catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/don-dat-hang/Them
 * @description Thêm đơn đặt hàng
 * @access public
 */
DonDatHangAdminRoute.post('/Them', async (req, res) => {
    try{
        const errors = KtraDuLieuDonDatHangKhiThem(req.body)
        if (errors)
            return sendError(res, errors)
        const { CongTyDatHang, NgayDatHang, NgayHetHan, TenDDH, ThoiHanGiaoHang } = req.body;

        const isExistCongTyDatHang = await CongTy.findOne({ MaCongTy: CongTyDatHang }).lean();
        if (!isExistCongTyDatHang)
            return sendError(res, "Công ty đặt hàng không tồn tại");

        const MaDDH = TaoMaDonDatHang();

        const ddh = await DonDatHang.create({ MaDDH: MaDDH, CongTyDatHang: isExistCongTyDatHang._id, NgayDatHang: NgayDatHang, 
                                            NgayHetHan: NgayHetHan, TenDDH: TenDDH, ThoiHanGiaoHang: ThoiHanGiaoHang, SanPhamDatHang: [] });
        return sendSuccess(res, "Thêm đơn đặt hàng thành công", ddh);
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/don-dat-hang/ChinhSua/{MaDDH}
 * @description Chỉnh sửa đơn đặt hàng
 * @access public
 */
DonDatHangAdminRoute.put('/ChinhSua/:MaDDH', async (req, res) => {
    try{
        const errors = KtraDuLieuDonDatHangKhiChinhSua(req.body)
        if (errors)
            return sendError(res, errors)
        const { CongTyDatHang, NgayDatHang, NgayHetHan, TenDDH, ThoiHanGiaoHang, TrangThaiDonHang } = req.body;
        const { MaDDH } = req.params;

        const isExist = await DonDatHang.findOne({ MaDDH: MaDDH }).lean();
        if (!isExist)
            return sendError(res, "Đơn đặt hàng không tồn tại"); 

        const isExistCongTyDatHang = await CongTy.findOne({ MaCongTy: CongTyDatHang }).lean();
        if (!isExistCongTyDatHang)
            return sendError(res, "Công ty đặt hàng không tồn tại");

        await DonDatHang.findOneAndUpdate({ MaDDH: MaDDH }, { CongTyDatHang: isExistCongTyDatHang._id, NgayDatHang: NgayDatHang, 
                                            NgayHetHan: NgayHetHan, TenDDH: TenDDH, ThoiHanGiaoHang: ThoiHanGiaoHang, TrangThaiDDH: TrangThaiDonHang });
        return sendSuccess(res, "Chỉnh sửa đơn đặt hàng thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route DELETE /api/admin/don-dat-hang/Xoa/{MaDDH}
 * @description Xóa đơn đặt hàng
 * @access private
 */
DonDatHangAdminRoute.delete('/Xoa/:MaDDH', async (req, res) => {
    try {
        const { MaDDH } = req.params
        const isExist = await DonDatHang.findOne({ MaDDH: MaDDH })
        if (!isExist) 
            return sendError(res, "Đơn đặt hàng này không tồn tại");
        await DonDatHang.findOneAndDelete({ MaDDH: MaDDH });
        return sendSuccess(res, "Xóa đơn đặt hàng thành công.")
    } catch (error) {
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route POST /api/admin/don-dat-hang/ThemSanPhamDatHang/{MaDDH}
 * @description Thêm sản phẩm đặt hàng vào đơn đặt hàng
 * @access public
 */
DonDatHangAdminRoute.post('/ThemSanPhamDatHang/:MaDDH', async (req, res) => {
    try{
        const errors = KtraDuLieuSanPhamDatHang(req.body)
        if (errors)
            return sendError(res, errors)
        const { TenSP, DonViTinh, SoLuong } = req.body;
        const { MaDDH } = req.params;

        const isExist = await DonDatHang.findOne({ MaDDH: MaDDH }).lean();
        if (!isExist)
            return sendError(res, "Đơn đặt hàng không tồn tại");

        let thongtin = {
            TenSP: TenSP,
            DonViTinh: DonViTinh,
            SoLuong: SoLuong,
        }
        isExist.SanPhamDatHang.push(thongtin);
        const products = isExist.SanPhamDatHang;
        await DonDatHang.findOneAndUpdate({ MaDDH: MaDDH }, { SanPhamDatHang: products });

        return sendSuccess(res, "Thêm sản phẩm đặt hàng thành công");
    }
    catch (error){
        console.log(error)
        return sendServerError(res)
    }
})

/**
 * @route PUT /api/admin/don-dat-hang/ChinhSuaSanPhamDatHang/{MaDDH}
 * @description Chỉnh sửa sản phẩm đặt hàng
 * @access public
 */
DonDatHangAdminRoute.put('/ChinhSuaSanPhamDatHang/:MaDDH', async (req, res) => {
    try{
        const errors = KtraDuLieuSanPhamDatHang(req.body)
        if (errors)
            return sendError(res, errors)
        const { id, TenSP, DonViTinh, SoLuong } = req.body;
        const { MaDDH } = req.params;

        const isExist = await DonDatHang.findOne({ MaDDH: MaDDH }).lean();
        if (!isExist)
            return sendError(res, "Đơn đặt hàng không tồn tại");

        let thongtin = {
            TenSP: TenSP,
            DonViTinh: DonViTinh,
            SoLuong: SoLuong,
        }
        if (isExist.SanPhamDatHang.length > 0){
            let arr = isExist.SanPhamDatHang;
            const index = arr.findIndex(item => item._id.equals(new mongoose.Types.ObjectId(id)));
            if (index !== -1) {
                arr[index] = { ...arr[index], ...thongtin };
                await DonDatHang.findOneAndUpdate({ MaDDH: MaDDH }, { SanPhamDatHang: arr });
            return sendSuccess(res, "Chỉnh sửa sản phẩm đặt hàng thành công");
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
 * @route PUT /api/admin/don-dat-hang/XoaSanPhamDatHang/{MaDDH}
 * @description Xóa sản phẩm đặt hàng
 * @access public
 */
DonDatHangAdminRoute.put('/XoaSanPhamDatHang/:MaDDH', async (req, res) => {
    try{
        const { id } = req.body;
        const { MaDDH } = req.params;

        const isExist = await DonDatHang.findOne({ MaDDH: MaDDH }).lean();
        if (!isExist)
            return sendError(res, "Đơn đặt hàng không tồn tại");

        if (isExist.SanPhamDatHang.length > 0){
            let arr = isExist.SanPhamDatHang;
            const index = arr.findIndex(item => item._id.equals(new mongoose.Types.ObjectId(id)));
            if (index !== -1) {
                arr.splice(index,1)
                await DonDatHang.findOneAndUpdate({ MaDDH: MaDDH }, { SanPhamDatHang: arr });
                return sendSuccess(res, "Xóa sản phẩm đặt hàng thành công");
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

export default DonDatHangAdminRoute