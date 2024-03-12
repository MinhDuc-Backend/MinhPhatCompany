import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const ChucNangSchema = new Schema(
    {
        MaCN: {
            type: String,
            unique: true,
            required: true,
        },
        TenChucNang: {
            type: String,
            required: true,
        },
        Hinh: {
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

export default mongoose.model("chucnangs", ChucNangSchema);
