import mongoose from "mongoose";
import { DeTaiKhoaLuan, TrangThaiCongBoKLTN, TrangThaiDangKyKLTN } from "../constant.js";
const { Schema } = mongoose;

const KhoaLuanTotNghiepSchema = new Schema(
    {
        MaKLTN: {
            type: String,
            unique: true,
            required: true,
        },
        Ten: {
            type: String,
            required: true,
        },
        Khoa: { // khóa (ví dụ: khóa 2019, khóa 2020)
            type: String,
            required: true,
        },
        Nganh: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'nganhs',
            required: true,
        },
        ThoiGianBD: {
            type: Date,
            required: true,
        },
        ThoiGianKT: {
            type: Date,
            required: true,
        },
        DSDeTai: [
            {
                TenDeTai: {
                    type: String,
                    required: true,
                },
                GVHD: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'giangviens',
                    required: true,
                },
                SVChinhThuc: [
                    {
                        MaSV: {
                            type: String,
                            required: true,
                        },
                        HoSV: {
                            type: String,
                            required: true,
                        },
                        TenSV: {
                            type: String,
                            required: true,
                        },
                        Email: {
                            type: String,
                            required: true,
                        },
                        SoDienThoai: {
                            type: String,
                            required: true,
                        },
                        DTBTL: {
                            type: Number,
                            required: true,
                        },
                        TinChiTL: {
                            type: Number,
                            required: true,
                        }
                    }
                ],
                SVDuKien: [
                    {
                        MaSV: {
                            type: String,
                            required: true,
                        },
                        HoSV: {
                            type: String,
                            required: true,
                        },
                        TenSV: {
                            type: String,
                            required: true,
                        },
                        Email: {
                            type: String,
                            required: true,
                        },
                        SoDienThoai: {
                            type: String,
                            required: true,
                        },
                        DTBTL: {
                            type: Number,
                            required: true,
                        },
                        TinChiTL: {
                            type: Number,
                            required: true,
                        }
                    }
                ],
                TrangThaiDeTai: {
                    type: String,
                    enum: Object.values(DeTaiKhoaLuan),
                    default: DeTaiKhoaLuan.ChuaDu,
                },
                NgayBaoCao: {
                    type: String,
                    default: null,
                },
                Diem: {
                    type: Number,
                    default: 0,
                },
                GhiChu: {
                    type: String,
                    default: null,
                },
            }
        ],
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiDangKyKLTN),
            required: true,
        },
        TrangThaiCongBo: {
            type: String,
            enum: Object.values(TrangThaiCongBoKLTN),
            default: TrangThaiCongBoKLTN.KhongCongBo,
        },
    },
    { timestamps: true }
)

export default mongoose.model("khoaluantotnghieps", KhoaLuanTotNghiepSchema);
