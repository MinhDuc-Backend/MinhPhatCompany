import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import "./DetailPurchaseOrder.scss"
import TableProductPurchaseOrder from "./TableProductPurchaseOrder";
import { fetchDetailPurchaseOrder } from "../../GetAPI"
import moment from "moment";
import { toast } from "react-toastify";

const SinglePurchaseOrder = () => {
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    const ddh = useParams();
    const date = moment().format("YYYY-MM-DD");
    const [MaDDH, SetMaDDH] = useState("")
    const [NgayDatHang, SetNgayDatHang] = useState(date)
    const [NgayHetHan, SetNgayHetHan] = useState(date)
    const [CongTyDatHang, SetCongTyDatHang] = useState("")
    const [TenDDH, SetTenDDH] = useState("")
    const [ThoiHanGiaoHang, SetThoiHanGiaoHang] = useState("")
    const [SanPhamDatHang, SetSanPhamDatHang] = useState([])

    const getDetailPurchaseOrder = useCallback(async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailPurchaseOrder(headers, ddh.MaDDH);
        if (res && res.data) {
            SetMaDDH(res.data.MaDDH)
            SetNgayDatHang(moment(res.data.NgayDatHang).format("YYYY-MM-DD"))
            SetNgayHetHan(moment(res.data.NgayHetHan).format("YYYY-MM-DD"))
            SetCongTyDatHang(res.data.CongTyDatHang.TenCongTy)
            SetTenDDH(res.data.TenDDH)
            SetThoiHanGiaoHang(res.data.ThoiHanGiaoHang)
            SetSanPhamDatHang(res.data.SanPhamDatHang)
        }
    }, [accessToken, ddh.MaDDH]);

    useEffect(() => {
        getDetailPurchaseOrder();
    }, [getDetailPurchaseOrder]);

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
                                <Link>Đơn đặt hàng</Link>
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
                            <div className="form-group col-md-12">
                                <label className="titleLabel" for="inputTen">Tên đơn đặt hàng</label>
                                <input type="text" className="form-control customInput" id="inputTen" value={TenDDH} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label className="titleLabel" for="inputNgayBD">Công ty đặt hàng</label>
                                <input type="text" className="form-control customInput" id="inputNgayBD" value={CongTyDatHang} readOnly />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label className="titleLabel" for="inputNgayBD">Ngày đặt hàng</label>
                                <input type="date" className="form-control customInput" id="inputNgayBD" value={NgayDatHang} readOnly />
                            </div>
                            <div className="form-group col-md-3">
                                <label className="titleLabel" for="inputNgayBD">Ngày hết hạn</label>
                                <input type="date" className="form-control customInput" id="inputNgayBD" value={NgayHetHan} readOnly />
                            </div>
                            <div className="form-group col-md-6">
                                <label className="titleLabel" for="inputNgayBD">Thời gian giao hàng</label>
                                <input type="text" className="form-control customInput" id="inputNgayBD" value={ThoiHanGiaoHang} readOnly />
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
                            <TableProductPurchaseOrder listData={SanPhamDatHang} />
                        </div>
                    </TabPanel>
                </TabContext>
            </div>
        </main >
    )
}
export default SinglePurchaseOrder;