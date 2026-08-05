import Error from "../helper/error.js"

export const KtraDuLieuDonDatHangKhiThem = data => {
    const error = new Error()

    error.isRequired(data.CongTyDatHang, "CongTyDatHang")
        .isRequired(data.NgayDatHang, "NgayDatHang")
        .isRequired(data.NgayHetHan, "NgayHetHan")
        .isRequired(data.TenDDH, "TenDDH")
        .isRequired(data.ThoiHanGiaoHang, "ThoiHanGiaoHang")

    return error.get()
}

export const KtraDuLieuDonDatHangKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.CongTyDatHang, "CongTyDatHang")
        .isRequired(data.NgayDatHang, "NgayDatHang")
        .isRequired(data.NgayHetHan, "NgayHetHan")
        .isRequired(data.TenDDH, "TenDDH")
        .isRequired(data.ThoiHanGiaoHang, "ThoiHanGiaoHang")

    return error.get()
}

export const KtraDuLieuSanPhamDatHang = data => {
    const error = new Error()

    error.isRequired(data.TenSP, "TenSP")
        .isRequired(data.DonViTinh, "DonViTinh")
        .isRequired(data.SoLuong, "SoLuong")

    return error.get()
}
