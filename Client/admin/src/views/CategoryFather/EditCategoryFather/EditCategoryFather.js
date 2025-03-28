import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import "./EditCategoryFather.scss"
import TableCategoryChild from "../DetailCategoryFather/TableCategoryChild/TableCategoryChild";
import { fetchDetailCategoryFather, fetchEditCategoryFather } from "../../GetAPI"
import { toast } from "react-toastify";
const EditCategoryFather = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const categoryFather = useParams();
    let navigate = useNavigate();

    // get chi tiết ngành 
    const [detailCategoryFather, SetDetailCategoryFather] = useState({});
    const [categoryChild, SetCategoryChild] = useState([]);
    const [MaLSPCha, SetMaLSPCha] = useState("");
    const [TenLoai, SetTenLoai] = useState("");

    // component didmount
    useEffect(() => {
        getDetailCategoryFather();

    }, []);

    const getDetailCategoryFather = async () => {
        const headers = { 'x-access-token': accessToken };

        let res = await fetchDetailCategoryFather(headers, categoryFather.MaLSPCha);
        if (res && res.data && res.data.LSPCha) {
            SetDetailCategoryFather(res.data.LSPCha)
            SetCategoryChild(res.data.LSPCon)
            SetMaLSPCha(res.data.LSPCha.MaLSPCha)
            SetTenLoai(res.data.LSPCha.TenLoai)
        }
    }
    const handleEditCategoryFather = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!MaLSPCha || !TenLoai) {
            toast.error("Vui lòng điền đầy đủ dữ liệu !")
            return
        }
        let res = await fetchEditCategoryFather(headers, MaLSPCha, TenLoai)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/CategoryFather")
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;
        }
    }

    const onChangeInputSL = (event, SetSL) => {
        let changeValue = event.target.value;
        SetSL(changeValue);
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
                            <Link>Loại sản phẩm cha</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link className="active" >{TenLoai}</Link>
                        </li>


                    </ul>
                </div>

            </div>


            <form className="form-edit">
                <div className="container-edit">
                    <div className="form-row">
                        <div className="form-group col-md-6 titleMa">
                            <label className="inputNganh" htmlFor="inputMa">Mã loại sản phẩm cha</label>
                            <input type="text" disabled className="form-control" id="inputMa" value={MaLSPCha} onChange={(event) => onChangeInputSL(event, SetMaLSPCha)} onBlur={(event) => checkdulieu(MaLSPCha, SetCheckdulieuMa)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputTen">Tên loại</label>
                            <input type="text" className="form-control" id="inputTen" value={TenLoai} onChange={(event) => onChangeInputSL(event, SetTenLoai)} onBlur={(event) => checkdulieu(TenLoai, SetCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <TableCategoryChild listData_CategoryChild={categoryChild} />

                    <button className="btn" type="button" onClick={() => handleEditCategoryFather()}>Lưu</button>
                </div>



            </form>



        </main >
    )
}
export default EditCategoryFather;