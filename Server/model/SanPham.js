import mongoose from "mongoose";
import { TrangThaiSanPham, TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const SanPhamSchema = new Schema(
    {
        MaSP: {
            type: String,
            unique: true,
            required: true,
        },
        MaLSPCha: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'loaisanphamchas',
            required: true,
        },
        MaLSPCon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'loaisanphamcons',
            default: null,
        },
        TenSP: {
            type: String,
            required: true,
        },
        Hinh: [String],
        Gia: {
            type: Number,
            default: 0,
        },
        MoTa: {
            type: String,
            default: null
        },
        SoLuong: {
            type: Number,
            required: true,
        },
        TrangThaiHangHoa: {
            type: String,
            enum: Object.values(TrangThaiSanPham),
            default: TrangThaiSanPham.Het,
        },
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiTonTai),
            default: TrangThaiTonTai.ChuaXoa,
        },
    },
    { timestamps: true }
)

export default mongoose.model("sanphams", SanPhamSchema);
