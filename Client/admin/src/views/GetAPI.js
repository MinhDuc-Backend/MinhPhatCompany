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