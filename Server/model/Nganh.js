import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const NganhSchema = new Schema(
    {
        MaNganh: {
            type: String,
            unique: true,
            required: true,
        },
        TenNganh: {
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

export default mongoose.model("nganhs", NganhSchema);
