import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import "./EditStaff.scss"
import { fetchEditStaff, fetchDetailStaff } from "../../GetAPI"
import { toast } from "react-toastify";
import moment from "moment";

const EditStaff = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const nhanvien = useParams();
    const [manv, SetManv] = useState('')
    const [honv, SetHonv] = useState('')
    const [tennv, SetTennv] = useState('')
    const [email, SetEmail] = useState('')
    const [sdt, SetSdt] = useState('')
    const [gioitinh, SetGioitinh] = useState('')
    const [ngaysinh, SetNgaysinh] = useState('')
    // component didmount
    useEffect(() => {
        getDetailStaff();
    }, []);

    const getDetailStaff = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailStaff(headers, nhanvien.MaNV);
        if (res && res.data) {
            SetManv(res.data.MaNV)
            SetHonv(res.data.HoNV)
            SetTennv(res.data.TenNV)
            SetEmail(res.data.Email)
            SetSdt(res.data.SoDienThoai)
            SetGioitinh(res.data.GioiTinh)
            SetNgaysinh(moment(res.data.NgaySinh).format("YYYY-MM-DD"))
        }
    }
    const handleEditStaff = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !manv || !honv || !tennv || !email || !sdt || !gioitinh || !ngaysinh) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        const value_ngaysinh = new Date(ngaysinh)
        let res = await fetchEditStaff(headers, manv, honv, tennv, email, sdt, gioitinh, value_ngaysinh)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/Staff")
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;

        }
    }

    const onChangeInputSL = (event, setState) => {
        let changeValue = event.target.value;
        setState(changeValue);
    }

    const onChangeSelect = (event, setSelect) => {
        let changeValue = event.target.value;
        setSelect(changeValue);
    }

    // check dữ liệu
    const [checkdulieuHo, SetCheckdulieuHo] = useState(true)
    const [checkdulieuTen, SetCheckdulieuTen] = useState(true)
    const [checkdulieuEmail, SetCheckdulieuEmail] = useState(true)
    const [checkdulieuSDT, SetCheckdulieuSDT] = useState(true)
    const checkdulieu = (value, setDuLieu) => {
        value === '' ? setDuLieu(false) : setDuLieu(true)
    }
    return (
        <main className="main2">
            {/* <HeaderMain title={'Chuyên ngành'} /> */}
            <div className="head-title">
                <div className="left">
                    <h1>CHỈNH SỬA</h1>
                    <ul className="breadcrumb">
                        <li>
                            <Link>Dashboard</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link>Nhân viên</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link className="active" >{manv}</Link>
                        </li>
                    </ul>
                </div>

            </div>


            <form className="form-edit">
                <div className="container-edit">
                <div className="form-row">
                        <div className="form-group col-md-4">
                            <label className="inputGV" htmlFor="inputHoGV">Mã nhân viên</label>
                            <input type="text" className="form-control" id="inputHoGV" placeholder="Điền mã nhân viên ..." value={manv} readOnly />
                        </div>
                        <div className="form-group col-md-4">
                            <label className="inputGV" htmlFor="inputHoGV">Họ nhân viên</label>
                            <input type="text" className="form-control" id="inputHoGV" placeholder="Điền họ nhân viên ..." value={honv} onChange={(event) => onChangeInputSL(event, SetHonv)} onBlur={() => checkdulieu(honv, SetCheckdulieuHo)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuHo ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="inputGV" htmlFor="inputTenGV">Tên Nhân Viên</label>
                            <input type="text" className="form-control" id="inputTenGV" placeholder="Điền tên nhân viên..." value={tennv} onChange={(event) => onChangeInputSL(event, SetTennv)} onBlur={() => checkdulieu(tennv, SetCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label className="inputGV" htmlFor="inputEmailGV">Email</label>
                            <input type="email" className="form-control" id="inputEmailGV" placeholder="abc...@gmail.com" value={email} onChange={(event) => onChangeInputSL(event, SetEmail)} onBlur={() => checkdulieu(email, SetCheckdulieuEmail)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuEmail ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className="inputGV" htmlFor="inputSdtGV">Số điện thoại</label>
                            <input type="text" className="form-control" id="inputSdtGV" placeholder="03899...." value={sdt} onChange={(event) => onChangeInputSL(event, SetSdt)} onBlur={() => checkdulieu(sdt, SetCheckdulieuSDT)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuSDT ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className="inputGV" htmlFor="inputNgaysinh">Ngày sinh</label>
                            <input type="date" className="form-control" id="inputNgaysinh" value={ngaysinh} onChange={(event) => onChangeInputSL(event, SetNgaysinh)} />
                        </div>
                        <div className="form-group col-md-3">
                            <label className="inputGV" htmlFor="inputGioitinhGV">Giới tính</label>
                            <select value={gioitinh} onChange={(event) => onChangeSelect(event, SetGioitinh)} id="inputGioitinhGV" className="form-control">
                                <option value='Nam'>Nam</option>
                                <option value='Nữ'>Nữ</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12 formbtn" id="btsubmit">
                            <div><button className="btn" type="button" onClick={() => handleEditStaff()}>Lưu dữ liệu</button></div>
                        </div>
                    </div>
                </div>
            </form>
        </main >
    )
}
export default EditStaff