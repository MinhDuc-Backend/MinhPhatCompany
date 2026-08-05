import mongoose from "mongoose";
import { TrangThaiDonDatHang } from "../constant.js";
const { Schema } = mongoose;

const DonDatHangSchema = new Schema(
    {
        MaDDH: {
            type: String,
            unique: true,
            required: true,
        },
        CongTyDatHang: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'congtys',
            required: true,
        },
        NgayDatHang: {
            type: Date,
            required: true,
        },
        NgayHetHan: {
            type: Date,
            required: true,
        },
        TenDDH: {
            type: String,
            required: true,
        },
        ThoiHanGiaoHang: {
            type: String,
            required: true,
        },
        SanPhamDatHang: [
            {
                TenSP: {
                    type: String,
                },
                DonViTinh: {
                    type: String,
                },
                SoLuong: {
                    type: Number,
                },
            }
        ],
        TrangThaiDDH: {
            type: String,
            enum: Object.values(TrangThaiDonDatHang),
            default: TrangThaiDonDatHang.ChuaGiaoHang,
        },
    },
    { timestamps: true }
)

export default mongoose.model("dondathangs", DonDatHangSchema);
