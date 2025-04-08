import Error from "../helper/error.js"

export const KtraDuLieuThongTinCtyKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaTTCty, "MaTTCty")
        .isRequired(data.TenCty, "TenCty")
        .isRequired(data.MaSoThue, "MaSoThue")
        .isRequired(data.DiaChi, "DiaChi")

    return error.get()
}

export const KtraDuLieuThongTinCtyKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.TenCty, "TenCty")
        .isRequired(data.MaSoThue, "MaSoThue")
        .isRequired(data.DiaChi, "DiaChi")

    return error.get()
}
