import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const ThongTinCtySchema = new Schema(
    {
        MaTTCty: {
            type: String,
            unique: true,
            required: true,
        },
        TenCty: {
            type: String,
            required: true,
        },
        MaSoThue: {
            type: String,
            required: true,
        },
        DiaChi: {
            type: String,
            required: true,
        },
        Logo: {
            type: String,
            required: true,
        },
        GiamDoc: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nhanviens',
            required: true,
        },
        LienHe: [
            {
                MaNV: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'nhanviens',
                },
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

export default mongoose.model("thongtinctys", ThongTinCtySchema);
