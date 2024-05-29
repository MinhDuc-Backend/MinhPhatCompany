import Error from "../helper/error.js"

export const KtraDuLieuNhanVienKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaNV, "MaNV")
        .isRequired(data.HoNV, "HoNV")
        .isRequired(data.TenNV, "TenNV")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.GioiTinh, "GioiTinh")
        .isRequired(data.NgaySinh, "NgaySinh")

    return error.get()
}

export const KtraDuLieuNhanVienKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.HoNV, "HoNV")
        .isRequired(data.TenNV, "TenNV")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.GioiTinh, "GioiTinh")
        .isRequired(data.NgaySinh, "NgaySinh")

    return error.get()
}