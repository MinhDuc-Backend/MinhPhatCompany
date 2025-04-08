import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const KhachHangSchema = new Schema(
    {
        MaKH: {
            type: String,
            unique: true,
            required: true,
        },
        HoKH: {
            type: String,
            required: true,
        },
        TenKH: {
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
        CongTy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'congtys',
            required: true,
        },
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiTonTai),
            default: TrangThaiTonTai.ChuaXoa,
        },
    },
    { timestamps: true }
)

export default mongoose.model("khachhangs", KhachHangSchema);
