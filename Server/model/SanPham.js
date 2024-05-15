import mongoose from "mongoose";
import { TrangThaiSanPham, TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const CongTySchema = new Schema(
    {
        MaSP: {
            type: String,
            unique: true,
            required: true,
        },
        TenSP: {
            type: String,
            required: true,
        },
        Hinh: [String],
        Gia: {
            type: Number,
            required: true,
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

export default mongoose.model("congtys", CongTySchema);
