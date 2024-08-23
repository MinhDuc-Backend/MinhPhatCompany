import Error from "../helper/error.js"

export const KtraDuLieuKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaSP, "MaSP")
        .isRequired(data.MaLSPCha, "MaLSPCha")
        .isRequired(data.TenSP, "TenSP")
        .isRequired(data.SoLuong, "SoLuong")

    return error.get()
}

export const KtraDuLieuKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.MaLSPCha, "MaLSPCha")
        .isRequired(data.TenSP, "TenSP")
        .isRequired(data.SoLuong, "SoLuong")

    return error.get()
}