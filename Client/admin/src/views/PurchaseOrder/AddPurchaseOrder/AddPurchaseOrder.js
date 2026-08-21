import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import moment from 'moment';
import * as React from 'react';
import "./AddPurchaseOrder.scss"
import { fetchAllCompany, fetchAddPurchaseOrder } from "../../GetAPI"
import { toast } from "react-toastify";

const AddPurchaseOrder = () => {
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [listData_CongTy, SetListData_CongTy] = useState([]);
    const date = moment().format("YYYY-MM-DD");
    const [NgayDatHang, SetNgayDatHang] = useState(date)
    const [NgayHetHan, SetNgayHetHan] = useState(date)
    const [CongTyDatHang, SetCongTyDatHang] = useState("Chọn")
    const [TenDDH, SetTenDDH] = useState("")
    const [ThoiHanGiaoHang, SetThoiHanGiaoHang] = useState("")

    const getListCompany = useCallback(async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCompany(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_CongTy(res.data.DanhSach)
        }
    }, [accessToken]);

    const handleAddPurchaseOrder = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !NgayDatHang || !NgayHetHan || CongTyDatHang == "Chọn" || !TenDDH || !ThoiHanGiaoHang) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        const ngaydathang = new Date(NgayDatHang);
        const ngayhethan = new Date(NgayHetHan);
        let res = await fetchAddPurchaseOrder(headers, CongTyDatHang, ngaydathang, ngayhethan, TenDDH, ThoiHanGiaoHang)
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

    useEffect(() => {
        getListCompany();
    }, [getListCompany]);

    const onChangeInputSL = (event, setSL) => {
        let changeValue = event.target.value;
        setSL(changeValue);
    }
    const onChangeSelect = (event, setSelect) => {
        let changeValue = event.target.value;
        setSelect(changeValue);
    }

    // check dữ liệu  
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
                        <h1>TẠO MỚI</h1>
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
                                <Link className="active" >Tạo đơn đặt hàng</Link>
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
                                <div><button className="btn" type="button" onClick={() => handleAddPurchaseOrder()}>Lưu dữ liệu</button></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </main >
    )
}
export default AddPurchaseOrder;