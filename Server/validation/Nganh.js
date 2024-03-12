import Error from "../helper/error.js"

export const KtraDuLieuNganhKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaNganh, "MaNganh")
        .isRequired(data.TenNganh, "TenNganh")

    return error.get()
}

export const KtraDuLieuNganhKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.TenNganh, "TenNganh")

    return error.get()
}