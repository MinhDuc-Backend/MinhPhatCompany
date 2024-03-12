import Error from "../helper/error.js"

export const KtraDuLieuChuyenNganhKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaChuyenNganh, "MaChuyenNganh")
        .isRequired(data.MaNganh, "MaNganh")
        .isRequired(data.TenChuyenNganh, "TenChuyenNganh")

    return error.get()
}

export const KtraDuLieuChuyenNganhKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.MaNganh, "MaNganh")
        .isRequired(data.TenChuyenNganh, "TenChuyenNganh")

    return error.get()
}