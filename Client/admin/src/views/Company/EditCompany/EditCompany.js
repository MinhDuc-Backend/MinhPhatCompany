import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import { fetchDetailCompany, fetchEditCompany } from "../../GetAPI"
import { toast } from "react-toastify";

const EditCompany = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const congty = useParams();
    let navigate = useNavigate();
    const [macty, SetMaCongTy] = useState('')
    const [tencty, SetTenCongTy] = useState('')
    const [diachi, SetDiaChi] = useState('')
    const onChangeInputSL = (event, SetSL) => {
        let changeValue = event.target.value;
        SetSL(changeValue);
    }

    useEffect(() => {
        getDetailCompany();
    }, []);

    const getDetailCompany = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailCompany(headers, congty.MaCongTy);
        if (res && res.data) {
            SetMaCongTy(res.data.MaCongTy)
            SetTenCongTy(res.data.TenCongTy)
            SetDiaChi(res.data.DiaChi)
        }
    }


    const handleEditCompany= async () => {
        const headers = { 'x-access-token': accessToken };
        if (!macty || !tencty || !diachi) {
            toast.error("Vui lòng điền đầy đủ dữ liệu !")
            return
        }
        let res = await fetchEditCompany(headers, macty, tencty, diachi)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/Company")
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;
        }
    }

    const onChangeSelect = (event, SetSelect) => {
        let changeValue = event.target.value;
        SetSelect(changeValue);
    }

    // check dữ liệu
    const [checkdulieuMa, SetCheckdulieuMa] = useState(true)
    const [checkdulieuTen, SetCheckdulieuTen] = useState(true)
    const [checkdulieuDiaChi, SetCheckdulieuDiaChi] = useState(true)
    const checkdulieu = (value, SetDuLieu) => {
        value === '' ? SetDuLieu(false) : SetDuLieu(true)
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
                            <Link>Công ty</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link className="active" >{congty.MaCongTy}</Link>
                        </li>
                    </ul>
                </div>

            </div>


            <form className="form-edit">
                <div className="container-edit">
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="inputNganh" htmlFor="inputMa">Mã công ty</label>
                        <input type="text" className="form-control" id="inputMa" placeholder="Điền mã công ty ..." value={macty} onChange={(event) => onChangeInputSL(event, SetMaCongTy)} onBlur={() => checkdulieu(macty, SetCheckdulieuMa)} readOnly />
                        <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                    </div>
                    <div className="form-group col-md-6">
                        <label className="inputNganh" htmlFor="inputTen">Tên công ty</label>
                        <input type="text" className="form-control" id="inputTen" placeholder="Điền tên công ty ..." value={tencty} onChange={(event) => onChangeInputSL(event, SetTenCongTy)} onBlur={() => checkdulieu(tencty, SetCheckdulieuTen)} />
                        <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                    </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label className="inputNganh" htmlFor="inputMa">Địa chỉ công ty</label>
                            <textarea className="form-control" id="inputMa" placeholder="Điền địa chỉ công ty ..." value={diachi} onChange={(event) => onChangeInputSL(event, SetDiaChi)} onBlur={() => checkdulieu(diachi, SetCheckdulieuDiaChi)}></textarea>
                            <div className="invalid-feedback" style={{ display: checkdulieuDiaChi ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row" >
                        <div className="form-group col-md-12 formbtn">
                            <div><button className="btn" type="button" onClick={() => handleEditCompany()}>Lưu dữ liệu</button></div>
                        </div>
                    </div>
                </div>



            </form>



        </main >
    )
}
export default EditCompany;