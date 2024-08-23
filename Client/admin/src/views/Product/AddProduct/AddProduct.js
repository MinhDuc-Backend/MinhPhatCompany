import "./AddGiangVien.scss"
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAddGiangVien, fetchAllChuyenNganh } from "../../GetData"
import * as React from 'react';
import { toast } from "react-toastify";
import moment from "moment";

const AddGiangVien = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [magv, SetMagv] = useState('')
    const [hogv, SetHogv] = useState('')
    const [tengv, SetTengv] = useState('')
    const [email, SetEmail] = useState('')
    const [listChuyenNganh, setListChuyenNganh] = useState([]);
    const [sdt, SetSdt] = useState('')
    const [gioitinh, SetGioitinh] = useState('Nam')
    const [ngaysinh, SetNgaysinh] = useState('1970-01-01')
    const [donvicongtac, SetDonvicongtac] = useState('')
    const [chuyennganh, SetChuyennganh] = useState('httt')
    const [trinhdo, SetTrinhdo] = useState('')
    const [Hinh, setHinh] = useState("")

    // component didmount
    useEffect(() => {
        getListChuyenNganh();
    }, []);

    const getListChuyenNganh = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllChuyenNganh(headers);
        if (res && res.data && res.data.DanhSach) {
            setListChuyenNganh(res.data.DanhSach)
        }
    }

    const handleAddGiangVien = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !magv || !hogv || !tengv || !email || !sdt || !gioitinh || !ngaysinh || !donvicongtac || !chuyennganh || !trinhdo || !Hinh) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        let value_giangvien = new FormData();
        value_giangvien.append("MaGV", magv);
        value_giangvien.append("HoGV", hogv);
        value_giangvien.append("TenGV", tengv);
        value_giangvien.append("Email", email);
        value_giangvien.append("SoDienThoai", sdt);
        value_giangvien.append("GioiTinh", gioitinh);
        const value_ngaysinh = new Date(ngaysinh)
        value_giangvien.append("NgaySinh", value_ngaysinh);
        value_giangvien.append("DonViCongTac", donvicongtac);
        value_giangvien.append("ChuyenNganh", chuyennganh);
        value_giangvien.append("TrinhDo", trinhdo);
        value_giangvien.append("Hinh", Hinh);
        let res = await fetchAddGiangVien(headers, value_giangvien)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/giangvien")
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

    // check dữ liệu
    const [checkdulieuMa, SetCheckdulieuMa] = useState(true)
    const [checkdulieuHo, SetCheckdulieuHo] = useState(true)
    const [checkdulieuTen, SetCheckdulieuTen] = useState(true)
    const [checkdulieuEmail, SetCheckdulieuEmail] = useState(true)
    const [checkdulieuSDT, SetCheckdulieuSDT] = useState(true)
    const [checkdulieuDVCT, SetCheckdulieuDVCT] = useState(true)
    const [checkdulieuTrinhDo, SetCheckdulieuTrinhDo] = useState(true)
    const [checkdulieuHinh, setCheckdulieuHinh] = useState(true)
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
                            <Link>Giảng viên</Link>
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
                        <div className="form-group col-md-2">
                            <label className="inputGV" htmlFor="inputHoGV">Mã Giảng Viên</label>
                            <input type="text" className="form-control" id="inputHoGV" placeholder="Điền mã giảng viên ..." value={magv} onChange={(event) => onChangeInputSL(event, SetMagv)} onBlur={() => checkdulieu(magv, SetCheckdulieuMa)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-4">
                            <label className="inputGV" htmlFor="inputHoGV">Họ lót</label>
                            <input type="text" className="form-control" id="inputHoGV" placeholder="Điền họ lót ..." value={hogv} onChange={(event) => onChangeInputSL(event, SetHogv)} onBlur={() => checkdulieu(hogv, SetCheckdulieuHo)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuHo ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputTenGV">Tên</label>
                            <input type="text" className="form-control" id="inputTenGV" placeholder="Điền tên ..." value={tengv} onChange={(event) => onChangeInputSL(event, SetTengv)} onBlur={() => checkdulieu(tengv, SetCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputEmailGV">Email</label>
                            <input type="text" className="form-control" id="inputEmailGV" placeholder="abc...@gmail.com" value={email} onChange={(event) => onChangeInputSL(event, SetEmail)} onBlur={() => checkdulieu(email, SetCheckdulieuEmail)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuEmail ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputSdtGV">Số điện thoại</label>
                            <input type="text" className="form-control" id="inputSdtGV" placeholder="03899...." value={sdt} onChange={(event) => onChangeInputSL(event, SetSdt)} onBlur={() => checkdulieu(sdt, SetCheckdulieuSDT)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuSDT ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputGioitinhGV">Giới tính</label>
                            <select value={gioitinh} onChange={(event) => onChangeSelect(event, SetGioitinh)} id="inputGioitinhGV" className="form-control">
                                <option value='Nam'>Nam</option>
                                <option value='Nữ'>Nữ</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputNgaysinh">Ngày sinh</label>
                            <input type="date" className="form-control" id="inputNgaysinh" value={ngaysinh} onChange={(event) => onChangeInputSL(event, SetNgaysinh)} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputDonviCT">Đơn vị công tác</label>
                            <input type="text" className="form-control" id="inputDonviCT" placeholder="Điền đơn vị ..." value={donvicongtac} onChange={(event) => onChangeInputSL(event, SetDonvicongtac)} onBlur={() => checkdulieu(donvicongtac, SetCheckdulieuDVCT)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuDVCT ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputChuyennganh">Chuyên ngành</label>
                            <select value={chuyennganh} onChange={(event) => onChangeSelect(event, SetChuyennganh)} id="inputChuyennganh" className="form-control">
                                {listChuyenNganh && listChuyenNganh.length > 0 &&
                                    listChuyenNganh.map((item, index) => {
                                        return (
                                            <option key={item.MaChuyenNganh} value={item.TenChuyenNganh}>{item.TenChuyenNganh}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label className="inputGV" htmlFor="inputTrinhdo">Trình độ</label>
                            <input type="text" className="form-control" id="inputTrinhdo" placeholder="Điền trình độ ..." value={trinhdo} onChange={(event) => onChangeInputSL(event, SetTrinhdo)} onBlur={() => checkdulieu(trinhdo, SetCheckdulieuTrinhDo)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTrinhDo ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>

                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-7">
                            <div className="custom-file">
                                <label className="inputKL" htmlFor="inputDSDT">Hình ảnh</label>
                                <input type="file" accept="image/*" className="form-control file" id="inputDSDT" onChange={(event) => onChangeFile(event, setHinh)} onBlur={() => checkdulieu(Hinh, setCheckdulieuHinh)} />
                            </div>
                            <div className="invalid-feedback" style={{ display: 'block', color: 'blue' }}>Chỉ chấp nhận các file có đuôi là png, jpeg, jpg ...</div>
                            <div className="invalid-feedback" style={{ display: checkdulieuHinh ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>

                        </div>

                        {Hinh ? <img className="img-preview" src={Hinh.preview} /> : ""}

                    </div>

                    <button className="btn" type="button" onClick={() => handleAddGiangVien()}>Lưu</button>
                </div>
            </form>



        </main >
    )
}
export default AddGiangVien