import mongoose from "mongoose";
import { KieuCanhBaoSV, TrangThaiTonTai } from "../constant.js";
const { Schema } = mongoose;

const CanhBaoHocTapSchema = new Schema(
    {
        MaCBHT: {
            type: String,
            unique: true,
            required: true,
        },
        Ten: {
            type: String,
            required: true,
        },
        Dot: {
            type: String,
            required: true,
        },
        NienKhoa: {
            type: String,
            required: true,
        },
        KieuCanhBao: {
            type: String,
            enum: Object.values(KieuCanhBaoSV),
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
                },
                GioiTinh: {
                    type: String,
                },
                NamThu: {
                    type: Number,
                },
                HocKyThu: {
                    type: Number,
                },
                SoLanCBLienTiep: {
                    type: Number,
                },
                TongSoLanCB: {
                    type: Number,
                },
                DTBCHK: {
                    type: Number,
                },
                DTBCTL: {
                    type: Number,
                },
                KQ: {
                    type: String,
                },
                GhiChu: {
                    type: String,
                },
                DiemRenLuyen: {
                    type: Number,
                },
                XepLoaiDRL: {
                    type: String,
                },
                Lop: {
                    type: String,
                },
                Nganh: {
                    type: String,
                },
                Khoa: {
                    type: String,
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

export default mongoose.model("canhbaohoctaps", CanhBaoHocTapSchema);
