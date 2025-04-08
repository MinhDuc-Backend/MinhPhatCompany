import Error from "../helper/error.js"

export const KtraDuLieuCongTyKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaCongTy, "MaCongTy")
        .isRequired(data.TenCongTy, "TenCongTy")
        .isRequired(data.DiaChi, "DiaChi")

    return error.get()
}

export const KtraDuLieuCongTyKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.TenCongTy, "TenCongTy")
        .isRequired(data.DiaChi, "DiaChi")

    return error.get()
}
