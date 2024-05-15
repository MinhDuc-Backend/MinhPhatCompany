import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const LoaiSPSchema = new Schema(
    {
        MaLSP: {
            type: String,
            unique: true,
            required: true,
        },
        TenLoai: {
            type: String,
            required: true,
        },
        SanPham: [
            {
                MaSP: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'sanphams',
                },
            }
        ],
        LoaiNho: [  // Loại nhỏ trong loại lớn
            {
                MaLoaiNho: {
                    type: String,
                },
                TenLoaiNho: {
                    type: String,
                },
                SanPham: [
                    {
                        MaSP: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'sanphams',
                        },
                    }
                ]
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

export default mongoose.model("loaisanphams", LoaiSPSchema);
