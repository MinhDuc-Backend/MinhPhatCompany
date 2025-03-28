import axios from "./custom-axios"

//--------------------------------Product User----------------------------------------------//
const fetchAllProductUser = (page,pagesize,keyword) => { // Lấy danh sách sản phẩm
    return axios.get(`user/san-pham/DSSanPham?page=${page}&pageSize=${pagesize}&keyword=${keyword}`);
}
export { fetchAllProductUser };

const fetchDetailProductUser = (MaSP) => { // Chi tiết thông tin sản phẩm
    return axios.get(`user/san-pham/ChiTietSP/${MaSP}`);
}
export { fetchDetailProductUser };

const fetchAllProductUserCategory = (page,pagesize,keyword,MaLSP) => { // Lấy danh sách sản phẩm
    return axios.get(`user/san-pham/DSSanPhamTheoLoai?page=${page}&pageSize=${pagesize}&keyword=${keyword}&MaLSP=${MaLSP}`);
}
export { fetchAllProductUserCategory };
//----------------------------------------------------------------------------------------------//

//--------------------------------CategoryUser----------------------------------------------//
const fetchAllCategoryUser = () => { // Lấy danh sách loại sản phẩm cha
    return axios.get('user/lsp/DanhSachLSP');
}
export { fetchAllCategoryUser };

const fetchAllCategoryChildUser = () => { // Lấy danh sách loại sản phẩm con
    return axios.get('user/lsp/DanhSachLSPCon');
}
export { fetchAllCategoryChildUser };
//----------------------------------------------------------------------------------------------//
