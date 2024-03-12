import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const ChiTietQuyenSchema = new Schema(
    {
        MaQTK: {
            type: String,
            unique: true,
            required: true,
        },
        TenQuyenTK: {
            type: String,
            required: true,
        },
        ChucNang: [
            {
                MaCN: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'chucnangs',
                },
                ChucNangCon: [String]
            }
        ],
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiTonTai),
            default: TrangThaiTonTai.ChuaXoa,
        },
    },
    { timestamps: true }
)

export default mongoose.model("quyentaikhoans", ChiTietQuyenSchema);
