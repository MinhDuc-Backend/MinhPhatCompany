import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import { fetchAddChucNang } from "./APIFeature"
import { toast } from "react-toastify";
const AddFeature = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [MaCN, SetMaCN] = useState("")
    const [TenChucNang, SetTenChucNang] = useState("")
    const [Hinh, setHinh] = useState("")

    const handleAddChucNang = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!TenChucNang || !Hinh) {
            toast.error("Vui lòng điền đầy đủ dữ liệu !")
            return
        }
        let value_img = new FormData();
        // value_img.TenChucNang = TenChucNang;
        value_img.append("MaCN", MaCN);
        value_img.append("TenChucNang", TenChucNang);
        value_img.append("Hinh", Hinh);
        let res = await fetchAddChucNang(headers, value_img)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/chucnang")
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
                    <h1>TẠO MỚI</h1>
                    <ul className="breadcrumb">
                        <li>
                            <Link>Dashboard</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link>Chức năng</Link>
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
                            <label className="inputNganh" htmlFor="inputMa">Mã chức năng</label>
                            <input type="text" className="form-control" id="inputMa" placeholder="Điền mã chức năng ..." value={MaCN} onChange={(event) => onChangeInputSL(event, SetMaCN)} onBlur={() => checkdulieu(MaCN, SetCheckdulieuMa)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputTen">Tên chức năng</label>
                            <input type="text" className="form-control" id="inputTen" placeholder="Điền tên chức năng ..." value={TenChucNang} onChange={(event) => onChangeInputSL(event, SetTenChucNang)} onBlur={() => checkdulieu(TenChucNang, SetCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <div className="custom-file">
                                <label className="inputKL" htmlFor="inputDSDT">Icon chức năng  <a href="https://boxicons.com/" target="_blank" rel="noopener" style={{ fontWeight: '400' }}>(Link lấy icon)</a></label>
                                <input type="file" accept=".png" className="form-control file" id="inputDSDT" onChange={(event) => onChangeFile(event, setHinh)} />
                            </div>
                            <div className="invalid-feedback" style={{ display: 'block' }}>Chỉ chấp nhận các file có đuôi là png, ...</div>
                        </div>
                    </div>


                    <button className="btn" type="button" onClick={() => handleAddChucNang()}>Lưu</button>
                </div>



            </form>



        </main >
    )
}
export default AddFeature;