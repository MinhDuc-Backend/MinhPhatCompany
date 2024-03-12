import mongoose from "mongoose";
import { TrangThaiTaiKhoan } from "../constant.js";
const { Schema } = mongoose;

const TaiKhoanSchema = new Schema(
    {
        MaTK: {
            type: String,
            unique: true,
            required: true,
        },
        MaQTK: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'quyentaikhoans',
            required: true,
        },
        TenDangNhap: {
            type: String,
            required: true,
        },
        MatKhau: {
            type: String,
            required: true,
        },
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiTaiKhoan),
            default: TrangThaiTaiKhoan.DaKichHoat,
        },
    },
    { timestamps: true }
)

export default mongoose.model("taikhoans", TaiKhoanSchema);
