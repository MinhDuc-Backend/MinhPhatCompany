
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./EditAccountPermissions.scss"
import { fetchDetailQuyenTK, fetchAllChucNang, fetchEditQuyenTK } from "../../GetAPI"
import { toast } from "react-toastify";
const EditQuyenTaiKhoan = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const quyenTK = useParams();
    const [maquyen, setMaquyen] = useState("")
    const [tenquyen, setTenquyen] = useState("")
    const [listchucnang, setListchucnang] = useState([]);
    const [listchucnangTK, setListchucnangTK] = useState([]);
    const [listmachucnangTK, setListmachucnangTK] = useState([]);

    const [defaultChecked, setDefaultChecked] = useState(false)
    // component didmount
    useEffect(() => {
        getDetailQuyenTK();
        getListChucNang();
    }, []);

    const getListChucNang = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllChucNang(headers);
        if (res && res.data && res.data.DanhSach) {
            setListchucnang(res.data.DanhSach)
        }
    }
    const getDetailQuyenTK = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailQuyenTK(headers, quyenTK.MaQTK);
        // console.log(res)
        if (res && res.data) {
            setMaquyen(res.data.MaQTK)
            setTenquyen(res.data.TenQuyenTK)
            let list = []
            res.data.ChucNang.map((item, index) => {
                list = [...list, item.MaCN]
            })
            setListchucnangTK(list)
            let current = [];
            res.data.ChucNang.map((item, index) => {
                current = [...current, item.MaCN.MaCN]
            })
            setListmachucnangTK(current)
        }
    }
    const handleEditQuyenTK = async () => {
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
        if (!headers || !tenquyen) {
            toast.error("Vui lòng nhập đầy đủ dữ liệu !")
            return
        }
        let res = await fetchEditQuyenTK(headers, quyenTK.MaQTK, tenquyen, maCN)
        if (res.status === true) {
            toast.success(res.message)
            navigate(`/admin/AccountPermissions/single/${quyenTK.MaQTK}`)
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;

        }
        // console.log("MaCN: ", maCN)
        // console.log("ChucNangCon: ", ChucNangCon)
    }

    const onChangeInputSL = (event, SetState) => {
        let changeValue = event.target.value;
        SetState(changeValue);
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

    // check dữ liệu
    const [checkdulieuMaQuyen, SetCheckdulieuMaQuyen] = useState(true)
    const [checkdulieuTenQuyen, SetCheckdulieuTenQuyen] = useState(true)
    const checkdulieu = (value, SetDuLieu) => {
        value === '' ? SetDuLieu(false) : SetDuLieu(true)
    }

    return (
        <>
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
                                <Link className="active" >Quyền tài khoản</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >{quyenTK.MaQTK}</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <form className="form-new">
                    <div className="container-edit">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label className="inputTK" htmlFor="inputMaQuyen">Mã quyền</label>
                                <input type="text" className="form-control" id="inputTenDN" value={maquyen} disabled={true} />
                                <div className="invalid-feedback" style={{ display: checkdulieuMaQuyen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                            <div className="form-group col-md-6">
                                <label className="inputTK" htmlFor="inputTenQuyen">Tên quyền</label>
                                <input type="text" className="form-control" id="inputTenDN" value={tenquyen} onChange={(event) => onChangeInputSL(event, setTenquyen)} onBlur={() => checkdulieu(tenquyen, SetCheckdulieuTenQuyen)} />
                                <div className="invalid-feedback" style={{ display: checkdulieuTenQuyen ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label className="inputTK" htmlFor="inputTenGV">Danh sách chức năng của tài khoản</label>
                            </div>
                        </div>
                        <div className="form-row">
                            {/* chạy map */}
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
                                <div><button className="btn" type="button" onClick={() => handleEditQuyenTK()}>Lưu dữ liệu</button></div>
                            </div>
                        </div>
                        
                    </div>
                </form>


            </main >
        </>
    )
}
export default EditQuyenTaiKhoan;