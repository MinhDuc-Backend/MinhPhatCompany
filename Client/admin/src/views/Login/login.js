import { useState, useEffect } from "react";
import "../../css/bootstrap.min.css";
import "./login.scss";
import logomp from "../logomp.jpg"

const LoginAdmin = () => {
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
                            <input className="form-control" type="text" />
                        </div>
                        <div className="row info">Mật khẩu</div>
                        <div className="row info-form">
                            <input className="form-control" type="password" />
                        </div>
                        <div className="row btn-form">
                            <div className="col-md-12 col-sm-12">
                                <button className="btn btn-primary btnlogin">Đăng nhập</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginAdmin