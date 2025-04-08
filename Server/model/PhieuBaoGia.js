import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const PhieuBaoGiaSchema = new Schema(
    {
        MaPBG: {
            type: String,
            unique: true,
            required: true,
        },
        NgayBaoGia: {
            type: String,
            required: true,
        },
        SoBaoGia: {
            type: String,
            required: true,
        },
        TenPBG: {
            type: String,
            required: true,
        },
        KhachHangPBG: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'khachhangs',
            required: true,
        },
        SanPhamPBG: [
            {
                TenSP: {
                    type: String,
                    required: true,
                },
                QuyCachKyThuat: {
                    type: String,
                    required: true,
                },
                DonViTinh: {
                    type: String,
                    required: true,
                },
                SoLuong: {
                    type: Number,
                    required: true,
                },
                VAT: {
                    type: Number,
                    required: true,
                },
                DonGia: {
                    type: Number,
                    required: true,
                },
                ThanhTien: {
                    type: Number,
                    required: true,
                },
                ThanhTienSauThue: {
                    type: Number,
                    required: true,
                },
            }
        ],
        TongTien: {
            type: Number,
            required: true,
        },
        ThoiGianGiaoHang: {
            type: String,
            required: true,
        },
        DiaDiemGiaoHang: {
            type: String,
            required: true,
        },
        ThoiGianBaoHanh: {
            type: String,
            required: true,
        },
        ThanhToan: {
            type: String,
            required: true,
        },
        HieuLucBaoGia: {
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

export default mongoose.model("phieubaogias", PhieuBaoGiaSchema);
