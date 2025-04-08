import "./AddStaff.scss"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { fetchAddStaff } from "../../GetAPI"
import * as React from 'react';
import { toast } from "react-toastify";

const AddStaff = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [manv, SetManv] = useState('')
    const [honv, SetHonv] = useState('')
    const [tennv, SetTennv] = useState('')
    const [email, SetEmail] = useState('')
    const [sdt, SetSdt] = useState('')
    const [gioitinh, SetGioitinh] = useState('Nam')
    const [ngaysinh, SetNgaysinh] = useState('2000-01-01')

    const handleAddStaff = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !manv || !honv || !tennv || !email || !sdt || !gioitinh || !ngaysinh) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        const value_ngaysinh = new Date(ngaysinh)
        let res = await fetchAddStaff(headers, manv, honv, tennv, email, sdt, gioitinh, value_ngaysinh)
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
    const onChangeInputSL = (event, SetState) => {
        let changeValue = event.target.value;
        SetState(changeValue);
    }

    const onChangeSelect = (event, SetSelect) => {
        let changeValue = event.target.value;
        SetSelect(changeValue);
    }

    // check dữ liệu
    const [checkdulieuMa, SetCheckdulieuMa] = useState(true)
    const [checkdulieuHo, SetCheckdulieuHo] = useState(true)
    const [checkdulieuTen, SetCheckdulieuTen] = useState(true)
    const [checkdulieuEmail, SetCheckdulieuEmail] = useState(true)
    const [checkdulieuSDT, SetCheckdulieuSDT] = useState(true)
    const checkdulieu = (value, SetDuLieu) => {
        value === '' ? SetDuLieu(false) : SetDuLieu(true)
    }

    return (
        <main className="main2">
            {/* <HeaderMain title={'Chuyên ngành'} /> */}
            <div className="head-title">
                <div className="left">
                    <h1>TẠO MỚI </h1>
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
                            <Link className="active" >Tạo mới</Link>
                        </li>


                    </ul>
                </div>
            </div>

            <form className="form-new">
                <div className="container-edit">
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label className="inputGV" htmlFor="inputHoGV">Mã nhân viên</label>
                            <input type="text" className="form-control" id="inputHoGV" placeholder="Điền mã nhân viên ..." value={manv} onChange={(event) => onChangeInputSL(event, SetManv)} onBlur={() => checkdulieu(manv, SetCheckdulieuMa)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
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
                            <div><button className="btn" type="button" onClick={() => handleAddStaff()}>Lưu dữ liệu</button></div>
                        </div>
                    </div>
                </div>
            </form>



        </main >
    )
}
export default AddStaff