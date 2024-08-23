import axios from "./custom-axios"

const fetchLoginAdmin = (TenDangNhap, MatKhau) => { // Đăng nhập admin
    return axios.post('tai-khoan/DangNhapAdmin', {
        TenDangNhap: TenDangNhap,
        MatKhau: MatKhau,
    })
}
export { fetchLoginAdmin };

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

const fetchEditProduct = (headers, MaSP, data) => { // Chỉnh sửa thông tin sản phẩm
    return axios.post(`admin/san-pham/ChinhSua/${MaSP}`, data, { headers });
}
export { fetchEditProduct };

const fetchDeleteProduct = (headers, MaSP) => { // Xóa sản phẩm
    return axios.delete(`admin/san-pham/Xoa/${MaSP}`, { headers });
}
export { fetchDeleteProduct };
//----------------------------------------------------------------------------------------------//