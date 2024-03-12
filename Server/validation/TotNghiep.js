import Error from "../helper/error.js"

export const KtraDuLieuTotNghiepKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaTN, "MaTN")
        .isRequired(data.Ten, "Ten")
        .isRequired(data.NienKhoa, "NienKhoa")

    return error.get()
}

export const KtraDuLieuTotNghiepKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.Ten, "Ten")
        .isRequired(data.NienKhoa, "NienKhoa")

    return error.get()
}
