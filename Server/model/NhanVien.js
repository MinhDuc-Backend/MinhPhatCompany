import mongoose from "mongoose";
import { TrangThaiNhanVien } from "../constant.js";
const { Schema } = mongoose;

const NhanVienSchema = new Schema(
    {
        MaNV: {
            type: String,
            unique: true,
            required: true,
        },
        MaTK: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'taikhoans',
            default: null,
        },
        HoNV: {
            type: String,
            required: true,
        },
        TenNV: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            required: true,
        },
        SoDienThoai: {
            type: String,
            required: true,
        },
        GioiTinh: {
            type: String,
            required: true,
        },
        NgaySinh: {
            type: Date,
            required: true,
        },
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiNhanVien),
            default: TrangThaiNhanVien.ChuaCoTaiKhoan,
        },
    },
    { timestamps: true }
)

export default mongoose.model("nhanviens", NhanVienSchema);
