import Error from "../helper/error.js"

export const KtraDuLieuCBHTKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaCBHT, "MaCBHT")
        .isRequired(data.Ten, "Ten")
        .isRequired(data.Dot, "Dot")
        .isRequired(data.NienKhoa, "NienKhoa")

    return error.get()
}

export const KtraDuLieuCBHTKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.Ten, "Ten")
        .isRequired(data.Dot, "Dot")
        .isRequired(data.NienKhoa, "NienKhoa")

    return error.get()
}
