import Error from "../helper/error.js"

export const KtraDuLieuKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaLSPCha, "MaLSPCha")
        .isRequired(data.TenLoai, "TenLoai")

    return error.get()
}

export const KtraDuLieuKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.TenLoai, "TenLoai")

    return error.get()
}