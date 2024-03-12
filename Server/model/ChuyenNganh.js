import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const ChuyenNganhSchema = new Schema(
    {
        MaChuyenNganh: {
            type: String,
            unique: true,
            required: true,
        },
        MaNganh: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nganhs',
            required: true,
        },
        TenChuyenNganh: {
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

export default mongoose.model("chuyennganhs", ChuyenNganhSchema);
