import Error from "../helper/error.js"

export const KtraDuLieuKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaSP, "MaSP")
        .isRequired(data.MaLSPCha, "MaLSPCha")
        .isRequired(data.TenSP, "TenSP")
        .isRequired(data.Hinh, "Hinh")
        .isRequired(data.SoLuong, "SoLuong")

    return error.get()
}

export const KtraDuLieuKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.MaLSPCha, "MaLSPCha")
        .isRequired(data.MaLSPCon, "MaLSPCon")
        .isRequired(data.TenSP, "TenSP")
        .isRequired(data.Hinh, "Hinh")
        .isRequired(data.Gia, "Gia")
        .isRequired(data.MoTa, "MoTa")
        .isRequired(data.SoLuong, "SoLuong")

    return error.get()
}