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
            type: Date,
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
                },
                QuyCachKyThuat: {
                    type: String,
                },
                DonViTinh: {
                    type: String,
                },
                SoLuong: {
                    type: Number,
                },
                Thue: {
                    type: Number,
                },
                DonGia: {
                    type: Number,
                },
                ThanhTien: {
                    type: Number,
                },
                ThanhTienSauThue: {
                    type: Number,
                },
            }
        ],
        TongTien: {
            type: Number,
            required: true,
            default: 0,
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
