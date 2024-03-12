import Error from "../helper/error.js"

export const KtraDuLieuDKCNKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaDKCN, "MaDKCN")
        .isRequired(data.Ten, "Ten")
        .isRequired(data.Khoa, "Khoa")
        .isRequired(data.ThoiGianBD, "ThoiGianBD")
        .isRequired(data.ThoiGianKT, "ThoiGianKT")

    return error.get()
}

export const KtraDuLieuDKCNKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.Ten, "Ten")
        .isRequired(data.Khoa, "Khoa")
        .isRequired(data.ThoiGianBD, "ThoiGianBD")
        .isRequired(data.ThoiGianKT, "ThoiGianKT")

    return error.get()
}

export const KtraDuLieuDKCNKhiThemMonChuyenNganh = data => {
    const error = new Error()

    error.isRequired(data.MaNganh, "MaNganh")
        .isRequired(data.MaChuyenNganh, "MaChuyenNganh")
        .isRequired(data.ToiDa, "ToiDa")

    return error.get()
}

export const KtraDuLieuDKCNKhiXoaMonChuyenNganh = data => {
    const error = new Error()

    error.isRequired(data.MaNganh, "MaNganh")
        .isRequired(data.MaChuyenNganh, "MaChuyenNganh")

    return error.get()
}

export const KtraSVDangKyChuyenNganh = data => {
    const error = new Error()

    error.isRequired(data.MaSV, "MaSV")
        .isRequired(data.MaNganh, "MaNganh")
        .isRequired(data.MaChuyenNganh, "MaChuyenNganh")

    return error.get()
}
