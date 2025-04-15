import Error from "../helper/error.js"

export const KtraDuLieuPhieuBaoGiaKhiThem = data => {
    const error = new Error()

    error.isRequired(data.NgayBaoGia, "NgayBaoGia")
        .isRequired(data.TenPBG, "TenPBG")
        .isRequired(data.KhachHangPBG, "KhachHangPBG")
        .isRequired(data.ThoiGianGiaoHang, "ThoiGianGiaoHang")
        .isRequired(data.DiaDiemGiaoHang, "DiaDiemGiaoHang")
        .isRequired(data.ThanhToan, "ThanhToan")
        .isRequired(data.HieuLucBaoGia, "HieuLucBaoGia")

    return error.get()
}

export const KtraDuLieuPhieuBaoGiaKhiChinhSua = data => {
    const error = new Error()

    error.isRequired(data.NgayBaoGia, "NgayBaoGia")
        .isRequired(data.TenPBG, "TenPBG")
        .isRequired(data.KhachHangPBG, "KhachHangPBG")
        .isRequired(data.ThoiGianGiaoHang, "ThoiGianGiaoHang")
        .isRequired(data.DiaDiemGiaoHang, "DiaDiemGiaoHang")
        .isRequired(data.ThanhToan, "ThanhToan")
        .isRequired(data.HieuLucBaoGia, "HieuLucBaoGia")

    return error.get()
}

export const KtraDuLieuSanPhamBaoGia = data => {
    const error = new Error()

    error.isRequired(data.TenSP, "TenSP")
        .isRequired(data.DonViTinh, "DonViTinh")
        .isRequired(data.SoLuong, "SoLuong")
        .isRequired(data.Thue, "Thue")
        .isRequired(data.DonGia, "DonGia")
        .isRequired(data.ThanhTien, "ThanhTien")
        .isRequired(data.ThanhTienSauThue, "ThanhTienSauThue")

    return error.get()
}
