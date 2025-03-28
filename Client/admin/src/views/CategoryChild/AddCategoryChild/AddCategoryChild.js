import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import "./AddCategoryChild.scss"
import { fetchAddCategoryChild, fetchAllCategoryFather } from "../../GetAPI"
import { toast } from "react-toastify";

const AddCategoryChild = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [listData_categoryFather, SetListData_CategoryFather] = useState([]);
    const [malspcon, SetMaLSPcon] = useState('')
    const [tenloai, SetTenLoai] = useState('')
    const [malspcha, SetMaLSPCha] = useState('Chọn')

    useEffect(() => {
        getListCategoryFather();

    }, []);
    const getListCategoryFather = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCategoryFather(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_CategoryFather(res.data.DanhSach)
        }
    }
    const handleAddCategoryChild = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!malspcon || !tenloai || malspcha == "Chọn") {
            toast.error("Vui lòng điền đầy đủ dữ liệu !")
            return
        }

        let res = await fetchAddCategoryChild(headers, malspcon, malspcha, tenloai)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/CategoryChild")
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
                    <h1>TẠO MỚI</h1>
                    <ul className="breadcrumb">
                        <li>
                            <Link>Dashboard</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link> Loại sản phẩm nhỏ</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link className="active" >Tạo mới</Link>
                        </li>


                    </ul>
                </div>

            </div>


            <form className="form-edit">
                <div className="container-edit">
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputMa">Mã loại sản phẩm nhỏ</label>
                            <input type="text" className="form-control" id="inputMa" placeholder="Điền mã loại ..." value={malspcon} onChange={(event) => onChangeInputSL(event, SetMaLSPcon)} onBlur={() => checkdulieu(malspcon, SetCheckdulieuMa)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputTen">Tên loại sản phẩm nhỏ</label>
                            <input type="text" className="form-control" id="inputTen" placeholder="Điền tên loại ..." value={tenloai} onChange={(event) => onChangeInputSL(event, SetTenLoai)} onBlur={() => checkdulieu(tenloai, SetCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputNganh">Loại sản phẩm lớn</label>
                            <select value={malspcha} onChange={(event) => onChangeSelect(event, SetMaLSPCha)} id="inputNganh" className="form-control">
                                <option key="Chọn" value="Chọn">Chọn loại sản phẩm lớn</option>
                                {listData_categoryFather && listData_categoryFather.length > 0 &&
                                    listData_categoryFather.map((item, index) => {
                                        return (
                                            <option key={item.MaLSPCha} value={item.MaLSPCha}>{item.TenLoai}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>


                    <button className="btn" type="button" onClick={() => handleAddCategoryChild()}>Lưu</button>
                </div>
            </form>
        </main >
    )
}
export default AddCategoryChild;