import mongoose from "mongoose";
import { TrangThaiGiangVien } from "../constant.js";
const { Schema } = mongoose;

const GiangVienSchema = new Schema(
    {
        MaGV: {
            type: String,
            unique: true,
            required: true,
        },
        MaTK: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'taikhoans',
            default: null,
        },
        HoGV: {
            type: String,
            required: true,
        },
        TenGV: {
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
        DonViCongTac: {
            type: String,
            required: true,
        },
        ChuyenNganh: {
            type: String,
        },
        TrinhDo: {
            type: String,
            required: true,
        },
        Hinh: {
            type: String,
        },
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiGiangVien),
            default: TrangThaiGiangVien.ChuaCoTaiKhoan,
        },
    },
    { timestamps: true }
)

export default mongoose.model("giangviens", GiangVienSchema);
