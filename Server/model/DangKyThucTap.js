import mongoose from "mongoose";
import { TrangThaiDangKyThucTap } from "../constant.js";
const { Schema } = mongoose;

const DangKyThucTapSchema = new Schema(
    {
        MaDKTT: {
            type: String,
            unique: true,
            required: true,
        },
        Ten: {
            type: String,
            required: true,
        },
        NienKhoa: {
            type: String,
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
        CongTyTrongDS: [
            {
                HoNguoiLienHe: {
                    type: String,
                    required: true,
                },
                TenNguoiLienHe: {
                    type: String,
                    required: true,
                },
                TenCongTy: {
                    type: String,
                    required: true,
                },
                Website: {
                    type: String,
                    required: true,
                },
                SoDienThoai: {
                    type: String,
                    required: true,
                },
                Email: {
                    type: String,
                    required: true,
                },
                DiaChi: {
                    type: String,
                    required: true,
                },
                DangKy: [
                    {
                        ViTri: {
                            type: String,
                            required: true,
                        },
                        ToiDa: {
                            type: Number,
                            required: true,
                        },
                        DaDangKy: {
                            type: Number,
                            required: true,
                        },
                        ConLai: {
                            type: Number,
                            required: true,
                        },
                        SinhVien: [
                            {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: 'sinhviens',
                            }
                        ],
                    }
                ],
            }
        ],
        CongTyNgoaiDS: [
            {
                HoNguoiLienHe: {
                    type: String,
                    required: true,
                },
                TenNguoiLienHe: {
                    type: String,
                    required: true,
                },
                TenCongTy: {
                    type: String,
                    required: true,
                },
                Website: {
                    type: String,
                    required: true,
                },
                SoDienThoai: {
                    type: String,
                    required: true,
                },
                Email: {
                    type: String,
                    required: true,
                },
                DiaChi: {
                    type: String,
                    required: true,
                },
                ViTri: {
                    type: String,
                    required: true,
                },
                SinhVien: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'sinhviens',
                },
            }
        ],
        SinhVienDuocDKTT: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'sinhviens',
            }
        ],
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiDangKyThucTap),
            required: true,
        },
    },
    { timestamps: true }
)

export default mongoose.model("dangkythuctaps", DangKyThucTapSchema);
