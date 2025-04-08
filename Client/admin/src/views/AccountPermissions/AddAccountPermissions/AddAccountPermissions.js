
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllChucNang, fetchAddQuyenTK } from "../../GetAPI"
import { toast } from "react-toastify";
import "./AddAccountPermissions.scss"
const AddQuyenTaiKhoan = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [MaQuyen, SetMaQuyen] = useState("")
    const [TenQuyen, SetTenQuyen] = useState("")
    const [listchucnang, setListchucnang] = useState([]);
    const [listchucnangTK, setListchucnangTK] = useState([]);
    const [listmachucnangTK, setListmachucnangTK] = useState([]);

    const onChangeInputSL = (event, SetState) => {
        let changeValue = event.target.value;
        SetState(changeValue);
    }

    // check dữ liệu
    const [checkdulieuMaQuyen, SetCheckdulieuMaQuyen] = useState(true)
    const [checkdulieuTenQuyen, SetCheckdulieuTenQuyen] = useState(true)
    const checkdulieu = (value, SetDuLieu) => {
        value === '' ? SetDuLieu(false) : SetDuLieu(true)
    }
    useEffect(() => {
        getListChucNang();
    }, []);
    const getListChucNang = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllChucNang(headers);
        if (res && res.data && res.data.DanhSach) {
            setListchucnang(res.data.DanhSach)
        }
    }
    const onChangeChucNang = (item2) => {
        let current = listchucnangTK;
        let current_ma = listmachucnangTK;
        let check = current.filter(item => item.MaCN === item2.MaCN).length;
        if (check === 1) {
            current = current.filter(item => item.MaCN !== item2.MaCN)
            current_ma = current_ma.filter(item => item !== item2.MaCN)
            setListchucnangTK(current)
            setListmachucnangTK(current_ma)
            return
        }
        if (check === 0) {
            current = [...current, item2]
            current_ma = [...current_ma, item2.MaCN]
            setListchucnangTK(current)
            setListmachucnangTK(current_ma)
            return
        }
    }
    const handleAddQuyenTK = async () => {
        const headers = { 'x-access-token': accessToken };
        let maCN = "";
        let ChucNangCon = "";
        listmachucnangTK.map((item, index) => {
            if (index === 0) {
                maCN = maCN + item
            }
            else {
                maCN = maCN + ";" + item
            }
        })
        if (!headers || !MaQuyen || !TenQuyen) {
            toast.error("Vui lòng nhập đầy đủ dữ liệu !")
            return
        }
        // console.log("MaCN: ", maCN)
        // console.log("ChucNangCon: ", ChucNangCon)
        let res = await fetchAddQuyenTK(headers, MaQuyen, TenQuyen, maCN)
        if (res.status === true) {
            toast.success(res.message)
            navigate(`/admin/AccountPermissions`)
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;

        }

    }
    return (
        <>
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
                                <Link className="active" >Quyền tài khoản</Link>
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
                            <div className="form-group col-md-6">
                                <label className="inputTK" for="inputTenDN">Mã quyền</label>
                                <input type="text" className="form-control" id="inputTenDN" placeholder="Điền mã quyền ..." value={MaQuyen} onChange={(event) => onChangeInputSL(event, SetMaQuyen)} onBlur={() => checkdulieu(MaQuyen, SetCheckdulieuMaQuyen)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuMaQuyen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label className="inputTK" for="inputTenGV">Tên quyền</label>
                                <input type="text" className="form-control" id="inputTenDN" placeholder="Điền tên quyền ..." value={TenQuyen} onChange={(event) => onChangeInputSL(event, SetTenQuyen)} onBlur={() => checkdulieu(TenQuyen, SetCheckdulieuTenQuyen)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuTenQuyen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label className="inputTK" for="inputTenGV">Danh sách chức năng</label>
                            </div>
                        </div>
                        <div className="form-row">
                            {
                                listchucnang && listchucnang.length > 0 &&
                                listchucnang.map((item, index) => {
                                    return (
                                        <div key={item.MaCN} className="form-group col-md-3">
                                            <div className="form-check form-check-inline" key={item.MaCN}>
                                                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value={item.MaCN} checked={listmachucnangTK.filter(item2 => item2 === item.MaCN).length > 0 ? true : false} onChange={(event) => onChangeChucNang(item)} />
                                                <label className="inputTKK label-TCN" htmlFor="inlineCheckbox1">{item.TenChucNang}</label>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="form-row" >
                            <div className="form-group col-md-12 formbtn">
                                <div><button className="btn" type="button" onClick={() => handleAddQuyenTK()}>Lưu dữ liệu</button></div>
                            </div>
                        </div>
                    </div>
                </form>


            </main >
        </>
    )
}
export default AddQuyenTaiKhoan;