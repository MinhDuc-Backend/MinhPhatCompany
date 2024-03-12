import Error from "../helper/error.js"

export const KtraDuLieuKLTNKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaKLTN, "MaKLTN")
        .isRequired(data.Ten, "Ten")
        .isRequired(data.Khoa, "Khoa")
        .isRequired(data.MaNganh, "MaNganh")
        .isRequired(data.ThoiGianBD, "ThoiGianBD")
        .isRequired(data.ThoiGianKT, "ThoiGianKT")

    return error.get()
}

export const KtraDuLieuKLTNKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.Ten, "Ten")
        .isRequired(data.Khoa, "Khoa")
        .isRequired(data.MaNganh, "MaNganh")
        .isRequired(data.ThoiGianBD, "ThoiGianBD")
        .isRequired(data.ThoiGianKT, "ThoiGianKT")

    return error.get()
}

export const KtraDuLieuKLTNKhiThemDeTaiKhoaLuan = data => {
    const error = new Error()

    error.isRequired(data.TenDeTai, "TenDeTai")
        .isRequired(data.MaGV, "MaGV")

    return error.get()
}

export const KtraDuLieuKLTNKhiChinhSuaDeTaiKhoaLuan = data => {
    const error = new Error()

    error.isRequired(data.TenDeTaiCu, "TenDeTaiCu")
        .isRequired(data.TenDeTaiMoi, "TenDeTaiMoi")
        .isRequired(data.MaGV, "MaGV")

    return error.get()
}

export const KtraDuLieuKLTNKhiXoaDeTaiKhoaLuan = data => {
    const error = new Error()

    error.isRequired(data.TenDeTai, "TenDeTai")
        .isRequired(data.MaGV, "MaGV")

    return error.get()
}

export const KtraDuLieuKLTNKhiThemSVDangKyKhoaLuan = data => {
    const error = new Error()

    error.isRequired(data.TenDeTai, "TenDeTai")
        .isRequired(data.MaGV, "MaGV")
        .isRequired(data.MaSV, "MaSV")
        .isRequired(data.HoSV, "HoSV")
        .isRequired(data.TenSV, "TenSV")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.DTBTL, "DTBTL")
        .isRequired(data.TinChiTL, "TinChiTL")

    return error.get()
}

export const KtraDuLieuKLTNKhiXoaSVDangKyKhoaLuan = data => {
    const error = new Error()

    error.isRequired(data.TenDeTai, "TenDeTai")
        .isRequired(data.MaGV, "MaGV")
        .isRequired(data.MaSV, "MaSV")

    return error.get()
}

export const KtraDuLieuKLTNKhiSuaThongTinSVDangKyKhoaLuan = data => {
    const error = new Error()

    error.isRequired(data.TenDeTai, "TenDeTai")
        .isRequired(data.MaGV, "MaGV")
        .isRequired(data.MaSV, "MaSV")
        .isRequired(data.HoSV, "HoSV")
        .isRequired(data.TenSV, "TenSV")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.DTBTL, "DTBTL")
        .isRequired(data.TinChiTL, "TinChiTL")

    return error.get()
}
