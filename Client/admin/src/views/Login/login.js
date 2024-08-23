import { useState, useEffect } from "react";
import "../../css/bootstrap.min.css";
import "./login.scss";
import logomp from "../logomp.jpg"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchLoginAdmin } from "../GetAPI"

const LoginAdmin = (props) => {
    const { loggedIn, CheckLogin } = props
    const OnCheckLogin = () => {
        CheckLogin();
    }
    const GetToken = () => {
        if (localStorage.getItem("accessToken")) {
            navigate("/admin/*")
            return
        }
    }
    useEffect(() => {
        GetToken()
    }, [])
    let navigate = useNavigate();
    const [TenDangNhap, setTenDangNhap] = useState("");
    const [MatKhau, setMatKhau] = useState("");
    const [list_CN, setList_CN] = useState([]);
    const [loadingAPI, setLoadingAPI] = useState(false);
    const onChangeInputSL = (event, SetState) => {
        let changeValue = event.target.value;
        SetState(changeValue);
    }

    const [checkTenDangNhap, setCheckTenDangNhap] = useState(true)
    const [checkMatKhau, setCheckMatKhau] = useState(true)

    const checkdulieu = (value, SetDuLieu) => {
        value === '' ? SetDuLieu(false) : SetDuLieu(true)
    }

    const handleLogin = async () => {
        if (!TenDangNhap || !MatKhau) {
            toast.error("Dữ liệu điền chưa đủ điều kiện !")
            return
        }
        setLoadingAPI(true);
        let res = await fetchLoginAdmin(TenDangNhap, MatKhau);
        if (res.status) {
            if (res.data && res.data.accessToken) {
                navigate("/admin/Dashboard")
                setList_CN(res.data.QuyenHan.ChucNang)
                localStorage.setItem("accessToken", res.data.accessToken)
                localStorage.setItem("listChucNang", JSON.stringify(res.data.QuyenHan.ChucNang))
            }
            OnCheckLogin();
            toast.success(res.message)
            navigate("/admin/Dashboard")
            return
        }
        if (!res.status) {
            toast.error(res.message)
        }
        setLoadingAPI(false)
    }

    return (
        <div className="container-login">
            <div className="container">
                <div className="row container-form">
                    <div className="col-md-6 col-sm-6">
                        <img src={logomp} className="logo" />
                    </div>
                    <div className="col-md-6 col-sm-6 form">
                        <div className="row info">Tên đăng nhập</div>
                        <div className="row info-form">
                            <input className="form-control" type="text" value={TenDangNhap} placeholder="Điền tài khoản ..." onChange={(event) => onChangeInputSL(event, setTenDangNhap)} onBlur={() => checkdulieu(TenDangNhap, setCheckTenDangNhap)} />
                        </div>
                        <div className="row info">Mật khẩu</div>
                        <div className="row info-form">
                            <input className="form-control" type="password" placeholder="Điền mật khẩu ..." value={MatKhau} onChange={(event) => onChangeInputSL(event, setMatKhau)} onBlur={() => checkdulieu(MatKhau, setCheckMatKhau)} />
                        </div>
                        <div className="row btn-form">
                            <div className="col-md-12 col-sm-12">
                                <button className="btn btn-primary btnlogin" disabled={TenDangNhap && MatKhau ? false : true} onClick={() => handleLogin()}>{loadingAPI ? "Vui lòng đợi..." : "Đăng nhập"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginAdmin