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

//--------------------------------Product User----------------------------------------------//
const fetchAllProductUser = (page,pagesize,keyword) => { // Lấy danh sách sản phẩm
    return axios.get(`user/san-pham/DSSanPham?page=${page}&pageSize=${pagesize}&keyword=${keyword}`);
}
export { fetchAllProductUser };

const fetchDetailProductUser = (headers, MaSP) => { // Chi tiết thông tin sản phẩm
    return axios.get(`user/san-pham/ChiTietSanPham/${MaSP}`, { headers });
}
export { fetchDetailProductUser };

const fetchAllProductUserCategory = (page,pagesize,keyword,MaLSP) => { // Lấy danh sách sản phẩm
    return axios.get(`user/san-pham/DSSanPhamTheoLoai?page=${page}&pageSize=${pagesize}&keyword=${keyword}&MaLSP=${MaLSP}`);
}
export { fetchAllProductUserCategory };
//----------------------------------------------------------------------------------------------//

//--------------------------------CategoryUser----------------------------------------------//
const fetchAllCategoryUser = () => { // Lấy danh sách loại sản phẩm
    return axios.get('user/lsp/DanhSachLSP');
}
export { fetchAllCategoryUser };
//----------------------------------------------------------------------------------------------//
