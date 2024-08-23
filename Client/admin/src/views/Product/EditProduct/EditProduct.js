import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import "./EditGiangVien.scss"
import { fetchAllChuyenNganh, fetchDetailGiangVien, fetchEditGiangVien } from "../../GetData"
import { toast } from "react-toastify";
import moment from "moment";

const EditGiangVien = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const giangvien = useParams();
    const [listChuyenNganh, setListChuyenNganh] = useState([]);
    const [magv, setMagv] = useState("")
    const [hogv, setHogv] = useState("")
    const [tengv, setTengv] = useState("")
    const [email, setEmail] = useState("")
    const [sdt, setSdt] = useState("")
    const [gioitinh, setGioitinh] = useState("")
    const [ngaysinh, setNgaysinh] = useState("")
    const [donvicongtac, setDonvicongtac] = useState("")
    const [chuyennganh, setChuyennganh] = useState("")
    const [trinhdo, setTrinhdo] = useState("")
    const [giangvienEdit, setGiangvienEdit] = useState({ MaGV: "", HoGV: "", TenGV: "", Email: "", SoDienThoai: "", GioiTinh: "", NgaySinh: "", DonViCongTac: "", ChuyenNganh: "", TrinhDo: "" });
    const [Hinh, setHinh] = useState("")
    // component didmount
    useEffect(() => {
        getListChuyenNganh();
        getDetailGiangVien();
    }, []);
    const getListChuyenNganh = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllChuyenNganh(headers);
        if (res && res.data && res.data.DanhSach) {
            setListChuyenNganh(res.data.DanhSach)
        }
    }

    const getDetailGiangVien = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailGiangVien(headers, giangvien.MaGV);
        if (res && res.data) {
            setMagv(res.data.MaGV)
            setHogv(res.data.HoGV)
            setTengv(res.data.TenGV)
            setEmail(res.data.Email)
            setSdt(res.data.SoDienThoai)
            setGioitinh(res.data.GioiTinh)
            setNgaysinh(moment(res.data.NgaySinh).format("YYYY-MM-DD"))
            setDonvicongtac(res.data.DonViCongTac)
            setChuyennganh(res.data.ChuyenNganh)
            setTrinhdo(res.data.TrinhDo)
            setHinh(res.data.Hinh)
        }
    }
    const handleEditGiangVien = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !magv || !hogv || !tengv || !email || !sdt || !gioitinh || !ngaysinh || !donvicongtac || !chuyennganh || !trinhdo) {
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

        let res = await fetchEditGiangVien(headers, magv, value_giangvien)
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

    const onChangeFile = (event, setSL) => {
        const img = event.target.files[0];
        img.preview = URL.createObjectURL(img)
        setSL(img)
    }

    const onChangeInputSL = (event, setState) => {
        let changeValue = event.target.value;
        setState(changeValue);
    }

    const onChangeSelect = (event, setSelect) => {
        let changeValue = event.target.value;
        setSelect(changeValue);
    }

    // check dữ liệu
    const [checkdulieuHo, setCheckdulieuHo] = useState(true)
    const [checkdulieuTen, setCheckdulieuTen] = useState(true)
    const [checkdulieuEmail, setCheckdulieuEmail] = useState(true)
    const [checkdulieuSDT, setCheckdulieuSDT] = useState(true)
    const [checkdulieuDVCT, setCheckdulieuDVCT] = useState(true)
    const [checkdulieuTrinhDo, setCheckdulieuTrinhDo] = useState(true)
    const checkdulieu = (value, setDuLieu) => {
        value === '' ? setDuLieu(false) : setDuLieu(true)
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
                            <Link>Giảng viên</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link className="active" >{magv}</Link>
                        </li>
                    </ul>
                </div>

            </div>


            <form className="form-edit">
                <div className="container-edit">
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputHoGV">Họ lót</label>
                            <input type="text" className="form-control" id="inputHoGV" value={hogv} onChange={(event) => onChangeInputSL(event, setHogv)} onBlur={() => checkdulieu(hogv, setCheckdulieuHo)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuHo ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputTenGV">Tên</label>
                            <input type="text" className="form-control" id="inputTenGV" value={tengv} onChange={(event) => onChangeInputSL(event, setTengv)} onBlur={() => checkdulieu(tengv, setCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputEmailGV">Email</label>
                            <input type="text" className="form-control" id="inputEmailGV" value={email} onChange={(event) => onChangeInputSL(event, setEmail)} onBlur={() => checkdulieu(email, setCheckdulieuEmail)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuEmail ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputSdtGV">Số điện thoại</label>
                            <input type="text" className="form-control" id="inputSdtGV" value={sdt} onChange={(event) => onChangeInputSL(event, setSdt)} onBlur={() => checkdulieu(sdt, setCheckdulieuSDT)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuSDT ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputGioitinhGV">Giới tính</label>
                            <select value={gioitinh} onChange={(event) => onChangeSelect(event, setGioitinh)} id="inputGioitinhGV" className="form-control">
                                <option value='Nam'>Nam</option>
                                <option value='Nữ'>Nữ</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputNgaysinh">Ngày sinh</label>
                            <input type="date" className="form-control" id="inputNgaysinh" value={ngaysinh} onChange={(event) => onChangeInputSL(event, setNgaysinh)} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputDonviCT">Đơn vị công tác</label>
                            <input type="text" className="form-control" id="inputDonviCT" value={donvicongtac} onChange={(event) => onChangeInputSL(event, setDonvicongtac)} onBlur={() => checkdulieu(donvicongtac, setCheckdulieuDVCT)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuDVCT ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputGV" htmlFor="inputChuyennganh">Chuyên ngành</label>
                            <select value={chuyennganh} onChange={(event) => onChangeSelect(event, setChuyennganh)} id="inputChuyennganh" className="form-control">
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
                            <input type="text" className="form-control" id="inputTrinhdo" value={trinhdo} onChange={(event) => onChangeInputSL(event, setTrinhdo)} onBlur={() => checkdulieu(trinhdo, setCheckdulieuTrinhDo)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTrinhDo ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>

                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-7">
                            <div className="custom-file">
                                <label className="inputKL" htmlFor="inputDSDT">Hình ảnh</label>
                                <input type="file" accept="image/*" className="form-control file" id="inputDSDT" onChange={(event) => onChangeFile(event, setHinh)} />
                            </div>
                            <div className="invalid-feedback" style={{ display: 'block', color: 'blue' }}>Chỉ chấp nhận các file có đuôi là png, jpeg, jpg ...</div>
                        </div>
                        {Hinh ? <img className="img-preview" src={Hinh.preview} /> : ""}
                    </div>
                    <button className="btn" type="button" onClick={() => handleEditGiangVien()}>Lưu</button>
                </div>



            </form>



        </main >
    )
}
export default EditGiangVien