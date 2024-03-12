import mongoose from "mongoose";
import { TrangThaiKhoaLuan, TrangThaiSinhVien, TrangThaiSinhVienTotNghiep, TrangThaiThucTap } from "../constant.js";
const { Schema } = mongoose;

const SinhVienSchema = new Schema(
    {
        MaSV: {
            type: String,
            unique: true,
            required: true,
        },
        MaTK: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'taikhoans',
            default: null,
        },
        HoSV: {
            type: String,
            required: true,
        },
        TenSV: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            default: null,
        },
        SoDienThoai: {
            type: String,
            default: null,
        },
        GioiTinh: {
            type: String,
            default: null,
        },
        NgaySinh: {
            type: Date,
            required: true,
        },
        Khoa: { // khóa (ví dụ: khóa 19, khóa 20)
            type: String,
            required: true,
        },
        ChuyenNganh: {
            type: String,
            default: null,
        },
        Nganh: {
            type: String,
            required: true,
        },
        Lop: {
            type: String,
            required: true,
        },
        DTBTLHK: {
            type: Number,
            default: 0,
        },
        TrangThaiTotNghiep: {
            type: String,
            enum: Object.values(TrangThaiSinhVienTotNghiep),
            default: TrangThaiSinhVienTotNghiep.ChuaTotNghiep,
        },
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiSinhVien),
            default: TrangThaiSinhVien.ChuaCoTaiKhoan,
        },
        TrangThaiThucTap: {
            type: String,
            enum: Object.values(TrangThaiThucTap),
            default: TrangThaiThucTap.ChuaThucTap,
        },
        TrangThaiKhoaLuan: {
            type: String,
            enum: Object.values(TrangThaiKhoaLuan),
            default: TrangThaiKhoaLuan.ChuaDangKy,
        },
    },
    { timestamps: true }
)

export default mongoose.model("sinhviens", SinhVienSchema);
