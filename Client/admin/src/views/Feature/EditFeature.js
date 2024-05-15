
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from 'react';
import { fetchDetailChucNang, fetchEditChucNang } from "./APIFeature"
import { toast } from "react-toastify";
const EditFeature = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const chucnang = useParams();
    let navigate = useNavigate();
    const [MaCN, setMaCN] = useState("")
    const [TenChucNang, setTenChucNang] = useState("")
    const [Hinh, setHinh] = useState("")

    const [loadingAPI, setLoadingAPI] = useState(false)

    useEffect(() => {
        getDetailChucNang();

    }, []);
    const getDetailChucNang = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailChucNang(headers, chucnang.MaCN);
        if (res && res.data) {
            setMaCN(res.data.MaCN)
            setTenChucNang(res.data.TenChucNang)
            setHinh(res.data.Hinh)
        }
    }
    const handleEditChucNang = async () => {
        // console.log(Hinh)
        const headers = { 'x-access-token': accessToken };
        if (!TenChucNang) {
            toast.error("Vui lòng điền đầy đủ dữ liệu !")
            return
        }
        let value_img = new FormData();
        // value_img.TenChucNang = TenChucNang;
        value_img.append("MaCN", MaCN);
        value_img.append("TenChucNang", TenChucNang);
        value_img.append("Hinh", Hinh);
        setLoadingAPI(true);
        let res = await fetchEditChucNang(headers, MaCN, value_img)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/chucnang")
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;
        }
        setLoadingAPI(false)
    }
    const onChangeFile = (event, setSL) => {
        const img = event.target.files[0];
        img.preview = URL.createObjectURL(img)
        setSL(img)
    }

    const onChangeInputSL = (event, setSL) => {
        let changeValue = event.target.value;
        setSL(changeValue);
    }

    // check dữ liệu
    const [checkdulieuMa, setCheckdulieuMa] = useState(true)
    const [checkdulieuTen, setCheckdulieuTen] = useState(true)
    const [checkdulieuHinh, setCheckdulieuHinh] = useState(true)
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
                            <Link>Chức năng</Link>
                        </li>
                        <li><i className='bx bx-chevron-right'></i></li>
                        <li>
                            <Link className="active" >{chucnang.MaCN}</Link>
                        </li>
                    </ul>
                </div>

            </div>


            <form className="form-edit">
                <div className="container-edit">
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputMa">Mã chức năng</label>
                            <input type="text" className="form-control" id="inputMa" value={MaCN} disabled={true} />
                            <div className="invalid-feedback" style={{ display: checkdulieuMa ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                        <div className="form-group col-md-6">
                            <label className="inputNganh" htmlFor="inputTen">Tên chức năng</label>
                            <input type="text" className="form-control" id="inputTen" value={TenChucNang} onChange={(event) => onChangeInputSL(event, setTenChucNang)} onBlur={() => checkdulieu(TenChucNang, setCheckdulieuTen)} />
                            <div className="invalid-feedback" style={{ display: checkdulieuTen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-7">
                            <div className="custom-file">
                                <label className="inputKL" htmlFor="inputDSDT">Icon chức năng  <a href="https://boxicons.com/" target="_blank" rel="noopener" style={{ fontWeight: '400' }}>(Link lấy icon)</a></label>
                                <input type="file" accept=".png" className="form-control file" id="inputDSDT" onChange={(event) => onChangeFile(event, setHinh)} onBlur={() => checkdulieu(Hinh, setCheckdulieuHinh)} />
                            </div>
                            <div className="invalid-feedback" style={{ display: checkdulieuHinh ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            <div className="invalid-feedback" style={{ display: 'block', color: 'blue' }}>Chỉ chấp nhận các file có đuôi là png, ...</div>
                        </div>
                        {Hinh ? <img className="img-preview" src={Hinh.preview} /> : ""}
                    </div>


                    <button className="btn" type="button" onClick={() => handleEditChucNang()}>{loadingAPI ? "Đang lưu ..." : "Lưu"}</button>
                </div>



            </form>



        </main >
    )
}
export default EditFeature;