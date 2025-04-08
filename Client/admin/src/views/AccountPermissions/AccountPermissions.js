
import { Link } from "react-router-dom";
import TableQuyenTaiKhoan from "./TableAccountPermissions";
import { useState } from 'react';

const QuyenTaiKhoan = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    return (
        <>
            <main className="main2">
                {/* <HeaderMain title={'Chuyên ngành'} /> */}
                <div className="head-title">
                    <div className="left">
                        <h1>QUYỀN TÀI KHOẢN</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Quyền tài khoản</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/AccountPermissions/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>
                <TableQuyenTaiKhoan accessToken={accessToken} />

            </main >
        </>
    )
}
export default QuyenTaiKhoan;