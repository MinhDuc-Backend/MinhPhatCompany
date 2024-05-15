import axios from "../custom-axios"

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
    return axios.post(`admin/chuc-nang/Them`, data, { headers });
}
export { fetchAddChucNang };

//Xóa  Chức năng
const fetchDeleteChucNang = (headers, MaCN) => {
    return axios.delete(`admin/chuc-nang/Xoa/${MaCN}`, { headers });
}
export { fetchDeleteChucNang };
