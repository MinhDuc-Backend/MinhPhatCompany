import Error from "../helper/error.js"

export const KtraDuLieuGiangVienKhiThem = data => {
    const error = new Error()

    error.isRequired(data.MaGV, "MaGV")
        .isRequired(data.HoGV, "HoGV")
        .isRequired(data.TenGV, "TenGV")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.GioiTinh, "GioiTinh")
        .isRequired(data.NgaySinh, "NgaySinh")
        .isRequired(data.DonViCongTac, "DonViCongTac")
        .isRequired(data.TrinhDo, "TrinhDo")

    return error.get()
}

export const KtraDuLieuGiangVienKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.HoGV, "HoGV")
        .isRequired(data.TenGV, "TenGV")
        .isRequired(data.Email, "Email")
        .isRequired(data.SoDienThoai, "SoDienThoai")
        .isRequired(data.GioiTinh, "GioiTinh")
        .isRequired(data.NgaySinh, "NgaySinh")
        .isRequired(data.DonViCongTac, "DonViCongTac")
        .isRequired(data.TrinhDo, "TrinhDo")

    return error.get()
}