import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import "./EditChuyenNganh.scss";
import { fetchDetailChuyenNganh, fetchEditChuyenNganh, fetchAllNganh } from "../../GetData"
import { toast } from "react-toastify";
const EditChuyenNganh = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const chuyennganh = useParams();
    let navigate = useNavigate();
    const [listData_nganh, SetListData_nganh] = useState([]);
    const [machuyenganh, SetMachuyennganh] = useState("")
    const [tenchuyennganh, SetTenchuyennganh] = useState("")
    const [nganhhoc, SetNganhhoc] = useState("")
    const onChangeInputSL = (event, SetSL) => {
        let changeValue = event.target.value;
        SetSL(changeValue);
    }

    useEffect(() => {
        getDetailChuyenNganh();
        getListNganh();

    }, []);
    const getListNganh = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllNganh(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_nganh(res.data.DanhSach)
        }
    }
    const getDetailChuyenNganh = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailChuyenNganh(headers, chuyennganh.MaChuyenNganh);
        if (res && res.data) {
            SetMachuyennganh(res.data.MaChuyenNganh)
            SetTenchuyennganh(res.data.TenChuyenNganh)
            SetNganhhoc(res.data.MaNganh.MaNganh)
        }
    }


    const handleEditChuyenNganh = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!machuyenganh || !tenchuyennganh) {
            toast.error("Vui lòng điền đầy đủ dữ liệu !")
            return
        }
        let res = await fetchEditChuyenNganh(headers, machuyenganh, nganhhoc, tenchuyennganh)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/chuyennganh")
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
                            <Link>Chuyên ngành</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link className="active" >{chuyennganh.MaChuyenNganh}</Link>
                        </li>
                    </ul>
                </div>

            </div>


            <form className="form-edit">
                <div className="container-edit">
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputMa">Mã chuyên ngành</label>
                            <input type="text" className="form-control" id="inputMa" value={machuyenganh} onChange={(event) => onChangeInputSL(event, SetMachuyennganh)} onBlur={(event) => checkdulieu(machuyenganh, SetCheckdulieuMa)} disabled={true} />
                            <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputTen">Tên chuyên ngành</label>
                            <input type="text" className="form-control" id="inputTen" value={tenchuyennganh} onChange={(event) => onChangeInputSL(event, SetTenchuyennganh)} onBlur={(event) => checkdulieu(tenchuyennganh, SetCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label className="inputNganh" htmlFor="inputNganh">Ngành</label>
                            <select value={nganhhoc} onChange={(event) => onChangeSelect(event, SetNganhhoc)} id="inputNganh" className="form-control">
                                {listData_nganh && listData_nganh.length > 0 &&
                                    listData_nganh.map((item, index) => {
                                        return (
                                            <option key={item.MaNganh} value={item.MaNganh}>{item.TenNganh}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>


                    <button className="btn" type="button" onClick={() => handleEditChuyenNganh()}>Lưu</button>
                </div>



            </form>



        </main >
    )
}
export default EditChuyenNganh;