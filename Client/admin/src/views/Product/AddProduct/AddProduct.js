import "./AddProduct.scss"
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAddProduct, fetchAllCategoryFather, fetchDetailCategoryChildFollowFather } from "../../GetAPI"
import * as React from 'react';
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';

const AddProduct = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [maSP, SetMaSP] = useState('')
    const [tenSP, SetTenSP] = useState('')
    const [gia, SetGia] = useState(0)
    const [listCategoryFather, setListCategoryFather] = useState([]);
    const [listCategoryChild, setListCategoryChild] = useState([]);
    const [soluong, SetSoLuong] = useState(0)
    const [mota, SetMoTa] = useState('')
    const [lspcha, SetLSPCha] = useState('Chọn')
    const [lspcon, SetLSPCon] = useState('')
    const [Hinh, setHinh] = useState("")

    // component didmount
    useEffect(() => {
        getListCategoryFather();
    }, []);

    const getListCategoryFather = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCategoryFather(headers);
        if (res && res.data && res.data.DanhSach) {
            setListCategoryFather(res.data.DanhSach)
        }
    }
    const getListCategoryChld = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailCategoryChildFollowFather(headers,lspcha);
        if (res && res.data && res.data.DanhSach) {
            setListCategoryChild(res.data.DanhSach)
            document.getElementById('inputLSPCon').disabled = false
        }
        else
            document.getElementById('inputLSPCon').disabled = true
    }

    const handleAddProduct = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !maSP || !tenSP || !soluong || !lspcha || !lspcon || !Hinh) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        document.getElementById('btsubmit').style.display = 'none';
        document.getElementById('btwait').style.display = 'block';
        let value_product = new FormData();
        value_product.append("MaSP", maSP);
        value_product.append("TenSP", tenSP);
        value_product.append("Gia", gia);
        value_product.append("SoLuong", soluong);
        value_product.append("MoTa", mota);
        value_product.append("MaLSPCha", lspcha);
        value_product.append("MaLSPCon", lspcon);
        value_product.append("Hinh", Hinh);
        let res = await fetchAddProduct(headers, value_product)

        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/product")
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
    const onChangeFile = (event, setSL) => {
        const img = event.target.files[0];
        img.preview = URL.createObjectURL(img)
        setSL(img)
    }

    const onChangeNumber = (event, SetState) => {
        let value = event.target.value;
        SetState(value);
        if (value < 0){
            event.target.value = 0;
            SetState(0);
        }
    }

    // check dữ liệu
    const [checkdulieuMa, SetCheckdulieuMa] = useState(true)
    const [checkdulieuTen, SetCheckdulieuTen] = useState(true)
    const [checkdulieuGia, SetCheckdulieuGia] = useState(true)
    const [checkdulieuSoLuong, SetCheckdulieuSoLuong] = useState(true)
    const [checkdulieuMoTa, SetCheckdulieuMoTa] = useState(true)
    const [checkdulieuLSPCha, SetCheckdulieuLSPCha] = useState(true)
    const [checkdulieuLSPCon, SetCheckdulieuLSPCon] = useState(true)
    const [checkdulieuHinh, setCheckdulieuHinh] = useState(true)
    const checkdulieu = (value, SetDuLieu) => {
        (value === '' || value === 'Chọn') ? SetDuLieu(false) : SetDuLieu(true)
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
                            <Link>Sản phẩm</Link>
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
                            <label className="inputSP" htmlFor="inputMaSP">Mã sản phẩm</label>
                            <input type="text" className="form-control" id="inputHoGV" placeholder="Điền mã sản phẩm ..." value={maSP} onChange={(event) => onChangeInputSL(event, SetMaSP)} onBlur={() => checkdulieu(maSP, SetCheckdulieuMa)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-8">
                            <label className="inputSP" htmlFor="inputTenSP">Tên sản phẩm</label>
                            <input type="text" className="form-control" id="inputTenGV" placeholder="Điền tên sản phẩm ..." value={tenSP} onChange={(event) => onChangeInputSL(event, SetTenSP)} onBlur={() => checkdulieu(tenSP, SetCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputSP" htmlFor="inputLSPCha">Loại sản phẩm cha</label>
                            <select value={lspcha} onChange={(event) => onChangeSelect(event, SetLSPCha)} id="inputLSPCha" className="form-control" onClick={ () => getListCategoryChld() }>
                                <option key="NULL" value="Chọn">Chọn loại sản phẩm cha</option>
                                {listCategoryFather && listCategoryFather.length > 0 &&
                                    listCategoryFather.map((item, index) => {
                                        return (
                                            <option key={item.MaLSPCha} value={item.MaLSPCha}>{item.TenLoai}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputSP" htmlFor="inputLSPCha">Loại sản phẩm con</label>
                            <select value={lspcon} onChange={(event) => onChangeSelect(event, SetLSPCon)} id="inputLSPCon" className="form-control" disabled>
                                <option key="NULL" value="Chọn">Chọn loại sản phẩm con</option>
                                {listCategoryChild && listCategoryChild.length > 0 &&
                                    listCategoryChild.map((item, index) => {
                                        return (
                                            <option key={item.MaLSPCon} value={item.MaLSPCon}>{item.TenLoai}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label className="inputSP" htmlFor="inputGiaSP">Giá sản phẩm</label>
                            <input type="number" className="form-control" id="inputGiaSP" placeholder="Giá sản phẩm ..." value={gia} onChange={(event) => onChangeNumber(event, SetGia)} onBlur={() => checkdulieu(gia, SetCheckdulieuGia)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuGia ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-3">
                            <label className="inputSP" htmlFor="inputSoLuongSP">Số lượng</label>
                            <input type="number" className="form-control" id="inputSoLuongSP" placeholder="Số lượng sản phẩm ..." value={soluong} onChange={(event) => onChangeNumber(event, SetSoLuong)} onBlur={() => checkdulieu(soluong, SetCheckdulieuSoLuong)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuSoLuong ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputSP" htmlFor="inputMoTa">Mô tả</label>
                            <textarea className="form-control" id="inputMoTa" placeholder="Mô tả sản phẩm ..." value={mota} onChange={(event) => onChangeInputSL(event, SetMoTa)} onBlur={() => checkdulieu(mota, SetCheckdulieuMoTa)}></textarea>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-7">
                            <div className="custom-file">
                                <label className="inputKL" htmlFor="inputHinh">Hình ảnh</label>
                                <input type="file" accept="image/*" className="form-control file" id="inputHinh" onChange={(event) => onChangeFile(event, setHinh)} onBlur={() => checkdulieu(Hinh, setCheckdulieuHinh)} />
                            </div>
                            <div className="invalid-feedback" style={{ display: 'block', color: 'blue' }}>Chỉ chấp nhận các file có đuôi là png, jpeg, jpg ...</div>
                            <div className="invalid-feedback" style={{ display: checkdulieuHinh ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>

                        </div>

                        {Hinh ? <img className="img-preview" src={Hinh.preview} /> : ""}

                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12 formbtn" id="btsubmit">
                            <div><button className="btn btn-primary btn-sm" type="button" onClick={() => handleAddProduct()}>Lưu dữ liệu</button></div>
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
export default AddProduct