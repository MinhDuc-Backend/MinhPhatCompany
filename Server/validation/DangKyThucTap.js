import Error from "../helper/error.js"

export const KtraDuLieuDKTTKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaDKTT, "MaDKTT")
        .isRequired(data.Ten, "Ten")
        .isRequired(data.NienKhoa, "NienKhoa")
        .isRequired(data.ThoiGianBD, "ThoiGianBD")
        .isRequired(data.ThoiGianKT, "ThoiGianKT")

    return error.get()
}

export const KtraDuLieuDKTTKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.Ten, "Ten")
        .isRequired(data.NienKhoa, "NienKhoa")
        .isRequired(data.ThoiGianBD, "ThoiGianBD")
        .isRequired(data.ThoiGianKT, "ThoiGianKT")

    return error.get()
}

export const KtraKhiThemCongTyTrongDS = data => {
    const error = new Error()

    error.isRequired(data.Ho, "Ho")
        .isRequired(data.Ten, "Ten")
        .isRequired(data.TenCongTy, "TenCongTy")
        .isRequired(data.Website, "Website")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isInvalidPhone(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.Email, "Email")
        .isRequired(data.DiaChi, "DiaChi")

    return error.get()
}

export const KtraKhiXoaCongTyTrongDS = data => {
    const error = new Error()

    error.isRequired(data.Email, "Email")

    return error.get()
}

export const KtraKhiThemViTriCongTyTrongDS = data => {
    const error = new Error()

    error.isRequired(data.ViTri, "ViTri")
        .isRequired(data.ToiDa, "ToiDa")
        .isRequired(data.Email, "Email")

    return error.get()
}

export const KtraKhiXoaViTriCongTyTrongDS = data => {
    const error = new Error()

    error.isRequired(data.ViTri, "ViTri")
        .isRequired(data.Email, "Email")

    return error.get()
}

export const KtraSVDangKyThucTapCtyTrongDS = data => {
    const error = new Error()

    error.isRequired(data.ViTri, "ViTri")
        .isRequired(data.EmailCty, "EmailCty")
        .isRequired(data.MaSV, "MaSV")

    return error.get()
}

export const KtraSVDangKyThucTapCtyNgoaiDS = data => {
    const error = new Error()

    error.isRequired(data.Ho, "Ho")
        .isRequired(data.Ten, "Ten")
        .isRequired(data.TenCongTy, "TenCongTy")
        .isRequired(data.Website, "Website")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isInvalidPhone(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.EmailCty, "EmailCty")
        .isRequired(data.DiaChi, "DiaChi")
        .isRequired(data.ViTri, "ViTri")
        .isRequired(data.MaSV, "MaSV")

    return error.get()
}