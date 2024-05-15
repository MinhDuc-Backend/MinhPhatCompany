import Error from "../helper/error.js"

export const KtraDuLieuSinhVienKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaSV, "MaSV")
        .isRequired(data.HoSV, "HoSV")
        .isRequired(data.TenSV, "TenSV")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.GioiTinh, "GioiTinh")
        .isRequired(data.NgaySinh, "NgaySinh")
        .isRequired(data.Khoa, "Khoa")
        .isRequired(data.Nganh, "Nganh")
        .isRequired(data.Lop, "Lop")

    return error.get()
}

export const KtraDuLieuSinhVienKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.HoSV, "HoSV")
        .isRequired(data.TenSV, "TenSV")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.GioiTinh, "GioiTinh")
        .isRequired(data.NgaySinh, "NgaySinh")
        .isRequired(data.Khoa, "Khoa")
        .isRequired(data.Nganh, "Nganh")
        .isRequired(data.Lop, "Lop")

    return error.get()
}

export const KtraDuLieuSinhVienKhiChinhSuaClient = data => {
    const error = new Error()

    error.isRequired(data.HoSV, "HoSV")
        .isRequired(data.TenSV, "TenSV")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.GioiTinh, "GioiTinh")
        .isRequired(data.NgaySinh, "NgaySinh")

    return error.get()
}