import mongoose from "mongoose";
import { TrangThaiDangKyChuyenNganh } from "../constant.js";
const { Schema } = mongoose;

const DangKyChuyenNganhSchema = new Schema(
    {
        MaDKCN: {
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
        ThoiGianBD: {
            type: Date,
            required: true,
        },
        ThoiGianKT: {
            type: Date,
            required: true,
        },
        ThongTin: [
            {
                Nganh: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'nganhs',
                },
                ChuyenNganh: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'chuyennganhs',
                },
                ToiDa: {
                    type: Number,
                },
                DaDangKy: {
                    type: Number,
                },
                ConLai: {
                    type: Number,
                },
                SinhVien: [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'sinhviens',
                    }
                ],
            }
        ],
        TrangThai: {
            type: String,
            enum: Object.values(TrangThaiDangKyChuyenNganh),
            required: true,
        },
    },
    { timestamps: true }
)

export default mongoose.model("dangkychuyennganhs", DangKyChuyenNganhSchema);
