import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import "./DetailQuotation.scss"
import TableProductQuotation from "./TableProductQuotation";
import { fetchDetailQuotation } from "../../GetAPI"
import moment from "moment";
import { toast } from "react-toastify";

const SingleQuotation = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const baogia = useParams();
    const [SoBaoGia, SetSoBaoGia] = useState("")
    const [NgayBaoGia, SetNgayBaoGia] = useState("")
    const [TenPBG, SetTenPBG] = useState("")
    const [HoKH, SetHoKH] = useState("")
    const [TenKH, SetTenKH] = useState("")
    const [Email, SetEmail] = useState("")
    const [SoDienThoai, SetSoDienThoai] = useState("")
    const [TenCongTy, SetTenCongTy] = useState("")
    const [MaCongTy, SetMaCongTy] = useState("")
    const [ThoiGianGiaoHang, SetThoiGianGiaoHang] = useState("")
    const [DiaDiemGiaoHang, SetDiaDiemGiaoHang] = useState("")
    const [ThoiGianBaoHanh, SetThoiGianBaoHanh] = useState("")
    const [ThanhToan, SetThanhToan] = useState("")
    const [HieuLucBaoGia, SetHieuLucBaoGia] = useState("")
    const [SanPhamPBG, SetSanPhamPBG] = useState([])
    const [TongTien, SetTongTien] = useState(0)

    // component didmount
    useEffect(() => {
        getDetailQuotation();
    }, []);

    const getDetailQuotation = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailQuotation(headers, baogia.MaPBG);
        if (res && res.data) {
            SetSoBaoGia(res.data.SoBaoGia)
            SetNgayBaoGia(res.data.NgayBaoGia)
            SetTenPBG(res.data.TenPBG)
            SetHoKH(res.data.KhachHangPBG.HoKH)
            SetTenKH(res.data.KhachHangPBG.TenKH)
            SetEmail(res.data.KhachHangPBG.Email)
            SetSoDienThoai(res.data.KhachHangPBG.SoDienThoai)
            SetTenCongTy(res.data.KhachHangPBG.CongTy.TenCongTy)
            SetMaCongTy(res.data.KhachHangPBG.CongTy.MaCongTy)
            SetThoiGianGiaoHang(res.data.ThoiGianGiaoHang)
            SetDiaDiemGiaoHang(res.data.DiaDiemGiaoHang)
            SetThoiGianBaoHanh(res.data.ThoiGianBaoHanh)
            SetThanhToan(res.data.ThanhToan)
            SetHieuLucBaoGia(res.data.HieuLucBaoGia)
            SetSanPhamPBG(res.data.SanPhamPBG)
            SetTongTien(res.data.TongTien)
        }
    }

    return (
        <main className="main2">
            <div className="customDiv">
                <div className="head-title">
                    <div className="left">
                        <h1>THÔNG TIN CHI TIẾT</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link>Phiếu báo giá</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active">{baogia.MaPBG}</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <form className="form-edit">
                    <div className="container-edit">
                        <div className="form-row">
                            <div className="form-group col-md-5">
                                <label className="titleLabel" for="inputTen">Tên phiếu báo giá</label>
                                <input type="text" className="form-control customInput" id="inputTen" value={TenPBG} readOnly />
                            </div>
                            <div className="form-group col-md-4">
                                <label className="titleLabel" for="inputNgayBD">Ngày báo giá</label>
                                <input type="text" className="form-control customInput" id="inputNgayBD" value={NgayBaoGia} readOnly />
                            </div>
                            <div className="form-group col-md-3">
                                <label className="titleLabel" for="inputNgayBD">Số báo giá</label>
                                <input type="text" className="form-control customInput" id="inputNgayBD" value={SoBaoGia} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label className="titleLabel" for="inputNgayBD">Kính gửi</label>
                                <input type="text" className="form-control customInput" id="inputNgayBD" value={TenCongTy} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label className="titleLabel" for="inputNgayBD">Đồng kính gửi</label>
                                <input type="text" className="form-control customInput" id="inputNgayBD" value={`${HoKH} ${TenKH}`} readOnly />
                            </div>
                            <div className="form-group col-md-6">
                                <label className="titleLabel" for="inputNgayBD">Mã khách hàng</label>
                                <input type="text" className="form-control customInput" id="inputNgayBD" value={MaCongTy} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label className="titleLabel" for="inputNgayBD">Email</label>
                                <input type="text" className="form-control customInput" id="inputNgayBD" value={Email} readOnly />
                            </div>
                            <div className="form-group col-md-6">
                                <label className="titleLabel" for="inputNgayBD">Số điện thoại</label>
                                <input type="text" className="form-control customInput" id="inputNgayBD" value={SoDienThoai} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <label className="titleLabel" for="inputKhoa">Thời gian giao hàng</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={ThoiGianGiaoHang} readOnly />
                            </div>
                            <div className="form-group col-md-4">
                                <label className="titleLabel" for="inputKhoa">Địa điểm giao hàng</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={DiaDiemGiaoHang} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label className="titleLabel" for="inputKhoa">Thời gian bảo hành</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={ThoiGianBaoHanh} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <label className="titleLabel" for="inputKhoa">Thanh toán</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={ThanhToan} readOnly />
                            </div>
                            <div className="form-group col-md-4">
                                <label className="titleLabel" for="inputKhoa">Hiệu lực báo giá</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={HieuLucBaoGia} readOnly />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="customDiv">
                <TabContext value="Các sản phẩm báo giá">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList aria-label="lab API tabs example">
                            <Tab label="Các sản phẩm báo giá" value="Các sản phẩm báo giá" key="Các sản phẩm báo giá" />
                        </TabList>
                    </Box>
                    <TabPanel value="Các sản phẩm báo giá" >
                        <div className="table">
                            <TableProductQuotation listData={SanPhamPBG} MaPBG={baogia.MaPBG} />
                        </div>
                    </TabPanel>
                </TabContext>
                <div className="container-edit">
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label className="titleLabel" for="inputTen">Tổng giá trị thanh toán</label>
                            <input type="text" className="form-control totalPrice" id="inputTen" 
                                    value={TongTien.toLocaleString('vi-VN', {
                                                currency: 'VND',
                                            })} 
                                    readOnly />
                        </div>
                    </div>
                </div>
            </div>

        </main >
    )
}
export default SingleQuotation;