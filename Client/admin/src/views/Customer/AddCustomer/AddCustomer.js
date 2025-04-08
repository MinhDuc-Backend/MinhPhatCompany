import "./AddCustomer.scss"
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAddCustomer, fetchAllCompany } from "../../GetAPI"
import * as React from 'react';
import { toast } from "react-toastify";

const AddCustomer = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [MaKH, SetMaKH] = useState('')
    const [HoKH, SetHoKH] = useState('')
    const [TenKH, SetTenKH] = useState('')
    const [listCompany, setListCompany] = useState([]);
    const [Email, SetEmail] = useState('')
    const [SoDienThoai, SetSoDienThoai] = useState('')
    const [GioiTinh, SetGioiTinh] = useState('Chọn')
    const [MaCongTy, SetMaCongTy] = useState('')

    // component didmount
    useEffect(() => {
        getListCompany();
    }, []);

    const getListCompany = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCompany(headers);
        if (res && res.data && res.data.DanhSach) {
            setListCompany(res.data.DanhSach)
        }
    }

    const handleAddCustomer = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !MaKH || !HoKH || !TenKH || !Email || !SoDienThoai || GioiTinh == "Chọn" || !MaCongTy) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        document.getElementById('btsubmit').style.display = 'none';
        document.getElementById('btwait').style.display = 'block';

        let res = await fetchAddCustomer(headers, MaKH, HoKH, TenKH, Email, SoDienThoai, GioiTinh, MaCongTy)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/Customer")
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
    const [checkdulieuTen, SetCheckdulieuTen] = useState(true)
    const [checkdulieuHo, SetCheckdulieuHo] = useState(true)
    const [checkdulieuEmail, SetCheckdulieuEmail] = useState(true)
    const [checkdulieuSoDienThoai, SetCheckdulieuSoDienThoai] = useState(true)
    const [checkdulieuMaCongTy, SetCheckdulieuMaCongTy] = useState(true)
    const [checkdulieuGioiTinh, SetCheckdulieuGioiTinh] = useState(true)
    const checkdulieu = (value, SetDuLieu) => {
        (value === '' || value === 'Chọn') ? SetDuLieu(false) : SetDuLieu(true)
    }

    return (
        <main className="main2">
            {/* <HeaderMain title={'Chuyên ngành'} /> */}
            <div className="head-title">
                <div className="left">
                    <h1>TẠO MỚI</h1>
                    <ul className="breadcrumb">
                        <li>
                            <Link>Dashboard</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link>Khách hàng</Link>
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
                            <label className="inputSP" htmlFor="inputMaSP">Mã khách hàng</label>
                            <input type="text" className="form-control" id="inputHoGV" placeholder="Điền mã khách hàng ..." value={MaKH} onChange={(event) => onChangeInputSL(event, SetMaKH)} onBlur={() => checkdulieu(MaKH, SetCheckdulieuMa)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="inputSP" htmlFor="inputTenSP">Họ khách hàng</label>
                            <input type="text" className="form-control" id="inputTenGV" placeholder="Điền họ khách hàng ..." value={HoKH} onChange={(event) => onChangeInputSL(event, SetHoKH)} onBlur={() => checkdulieu(HoKH, SetCheckdulieuHo)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuHo ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="inputSP" htmlFor="inputTenSP">Tên khách hàng</label>
                            <input type="text" className="form-control" id="inputTenGV" placeholder="Điền tên khách hàng ..." value={TenKH} onChange={(event) => onChangeInputSL(event, SetTenKH)} onBlur={() => checkdulieu(TenKH, SetCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label className="inputSP" htmlFor="inputLSPCha">Loại sản phẩm con</label>
                            <select value={GioiTinh} onChange={(event) => onChangeSelect(event, SetGioiTinh)} id="inputLSPCon" className="form-control" onBlur={() => checkdulieu(GioiTinh, SetCheckdulieuGioiTinh)}>
                                <option key="NULL" value="Chọn">Chọn giới tính</option>
                                <option key="Nam" value="Nam">Nam</option>
                                <option key="Nu" value="Nữ">Nữ</option>
                            </select>
                            <div className="invalid-feedback" style={{ display: checkdulieuGioiTinh ? 'none' : 'block' }}>Vui lòng chọn vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className="inputSP" htmlFor="inputTenSP">Số điện thoại</label>
                            <input type="text" className="form-control" id="inputTenGV" placeholder="Điền số điện thoại ..." value={SoDienThoai} onChange={(event) => onChangeInputSL(event, SetSoDienThoai)} onBlur={() => checkdulieu(SoDienThoai, SetCheckdulieuSoDienThoai)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuSoDienThoai ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputSP" htmlFor="inputTenSP">Email</label>
                            <input type="email" className="form-control" id="inputTenGV" placeholder="Điền email ..." value={Email} onChange={(event) => onChangeInputSL(event, SetEmail)} onBlur={() => checkdulieu(Email, SetCheckdulieuEmail)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuEmail ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputSP" htmlFor="inputLSPCha">Công ty</label>
                            <select value={MaCongTy} onChange={(event) => onChangeSelect(event, SetMaCongTy)} id="inputLSPCha" className="form-control" onBlur={() => checkdulieu(MaCongTy, SetCheckdulieuMaCongTy)}>
                                <option key="NULL" value="Chọn">Chọn công ty</option>
                                {listCompany && listCompany.length > 0 &&
                                    listCompany.map((item, index) => {
                                        return (
                                            <option key={item.MaCongTy} value={item.MaCongTy}>{item.TenCongTy}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className="invalid-feedback" style={{ display: checkdulieuMaCongTy ? 'none' : 'block' }}>Vui lòng chọn vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12 formbtn" id="btsubmit">
                            <div><button className="btn btn-primary btn-sm" type="button" onClick={() => handleAddCustomer()}>Lưu dữ liệu</button></div>
                        </div>
                        <div className="form-group col-md-12 formbtn" id="btwait" style={{ display: 'none'}}>
                            <div><button className="btn btn-primary btn-sm" type="button" disabled>Đang xử lý, vui long đợi</button></div>
                        </div>
                    </div>
                    
                </div>
            </form>

        </main >
    )
}
export default AddCustomer