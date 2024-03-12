import Error from "../helper/error.js"

export const KtraDuLieuQuyenTaiKhoanKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaQTK, "MaQTK")
        .isRequired(data.TenQuyenTK, "TenQuyenTK")

    return error.get()
}

export const KtraDuLieuQuyenTaiKhoanKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.TenQuyenTK, "TenQuyenTK")

    return error.get()
}