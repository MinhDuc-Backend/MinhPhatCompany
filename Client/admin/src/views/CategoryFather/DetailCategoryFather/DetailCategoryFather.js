

import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import "./DetailCategoryFather.scss"
import TableCategoryChild from "./TableCategoryChild/TableCategoryChild";
import { fetchDetailCategoryFather } from "../../GetAPI"
const DetailCategoryFather = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const categoryFather = useParams();

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



    const onChangeInputSL = (event, SetSL) => {
        let changeValue = event.target.value;
        SetSL(changeValue);
    }
    return (
        <main className="main2">
            {/* <HeaderMain title={'Chuyên ngành'} /> */}
            <div className="head-title">
                <div className="left">
                    <h1>THÔNG TIN CHI TIẾT</h1>
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
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputMa">Mã loại sản phẩm cha</label>
                            <input type="text" className="form-control" id="inputMa" value={MaLSPCha} disabled />
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputTen">Tên loại</label>
                            <input type="text" className="form-control" id="inputTen" value={TenLoai} disabled />
                        </div>
                    </div>

                    <TableCategoryChild listData_CategoryChild={categoryChild} />
                    {/* <button className="btn" type="submit">Submit form</button> */}
                </div>
            </form>
        </main >
    )
}
export default DetailCategoryFather;