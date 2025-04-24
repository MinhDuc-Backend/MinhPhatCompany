import axios from "./custom-axios"

const fetchLoginAdmin = (TenDangNhap, MatKhau) => { // Đăng nhập admin
    return axios.post('tai-khoan/DangNhapAdmin', {
        TenDangNhap: TenDangNhap,
        MatKhau: MatKhau,
    })
}
export { fetchLoginAdmin };

const fetchVerifyToken = (headers) => { // Lấy danh sách loại sản phẩm
    return axios.get('admin/tai-khoan/KTraToken', { headers });
}
export { fetchVerifyToken };

//--------------------------------CategoryFather----------------------------------------------//
const fetchAllCategoryFather = (headers) => { // Lấy danh sách loại sản phẩm
    return axios.get('admin/lsp-cha/DanhSachLSPCha', { headers });
}
export { fetchAllCategoryFather };

const fetchDetailCategoryFather = (headers, MaLSPCha) => { // Chi tiết loại sản phẩm
    return axios.get(`admin/lsp-cha/ChiTietLSP/${MaLSPCha}`, { headers });
}
export { fetchDetailCategoryFather };

const fetchEditCategoryFather = (headers, MaLSPCha, TenLoai) => { // Chỉnh sửa thông tin loại sản phẩm
    return axios.put(`admin/lsp-cha/ChinhSua/${MaLSPCha}`, {
        TenLoai: TenLoai,
    }, { headers });
}
export { fetchEditCategoryFather };

const fetchAddCategoryFather = (headers, MaLSPCha, TenLoai) => { // Thêm loại sản phẩm mới
    return axios.post(`admin/lsp-cha/Them`, {
        MaLSPCha: MaLSPCha,
        TenLoai: TenLoai,
    }, { headers });
}
export { fetchAddCategoryFather };

const fetchDeleteCategoryFather = (headers, MaLSPCha) => { // Xóa loại sản phẩm
    return axios.delete(`admin/lsp-cha/Xoa/${MaLSPCha}`, { headers });
}
export { fetchDeleteCategoryFather };
//----------------------------------------------------------------------------------------------//



//--------------------------------Product----------------------------------------------//
const fetchAllProduct = (headers) => { // Lấy danh sách sản phẩm
    return axios.get('admin/san-pham/DanhSachSanPham', { headers });
}
export { fetchAllProduct };

const fetchDetailProduct = (headers, MaSP) => { // Chi tiết thông tin sản phẩm
    return axios.get(`admin/san-pham/ChiTietSanPham/${MaSP}`, { headers });
}
export { fetchDetailProduct };

const fetchAddProduct = (headers, data) => { // Thêm sản phẩm mới
    return axios.post(`admin/san-pham/Them`, data, { headers });
}
export { fetchAddProduct };

const fetchEditProduct = (headers, MaSP, TenSP, Gia, SoLuong, MoTa, MaLSPCha, MaLSPCon) => { // Chỉnh sửa thông tin sản phẩm
    return axios.post(`admin/san-pham/ChinhSua/${MaSP}`, {
        TenSP: TenSP,
        Gia: Gia,
        SoLuong: SoLuong,
        MoTa: MoTa,
        MaLSPCha: MaLSPCha,
        MaLSPCon: MaLSPCon,
    }, { headers });
}
export { fetchEditProduct };

const fetchEditImageProduct = (headers, MaSP, data) => { // Chỉnh sửa thông tin sản phẩm
    return axios.post(`admin/san-pham/ChinhSuaHinhAnh/${MaSP}`, data, { headers });
}
export { fetchEditImageProduct };

const fetchDeleteProduct = (headers, MaSP) => { // Xóa sản phẩm
    return axios.delete(`admin/san-pham/Xoa/${MaSP}`, { headers });
}
export { fetchDeleteProduct };
//----------------------------------------------------------------------------------------------//

//--------------------------------CategoryChild----------------------------------------------//
const fetchAllCategoryChild = (headers) => { // Lấy danh sách loại sản phẩm
    return axios.get('admin/lsp-con/DanhSachLSPCon', { headers });
}
export { fetchAllCategoryChild };

const fetchDetailCategoryChild = (headers, MaLSPCon) => { // Chi tiết loại sản phẩm
    return axios.get(`admin/lsp-con/ChiTietLSPCon/${MaLSPCon}`, { headers });
}
export { fetchDetailCategoryChild };

const fetchDetailCategoryChildFollowFather = (headers, MaLSPCha) => { // Lấy danh sách loại sản phẩm con theo mã loại sản phẩm cha
    return axios.get(`admin/lsp-con/DSLSPConTheoLSPCha/${MaLSPCha}`, { headers });
}
export { fetchDetailCategoryChildFollowFather };

const fetchEditCategoryChild = (headers, MaLSPCon, MaLSPCha, TenLoai) => { // Chỉnh sửa thông tin loại sản phẩm
    return axios.put(`admin/lsp-con/ChinhSua/${MaLSPCon}`, {
        MaLSPCha: MaLSPCha,
        TenLoai: TenLoai,
    }, { headers });
}
export { fetchEditCategoryChild };

const fetchAddCategoryChild = (headers, MaLSPCon, MaLSPCha, TenLoai) => { // Thêm loại sản phẩm mới
    return axios.post(`admin/lsp-con/Them`, {
        MaLSPCon: MaLSPCon,
        MaLSPCha: MaLSPCha,
        TenLoai: TenLoai,
    }, { headers });
}
export { fetchAddCategoryChild };

const fetchDeleteCategoryChild = (headers, MaLSPCon) => { // Xóa loại sản phẩm
    return axios.delete(`admin/lsp-con/Xoa/${MaLSPCon}`, { headers });
}
export { fetchDeleteCategoryChild };
//----------------------------------------------------------------------------------------------//

//--------------------------------Account----------------------------------------------//
//Get List Tài khoản
const fetchAllTaiKhoan = (headers) => {
    return axios.get('admin/tai-khoan/DanhSachTK', { headers });
}
export { fetchAllTaiKhoan };

//Get Chi Tiết Tài khoản
const fetchDetailTaiKhoan = (headers, MaTK) => {
    return axios.get(`admin/tai-khoan/ChiTietTaiKhoan/${MaTK}`, { headers });
}
export { fetchDetailTaiKhoan };

//Sửa Tài khoản
const fetchEditTaiKhoan = (headers, MaTK, QuyenTK) => {
    return axios.put(`admin/tai-khoan/ChinhSua/${MaTK}`, {
        MaTK: MaTK,
        MaQTK: QuyenTK,

    }, { headers });
}
export { fetchEditTaiKhoan };

//Thêm Tài khoản
const fetchAddTaiKhoan = (headers, MaTK, TenDangNhap, MatKhau, MaQTK, MaNV) => {
    return axios.post(`admin/tai-khoan/Them`, {
        MaTK: MaTK,
        TenDangNhap: TenDangNhap,
        MatKhau: MatKhau,
        MaQTK: MaQTK,
        MaNV: MaNV,
    }, { headers });
}
export { fetchAddTaiKhoan };

//Xóa  Tài khoản
const fetchDeleteTaiKhoan = (headers, MaTK) => {
    return axios.delete(`admin/tai-khoan/Xoa/${MaTK}`, { headers });
}
export { fetchDeleteTaiKhoan };

//Đổi mật khẩu  Tài khoản
const fetchEditMatKhau = (headers, MaTK, MatKhauCu, MatKhauMoi, NhapLaiMatKhauMoi) => {
    return axios.post(`tai-khoan/DoiMatKhau`, {
        MaSo: MaTK,
        MatKhauCu: MatKhauCu,
        MatKhauMoi: MatKhauMoi,
        NhapLaiMatKhauMoi: NhapLaiMatKhauMoi,
    }, { headers });
}
export { fetchEditMatKhau };

//Đổi Phục hồi mật khẩu
const fetchPhucHoiMatKhau = (headers, MaTK, MatKhauMoi) => {
    return axios.post(`admin/tai-khoan/PhucHoiMatKhau/${MaTK}`, {
        MaTK: MaTK,
        MatKhauPhucHoi: MatKhauMoi,
    }, { headers });
}
export { fetchPhucHoiMatKhau };
//----------------------------------------------------------------------------------------------//

//--------------------------------AccountPermissions----------------------------------------------//
//Get List Quyền tài khoản
const fetchAllQuyenTK = (headers) => {
    return axios.get('admin/quyen-tai-khoan/DanhSachQuyenTK', { headers });
}
export { fetchAllQuyenTK };

//Get Chi Tiết Quyền tài khoản
const fetchDetailQuyenTK = (headers, MaQTK) => {
    return axios.get(`admin/quyen-tai-khoan/ChiTietQuyenTK/${MaQTK}`, { headers });
}
export { fetchDetailQuyenTK };

//Sửa Quyền tài khoản
const fetchEditQuyenTK = (headers, MaQTK, TenQuyenTK, MaCN) => {
    return axios.put(`admin/quyen-tai-khoan/ChinhSua/${MaQTK}`, {
        TenQuyenTK: TenQuyenTK,
        MaCN: MaCN,
    }, { headers });
}
export { fetchEditQuyenTK };

//Thêm Quyền tài khoản
const fetchAddQuyenTK = (headers, MaQTK, TenQuyenTK, MaCN) => {
    return axios.post(`admin/quyen-tai-khoan/Them`, {
        MaQTK: MaQTK,
        TenQuyenTK: TenQuyenTK,
        MaCN: MaCN,
    }, { headers });
}
export { fetchAddQuyenTK };

//Xóa  Quyền Tài Khoản
const fetchDeleteQuyenTK = (headers, MaQTK) => {
    return axios.delete(`admin/quyen-tai-khoan/Xoa/${MaQTK}`, { headers });
}
export { fetchDeleteQuyenTK };
//----------------------------------------------------------------------------------------------//

//--------------------------------Feature----------------------------------------------//
//Get List Chức năng
const fetchAllChucNang = (headers) => {
    return axios.get('admin/chuc-nang/DanhSachChucNang', { headers });
}
export { fetchAllChucNang };

//Get Chi Tiết Chức năng
const fetchDetailChucNang = (headers, MaCN) => {
    return axios.get(`admin/chuc-nang/ChiTietChucNang/${MaCN}`, { headers });
}
export { fetchDetailChucNang };

//Sửa  Chức Năng
const fetchEditChucNang = (headers, MaCN, data) => {
    return axios.post(`admin/chuc-nang/ChinhSua/${MaCN}`, data, { headers });
}
export { fetchEditChucNang };

//Thêm Chức Năng
const fetchAddChucNang = (headers, data) => {
    // for (const pair of data.entries()) {
    //     console.log(pair[0] + ": " + pair[1]);
    // }
    return axios.post(`admin/chuc-nang/Them`, data, { headers });
}
export { fetchAddChucNang };

//Xóa  Chức năng
const fetchDeleteChucNang = (headers, MaCN) => {
    return axios.delete(`admin/chuc-nang/Xoa/${MaCN}`, { headers });
}
export { fetchDeleteChucNang };
//----------------------------------------------------------------------------------------------//

//--------------------------------Company----------------------------------------------//
const fetchAllCompany = (headers) => { 
    return axios.get('admin/cong-ty/DanhSachCongTy', { headers });
}
export { fetchAllCompany };

const fetchDetailCompany = (headers, MaCongTy) => { 
    return axios.get(`admin/cong-ty/ChiTietCongTy/${MaCongTy}`, { headers });
}
export { fetchDetailCompany };

const fetchEditCompany = (headers, MaCongTy, TenCongTy, DiaChi) => { 
    return axios.put(`admin/cong-ty/ChinhSua/${MaCongTy}`, {
        TenCongTy: TenCongTy,
        DiaChi: DiaChi,
    }, { headers });
}
export { fetchEditCompany };

const fetchAddCompany = (headers, MaCongTy, TenCongTy, DiaChi) => { 
    return axios.post(`admin/cong-ty/Them`, {
        MaCongTy: MaCongTy,
        TenCongTy: TenCongTy,
        DiaChi: DiaChi,
    }, { headers });
}
export { fetchAddCompany };

const fetchDeleteCompany = (headers, MaCongTy) => { 
    return axios.delete(`admin/cong-ty/Xoa/${MaCongTy}`, { headers });
}
export { fetchDeleteCompany };
//----------------------------------------------------------------------------------------------//

//--------------------------------Customer----------------------------------------------//
const fetchAllCustomer = (headers) => { 
    return axios.get('admin/khach-hang/DanhSachKhachHang', { headers });
}
export { fetchAllCustomer };

const fetchDetailCustomer = (headers, MaKH) => { 
    return axios.get(`admin/khach-hang/ChiTietKhachHang/${MaKH}`, { headers });
}
export { fetchDetailCustomer };

const fetchAddCustomer = (headers, MaKH, HoKH, TenKH, Email, SoDienThoai, GioiTinh, MaCongTy) => { 
    return axios.post(`admin/khach-hang/Them`, {
        MaKH: MaKH,
        HoKH: HoKH,
        TenKH: TenKH,
        Email: Email,
        SoDienThoai: SoDienThoai,
        GioiTinh: GioiTinh,
        MaCongTy: MaCongTy,
    }, { headers });
}
export { fetchAddCustomer };

const fetchEditCustomer = (headers, MaKH, HoKH, TenKH, Email, SoDienThoai, GioiTinh, MaCongTy) => { 
    return axios.put(`admin/khach-hang/ChinhSua/${MaKH}`, {
        HoKH: HoKH,
        TenKH: TenKH,
        Email: Email,
        SoDienThoai: SoDienThoai,
        GioiTinh: GioiTinh,
        MaCongTy: MaCongTy,
    }, { headers });
}
export { fetchEditCustomer };

const fetchDeleteCustomer = (headers, MaKH) => { 
    return axios.delete(`admin/khach-hang/Xoa/${MaKH}`, { headers });
}
export { fetchDeleteCustomer };
//----------------------------------------------------------------------------------------------//

//--------------------------------Staff----------------------------------------------//
const fetchAllStaff = (headers) => { 
    return axios.get('admin/nhan-vien/DanhSachNhanVien', { headers });
}
export { fetchAllStaff };

const fetchDetailStaff = (headers, MaNV) => { 
    return axios.get(`admin/nhan-vien/ChiTietNhanVien/${MaNV}`, { headers });
}
export { fetchDetailStaff };

const fetchAddStaff = (headers, MaNV, HoNV, TenNV, Email, SoDienThoai, GioiTinh, NgaySinh) => { 
    return axios.post(`admin/nhan-vien/Them`, {
        MaNV: MaNV,
        HoNV: HoNV,
        TenNV: TenNV,
        Email: Email,
        SoDienThoai: SoDienThoai,
        GioiTinh: GioiTinh,
        NgaySinh: NgaySinh,
    }, { headers });
}
export { fetchAddStaff };

const fetchEditStaff = (headers, MaNV, HoNV, TenNV, Email, SoDienThoai, GioiTinh, NgaySinh) => { 
    return axios.put(`admin/nhan-vien/ChinhSua/${MaNV}`, {
        HoNV: HoNV,
        TenNV: TenNV,
        Email: Email,
        SoDienThoai: SoDienThoai,
        GioiTinh: GioiTinh,
        NgaySinh: NgaySinh,
    }, { headers });
}
export { fetchEditStaff };

const fetchDeleteStaff = (headers, MaNV) => { 
    return axios.delete(`admin/nhan-vien/Xoa/${MaNV}`, { headers });
}
export { fetchDeleteStaff };
//----------------------------------------------------------------------------------------------//

//--------------------------------Quotation----------------------------------------------//
const fetchAllQuotation = (headers) => { 
    return axios.get('admin/phieu-bao-gia/DanhSachPBG', { headers });
}
export { fetchAllQuotation };

const fetchDetailQuotation= (headers, MaPBG) => { 
    return axios.get(`admin/phieu-bao-gia/ChiTietPBG/${MaPBG}`, { headers });
}
export { fetchDetailQuotation };

const fetchAddQuotation = (headers, NgayBaoGia, TenPBG, KhachHangPBG, ThoiGianGiaoHang, DiaDiemGiaoHang, ThoiGianBaoHanh, ThanhToan, HieuLucBaoGia) => { 
    return axios.post(`admin/phieu-bao-gia/Them`, { //NgayBaoGia, TenPBG, KhachHangPBG, ThoiGianGiaoHang, DiaDiemGiaoHang, ThoiGianBaoHanh, ThanhToan, HieuLucBaoGia
        NgayBaoGia: NgayBaoGia,
        TenPBG: TenPBG,
        KhachHangPBG: KhachHangPBG,
        ThoiGianGiaoHang: ThoiGianGiaoHang,
        DiaDiemGiaoHang: DiaDiemGiaoHang,
        ThoiGianBaoHanh: ThoiGianBaoHanh,
        ThanhToan: ThanhToan,
        HieuLucBaoGia: HieuLucBaoGia,
    }, { headers });
}
export { fetchAddQuotation };

const fetchEditQuotation = (headers, MaPBG, NgayBaoGia, TenPBG, KhachHangPBG, ThoiGianGiaoHang, DiaDiemGiaoHang, ThoiGianBaoHanh, ThanhToan, HieuLucBaoGia) => { 
    return axios.put(`admin/phieu-bao-gia/ChinhSua/${MaPBG}`, {
        NgayBaoGia: NgayBaoGia,
        TenPBG: TenPBG,
        KhachHangPBG: KhachHangPBG,
        ThoiGianGiaoHang: ThoiGianGiaoHang,
        DiaDiemGiaoHang: DiaDiemGiaoHang,
        ThoiGianBaoHanh: ThoiGianBaoHanh,
        ThanhToan: ThanhToan,
        HieuLucBaoGia: HieuLucBaoGia,
    }, { headers });
}
export { fetchEditQuotation };

const fetchDeleteQuotation = (headers, MaPBG) => { 
    return axios.delete(`admin/phieu-bao-gia/Xoa/${MaPBG}`, { headers });
}
export { fetchDeleteQuotation };

const fetchAddProductQuotation = (headers, MaPBG, TenSP, QuyCachKyThuat, DonViTinh, SoLuong, Thue, DonGia, ThanhTien, ThanhTienSauThue) => { 
    return axios.post(`admin/phieu-bao-gia/ThemSanPhamBaoGia/${MaPBG}`, { 
        TenSP: TenSP,
        QuyCachKyThuat: QuyCachKyThuat,
        DonViTinh: DonViTinh,
        SoLuong: SoLuong,
        Thue: Thue,
        DonGia: DonGia,
        ThanhTien: ThanhTien,
        ThanhTienSauThue: ThanhTienSauThue,
    }, { headers });
}
export { fetchAddProductQuotation };

const fetchEditProductQuotation = (headers, MaPBG, id, TenSP, QuyCachKyThuat, DonViTinh, SoLuong, Thue, DonGia, ThanhTien, ThanhTienSauThue) => { 
    return axios.put(`admin/phieu-bao-gia/ChinhSuaSanPhamBaoGia/${MaPBG}`, {
        id: id,
        TenSP: TenSP,
        QuyCachKyThuat: QuyCachKyThuat,
        DonViTinh: DonViTinh,
        SoLuong: SoLuong,
        Thue: Thue,
        DonGia: DonGia,
        ThanhTien: ThanhTien,
        ThanhTienSauThue: ThanhTienSauThue,
    }, { headers });
}
export { fetchEditProductQuotation };

const fetchDeleteProductQuotation = (headers, MaPBG, id) => { 
    return axios.delete(`admin/phieu-bao-gia/XoaSanPhamBaoGia/${MaPBG}`, {
        id: id,
    } , { headers });
}
export { fetchDeleteProductQuotation };
//----------------------------------------------------------------------------------------------//
