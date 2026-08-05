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
import "./EditPurchaseOrder.scss"
import TableProductPurchaseOrder from "./TableProductPurchaseOrder";
import { fetchDetailPurchaseOrder, fetchAllCompany, fetchEditPurchaseOrder } from "../../GetAPI"

const EditPurchaseOrder = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const ddh = useParams();
    let navigate = useNavigate();
    const [listData_CongTy, SetListData_CongTy] = useState([]);
    const date = moment().format("YYYY-MM-DD");
    const [MaDDH, SetMaDDH] = useState("")
    const [NgayDatHang, SetNgayDatHang] = useState(date)
    const [NgayHetHan, SetNgayHetHan] = useState(date)
    const [CongTyDatHang, SetCongTyDatHang] = useState("Chọn")
    const [TenDDH, SetTenDDH] = useState("")
    const [ThoiHanGiaoHang, SetThoiHanGiaoHang] = useState("")
    const [SanPhamDatHang, SetSanPhamDatHang] = useState([])
    const [TrangThaiDonHang, SetTrangThaiDonHang] = useState("")

    // component didmount
    useEffect(() => {
        getDetailPurchaseOrder();
        getListCompany();
    }, []);

    const getListCompany = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCompany(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_CongTy(res.data.DanhSach)
        }
    }

    const getDetailPurchaseOrder = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailPurchaseOrder(headers, ddh.MaDDH);
        if (res && res.data) {
            SetMaDDH(res.data.MaDDH)
            SetNgayDatHang(moment(res.data.NgayDatHang).format("YYYY-MM-DD"))
            SetNgayHetHan(moment(res.data.NgayHetHan).format("YYYY-MM-DD"))
            SetCongTyDatHang(res.data.CongTyDatHang.MaCongTy)
            SetTenDDH(res.data.TenDDH)
            SetThoiHanGiaoHang(res.data.ThoiHanGiaoHang)
            SetSanPhamDatHang(res.data.SanPhamDatHang)
            SetTrangThaiDonHang(res.data.TrangThaiDDH)
        }
    }

    const handleEditPurchaseOrder = async () => {
            const headers = { 'x-access-token': accessToken };
            if (!headers || !NgayDatHang || !NgayHetHan || CongTyDatHang == "Chọn" || !TenDDH || !ThoiHanGiaoHang) {
                toast.error("Vui lòng điền đầy đủ dữ liệu")
                return
            }
            const ngaydathang = new Date(NgayDatHang);
            const ngayhethan = new Date(NgayHetHan);
            let res = await fetchEditPurchaseOrder(headers, MaDDH, CongTyDatHang, ngaydathang, ngayhethan, TenDDH, ThoiHanGiaoHang, TrangThaiDonHang)
            if (res.status === true) {
                toast.success(res.message)
                navigate("/admin/PurchaseOrder")
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

    const [checkdulieuTenDDH, setCheckdulieuTenDDH] = useState(true)
    const [checkdulieuThoiHanGiaoHang, setCheckdulieuThoiHanGiaoHang] = useState(true)
    const checkdulieu = (value, setDuLieu) => {
        value === '' ? setDuLieu(false) : setDuLieu(true)
    }

    return (
        <main className="main2">
            <div className="customDiv">
                <div className="head-title">
                    <div className="left">
                        <h1>CHỈNH SỬA ĐƠN ĐẶT HÀNG</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link>Điều chỉnh đơn đặt hàng</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active">{ddh.MaDDH}</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <form className="form-edit">
                    <div className="container-edit">
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label className="titleLabel" for="inputNgayBD">Ngày đặt hàng</label>
                                <input type="date" className="form-control customInput" id="inputNgayBD" value={NgayDatHang} onChange={(event) => onChangeInputSL(event, SetNgayDatHang)} />
                            </div>
                            <div className="form-group col-md-4">
                                <label className="titleLabel" for="inputNgayBD">Ngày hết hạn</label>
                                <input type="date" className="form-control customInput" id="inputNgayBD" value={NgayHetHan} onChange={(event) => onChangeInputSL(event, SetNgayHetHan)} />
                            </div>
                            <div className="form-group col-md-4">
                                <label className="titleLabel" for="inputNgayBD">Trạng thái đơn hàng</label>
                                <select value={TrangThaiDonHang} onChange={(event) => onChangeSelect(event, SetTrangThaiDonHang)} id="inputNganh" className="form-control customInput">
                                    <option key="1" value='Chưa giao hàng'>Chưa giao hàng</option>
                                    <option key="2" value='Đã giao hàng'>Đã giao hàng</option>
                                    <option key="3" value='Đã xuất hóa đơn'>Đã xuất hóa đơn</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label className="titleLabel" htmlFor="inputNganh">Công ty đặt hàng</label>
                                <select value={CongTyDatHang} onChange={(event) => onChangeSelect(event, SetCongTyDatHang)} id="inputNganh" className="form-control customInput">
                                    <option key="NULL" value='Chọn'>Chọn công ty</option>
                                    {listData_CongTy && listData_CongTy.length > 0 &&
                                        listData_CongTy.map((item, index) => {
                                            return (
                                                <option key={item.MaCongTy} value={item.MaCongTy}>
                                                    {item.TenCongTy}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label className="titleLabel" for="inputKhoa">Tên đơn đặt hàng</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={TenDDH} placeholder="Tên đơn đặt hàng ..." onChange={(event) => onChangeInputSL(event, SetTenDDH)} onBlur={() => checkdulieu(TenDDH, setCheckdulieuTenDDH)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuTenDDH ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label className="titleLabel" for="inputKhoa">Thời gian giao hàng</label>
                                <input type="text" className="form-control customInput" id="inputKhoa" value={ThoiHanGiaoHang} placeholder="Thời gian giao hàng ..." onChange={(event) => onChangeInputSL(event, SetThoiHanGiaoHang)} onBlur={() => checkdulieu(ThoiHanGiaoHang, setCheckdulieuThoiHanGiaoHang)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuThoiHanGiaoHang ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12 formbtn" id="btsubmit">
                                <div><button className="btn" type="button" style={{color: 'white'}} onClick={() => handleEditPurchaseOrder()}>Cập nhật dữ liệu</button></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="customDiv">
                <TabContext value="Các sản phẩm đặt hàng">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList aria-label="lab API tabs example">
                            <Tab label="Các sản phẩm đặt hàng" value="Các sản phẩm đặt hàng" key="Các sản phẩm đặt hàng" />
                        </TabList>
                    </Box>
                    <TabPanel value="Các sản phẩm đặt hàng" >
                        <div className="table">
                            <TableProductPurchaseOrder listData={SanPhamDatHang} MaDDH={ddh.MaDDH} SetListData={SetSanPhamDatHang} />
                        </div>
                    </TabPanel>
                </TabContext>
            </div>

        </main >
    )
}
export default EditPurchaseOrder;