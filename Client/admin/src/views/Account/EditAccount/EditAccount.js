
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDetailTaiKhoan, fetchEditTaiKhoan, fetchAllQuyenTK } from "../../GetAPI"
import { toast } from "react-toastify";
import "./EditAccount.scss"

const EditTaiKhoan = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    const taikhoan = useParams();
    let navigate = useNavigate();
    const [MaTK, setMaTK] = useState("")
    const [TenDangNhap, setTenDangNhap] = useState("")
    const [MatKhau, setMatKhau] = useState("")
    const [QuyenTK, setQuyenTK] = useState("")
    const [listQuyenTK, setListQuyenTK] = useState([]);
    // component didmount
    useEffect(() => {
        getDetailTaiKhoan();
        getListQuyenTK();
    }, []);

    const getDetailTaiKhoan = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailTaiKhoan(headers, taikhoan.MaTK);
        if (res && res.data) {
            setMaTK(res.data.MaTK)
            setTenDangNhap(res.data.TenDangNhap)
            setMatKhau(res.data.MatKhau)
            setQuyenTK(res.data.MaQTK.MaQTK)
        }
    }
    const getListQuyenTK = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllQuyenTK(headers);
        if (res && res.data && res.data.DanhSach) {
            setListQuyenTK(res.data.DanhSach)
        }
    }

    const handleEditTaiKhoan = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!TenDangNhap || !QuyenTK) {
            toast.error("Vui lòng điền đầy đủ dữ liệu !")
            return
        }
        let res = await fetchEditTaiKhoan(headers, MaTK, QuyenTK)
        if (res.status === true) {
            toast.success(res.message)
            navigate("/admin/Account")
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;
        }
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
    const [checkdulieuTenDN, setCheckdulieuTenDN] = useState(true)
    const [checkdulieuMatKhau, setCheckdulieuMatKhau] = useState(true)
    const checkdulieu = (value, setDuLieu) => {
        value === '' ? setDuLieu(false) : setDuLieu(true)
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
                                <Link className="active" >Tài khoản</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >{taikhoan.MaTK}</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <form className="form-new">
                    <div className="container-edit">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label className="inputTK" htmlFor="inputTenDN">Tên đăng nhập</label>
                                <input type="text" className="form-control" id="inputTenDN" value={TenDangNhap} onChange={(event) => onChangeInputSL(event, setTenDangNhap)} onBlur={() => checkdulieu(TenDangNhap, setCheckdulieuTenDN)} disabled={true} />
                                <div className="invalid-feedback" style={{ display: checkdulieuTenDN ? 'none' : 'block' }}>Vui lòng điền vào ô dữ liệu </div>
                            </div>
                        </div>
                        <div className="form-row" >
                            <div className="form-group col-md-12">
                                <label className="inputDT" htmlFor="inputTrangthai">Quyền tài khoản </label>
                                <select value={QuyenTK} id="inputTrangthai" className="form-control" onChange={(event) => onChangeSelect(event, setQuyenTK)} >
                                    {listQuyenTK && listQuyenTK.length > 0 &&
                                        listQuyenTK.map((item, index) => {
                                            return (
                                                <option value={item.MaQTK} key={item.MaQTK}>{item.TenQuyenTK}</option>
                                            )
                                        })
                                    }

                                </select>
                            </div>
                        </div>
                        <div className="form-row" >
                            <div className="form-group col-md-12 formbtn">
                                <div><button className="btn" type="button" style={{ marginTop: '2rem' }} onClick={() => handleEditTaiKhoan()}>Lưu dữ liệu</button></div>
                            </div>
                        </div>
                    </div>
                </form>


            </main >
        </>
    )
}
export default EditTaiKhoan;