import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import moment from 'moment';
import { toast } from "react-toastify";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import "./EditQuotation.scss"
import TableProductQuotation from "./TableProductQuotation";
import { fetchDetailQuotation, fetchAllCustomer, fetchEditQuotation } from "../../GetAPI"

const EditQuotation = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const baogia = useParams();
    let navigate = useNavigate();
    const [listData_KhachHang, SetListData_KhachHang] = useState([]);
    const [MaPBG, SetMaPBG] = useState("")
    const [SoBaoGia, SetSoBaoGia] = useState("")
    const [NgayBaoGia, SetNgayBaoGia] = useState("")
    const [TenPBG, SetTenPBG] = useState("")
    const [KhachHangPBG, SetKhachHangPBG] = useState("Chọn")
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
        getListCustomer();
    }, []);

    const getListCustomer = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCustomer(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_KhachHang(res.data.DanhSach)
        }
    }

    const getDetailQuotation = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailQuotation(headers, baogia.MaPBG);
        if (res && res.data) {
            SetMaPBG(res.data.MaPBG)
            SetSoBaoGia(res.data.SoBaoGia)
            SetNgayBaoGia(moment(res.data.NgayBaoGia).format("YYYY-MM-DD"))
            SetTenPBG(res.data.TenPBG)
            SetKhachHangPBG(res.data.KhachHangPBG.MaKH)
            SetThoiGianGiaoHang(res.data.ThoiGianGiaoHang)
            SetDiaDiemGiaoHang(res.data.DiaDiemGiaoHang)
            SetThoiGianBaoHanh(res.data.ThoiGianBaoHanh)
            SetThanhToan(res.data.ThanhToan)
            SetHieuLucBaoGia(res.data.HieuLucBaoGia)
            SetSanPhamPBG(res.data.SanPhamPBG)
            SetTongTien(res.data.TongTien)
        }
    }

    const handleEditQuotation = async () => {
            const headers = { 'x-access-token': accessToken };
            if (!headers || !NgayBaoGia || !TenPBG || KhachHangPBG == "Chọn" || !ThoiGianGiaoHang || !DiaDiemGiaoHang || !ThoiGianBaoHanh || !ThanhToan || !HieuLucBaoGia) {
                toast.error("Vui lòng điền đầy đủ dữ liệu")
                return
            }
            const ngaybg = new Date(NgayBaoGia);
            let res = await fetchEditQuotation(headers, MaPBG, ngaybg, TenPBG, KhachHangPBG, ThoiGianGiaoHang, DiaDiemGiaoHang, ThoiGianBaoHanh, ThanhToan, HieuLucBaoGia)
            if (res.status === true) {
                toast.success(res.message)
                navigate("/admin/Quotation")
                return;
            }
            if (res.status === false) {
                toast.error(res.message)
                return;
            }
        }

    const onChangeInputSL = (event, setSL) => {
        let changeValue = event.target.value;
        setSL(changeValue);
    }
    const onChangeSelect = (event, setSelect) => {
        let changeValue = event.target.value;
        setSelect(changeValue);
    }

    const [checkdulieuTenPBG, setCheckdulieuTenPBG] = useState(true)
    const [checkdulieuThoiGianGiaoHang, setCheckdulieuThoiGianGiaoHang] = useState(true)
    const [checkdulieuDiaDiemGiaoHang, setCheckdulieuDiaDiemGiaoHang] = useState(true)
    const [checkdulieuThoiGianBaoHanh, setCheckdulieuThoiGianBaoHanh] = useState(true)
    const [checkdulieuThanhToan, setCheckdulieuThanhToan] = useState(true)
    const [checkdulieuHieuLucBaoGia, setCheckdulieuHieuLucBaoGia] = useState(true)
    const checkdulieu = (value, setDuLieu) => {
        value === '' ? setDuLieu(false) : setDuLieu(true)
    }

    return (
        <main className="main2">
            <div className="customDiv">
                <div className="head-title">
                    <div className="left">
                        <h1>CHỈNH SỬA BÁO GIÁ</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link>Điều chỉnh phiếu báo giá</Link>
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
                            <div className="form-group col-md-4">
                                <label className="titleLabel" for="inputNgayBD">Ngày báo giá</label>
                                <input type="date" className="form-control customInput" id="inputNgayBD" value={NgayBaoGia} onChange={(event) => onChangeInputSL(event, SetNgayBaoGia)} />
                            </div>
                            <div className="form-group col-md-8">
                                <label className="titleLabel" for="inputTen">Tên phiếu báo giá</label>
                                <input type="text" className="form-control customInput" id="inputTen" value={TenPBG} placeholder="Điền tên phiếu báo giá ..." onChange={(event) => onChangeInputSL(event, SetTenPBG)} onBlur={() => checkdulieu(TenPBG, setCheckdulieuTenPBG)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuTenPBG ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label className="titleLabel" htmlFor="inputNganh">Khách hàng</label>
                                <select value={KhachHangPBG} onChange={(event) => onChangeSelect(event, SetKhachHangPBG)} id="inputNganh" className="form-control customInput">
                                    <option key="NULL" value='Chọn'>Chọn khách hàng</option>
                                    {listData_KhachHang && listData_KhachHang.length > 0 &&
                                        listData_KhachHang.map((item, index) => {
                                            return (
                                                <option key={item.MaKH} value={item.MaKH}>
                                                    {item.HoKH} {item.TenKH} ({item.CongTy.TenCongTy})
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <label className="titleLabel" for="inputKhoa">Thời gian giao hàng</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={ThoiGianGiaoHang} placeholder="Thời gian giao hàng ..." onChange={(event) => onChangeInputSL(event, SetThoiGianGiaoHang)} onBlur={() => checkdulieu(ThoiGianGiaoHang, setCheckdulieuThoiGianGiaoHang)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuThoiGianGiaoHang ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                            <div className="form-group col-md-4">
                                <label className="titleLabel" for="inputKhoa">Địa điểm giao hàng</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={DiaDiemGiaoHang} placeholder="Địa điểm giao hàng ..." onChange={(event) => onChangeInputSL(event, SetDiaDiemGiaoHang)} onBlur={() => checkdulieu(DiaDiemGiaoHang, setCheckdulieuDiaDiemGiaoHang)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuDiaDiemGiaoHang ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label className="titleLabel" for="inputKhoa">Thời gian bảo hành</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={ThoiGianBaoHanh} placeholder="Địa điểm giao hàng ..." onChange={(event) => onChangeInputSL(event, SetThoiGianBaoHanh)} onBlur={() => checkdulieu(DiaDiemGiaoHang, setCheckdulieuThoiGianBaoHanh)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuThoiGianBaoHanh ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-8">
                                <label className="titleLabel" for="inputKhoa">Thanh toán</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={ThanhToan} placeholder="Thanh toán ..." onChange={(event) => onChangeInputSL(event, SetThanhToan)} onBlur={() => checkdulieu(ThanhToan, setCheckdulieuThanhToan)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuThanhToan ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                            <div className="form-group col-md-4">
                                <label className="titleLabel" for="inputKhoa">Hiệu lực báo giá</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={HieuLucBaoGia} placeholder="Hiệu lực báo giá ..." onChange={(event) => onChangeInputSL(event, SetHieuLucBaoGia)} onBlur={() => checkdulieu(HieuLucBaoGia, setCheckdulieuHieuLucBaoGia)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuHieuLucBaoGia ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12 formbtn" id="btsubmit">
                                <div><button className="btn" type="button" onClick={() => handleEditQuotation()}>Cập nhật dữ liệu</button></div>
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
export default EditQuotation;