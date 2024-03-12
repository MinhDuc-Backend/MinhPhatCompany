import mongoose from "mongoose";
import { TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const TotNghiepSchema = new Schema(
    {
        MaTN: {
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
        ThongTin: [
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
                NgaySinh: {
                    type: Date,
                    required: true,
                },
                GioiTinh: {
                    type: String,
                    required: true,
                },
                Lop: {
                    type: String,
                    required: true,
                },
                Nganh: {
                    type: String,
                    required: true,
                },
                DTBTL: {
                    type: Number,
                    required: true,
                },
                TinChi: {
                    type: Number,
                    required: true,
                },
                XepLoaiTN: {
                    type: String,
                    required: true,
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

export default mongoose.model("totnghieps", TotNghiepSchema);
