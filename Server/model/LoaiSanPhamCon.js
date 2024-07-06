import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const LoaiSPConSchema = new Schema(
    {
        MaLSPCon: {
            type: String,
            unique: true,
            required: true,
        },
        MaLSPCha: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'loaisanphamchas',
            required: true,
        },
        TenLoai: {
            type: String,
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

export default mongoose.model("loaisanphamcons", LoaiSPConSchema);
