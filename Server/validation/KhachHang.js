import Error from "../helper/error.js"

export const KtraDuLieuKhachHangKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaKH, "MaKH")
        .isRequired(data.HoKH, "HoKH")
        .isRequired(data.TenKH, "TenKH")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.GioiTinh, "GioiTinh")
        .isRequired(data.MaCongTy, "MaCongTy")

    return error.get()
}

export const KtraDuLieuKhachHangKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.HoKH, "HoKH")
        .isRequired(data.TenKH, "TenKH")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.GioiTinh, "GioiTinh")
        .isRequired(data.MaCongTy, "MaCongTy")

    return error.get()
}
