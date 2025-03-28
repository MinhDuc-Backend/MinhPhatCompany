import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import "./EditProduct.scss"
import { fetchAllCategoryFather, fetchDetailCategoryChildFollowFather, fetchDetailProduct, fetchEditProduct, fetchEditImageProduct } from "../../GetAPI"
import { toast } from "react-toastify";
import moment from "moment";

const EditProduct = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const product = useParams();
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
    const [checkHinh, setCheckHinh] = useState(true)
    // component didmount
    useEffect(() =>{
        getListCategoryFather();
        getDetailProduct();
    }, []);
    const getListCategoryFather = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCategoryFather(headers);
        if (res && res.data && res.data.DanhSach) {
            setListCategoryFather(res.data.DanhSach)
        }
    }

    const getListCategoryChild = async (lspcha) => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailCategoryChildFollowFather(headers,lspcha);
        if (res && res.data && res.data.DanhSach) {
            setListCategoryChild(res.data.DanhSach)
        }
    }

    const getDetailProduct = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailProduct(headers, product.MaSP);
        if (res && res.data) {
            SetMaSP(res.data.MaSP)
            SetTenSP(res.data.TenSP)
            SetGia(res.data.Gia)
            SetSoLuong(res.data.SoLuong)
            SetMoTa(res.data.MoTa)
            SetLSPCha(res.data.MaLSPCha.MaLSPCha)
            SetLSPCon(res.data.MaLSPCon.MaLSPCon)
            setHinh(res.data.Hinh)
            getListCategoryChild(res.data.MaLSPCha.MaLSPCha);
        }
    }
    const handleEditProduct = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !maSP || !tenSP || !soluong || !lspcha || !Hinh) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }

        let res = await fetchEditProduct(headers, maSP, tenSP, gia, soluong, mota, lspcha, lspcon)
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

    const handleEditImageProduct = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !maSP || !tenSP || !soluong || !lspcha || !Hinh) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }

        let value_product = new FormData();
        value_product.append("Hinh", Hinh);

        let res = await fetchEditImageProduct(headers, maSP, value_product)
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

    const onChangeFile = (event, setSL) => {
        const img = event.target.files[0];
        img.preview = URL.createObjectURL(img)
        setSL(img)
        setCheckdulieuHinh(true)
        setCheckHinh(false);
    }

    const onChangeInputSL = (event, setState) => {
        let changeValue = event.target.value;
        setState(changeValue);
    }

    const onChangeSelect = (event, setSelect) => {
        let changeValue = event.target.value;
        setSelect(changeValue);
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
    const [checkdulieuTen, SetCheckdulieuTen] = useState(true)
    const [checkdulieuGia, SetCheckdulieuGia] = useState(true)
    const [checkdulieuSoLuong, SetCheckdulieuSoLuong] = useState(true)
    const [checkdulieuMoTa, SetCheckdulieuMoTa] = useState(true)
    const [checkdulieuLSPCha, SetCheckdulieuLSPCha] = useState(true)
    const [checkdulieuLSPCon, SetCheckdulieuLSPCon] = useState(true)
    const [checkdulieuHinh, setCheckdulieuHinh] = useState(false)
    const checkdulieu = (value, SetDuLieu) => {
        (value === '' || value === 'Chọn') ? SetDuLieu(false) : SetDuLieu(true)
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
                            <Link>Sản phẩm</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link className="active" >{maSP}</Link>
                        </li>
                    </ul>
                </div>

            </div>


            <form className="form-edit">
                <div className="container-edit">
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label className="inputSP" htmlFor="inputTenSP">Tên sản phẩm</label>
                            <input type="text" className="form-control" id="inputTenGV" placeholder="Điền tên sản phẩm ..." value={tenSP} onChange={(event) => onChangeInputSL(event, SetTenSP)} onBlur={() => checkdulieu(tenSP, SetCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputSP" htmlFor="inputLSPCha">Loại sản phẩm cha</label>
                            <select value={lspcha} onChange={(event) => onChangeSelect(event, SetLSPCha)} id="inputLSPCha" className="form-control" onClick={() => getListCategoryChild(lspcha)}>
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
                            <label className="inputSP" htmlFor="inputLSPCon">Loại sản phẩm con</label>
                            <select value={lspcon} onChange={(event) => onChangeSelect(event, SetLSPCha)} id="inputLSPCon" className="form-control">
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
                        <div className="form-group col-md-4">
                            <button className="btn btn-primary btn-sm" type="button" onClick={() => handleEditProduct()}>Cập nhật</button>
                        </div>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group col-md-7">
                            <div className="custom-file">
                                <label className="inputKL" htmlFor="inputHinh">Hình ảnh</label>
                                <input type="file" accept="image/*" className="form-control file" id="inputHinh" onChange={(event) => onChangeFile(event, setHinh)} />
                            </div>
                            <div className="invalid-feedback" style={{ display: 'block', color: 'blue' }}>Chỉ chấp nhận các file có đuôi là png, jpeg, jpg ...</div>
                        </div>
                        <img className="img-preview" src={Hinh} style={{ display: checkHinh ? 'block' : 'none' }} />
                        <img className="img-preview" src={Hinh.preview} style={{ display: checkdulieuHinh ? 'block' : 'none' }} />
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <button className="btn btn-primary btn-sm" type="button" onClick={() => handleEditImageProduct()}>Cập nhật hình mới</button>
                        </div>
                    </div>
                    
                </div>



            </form>



        </main >
    )
}
export default EditProduct