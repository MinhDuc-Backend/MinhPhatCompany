import "./ChuyenNganh.scss"
import { Link } from "react-router-dom";
import TableChuyenNganh from "./TableChuyenNganh";
import { useState } from 'react';
const ChuyenNganh = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    return (
        <>
            <main className="main2">
                {/* <HeaderMain title={'Chuyên ngành'} /> */}
                <div className="head-title">
                    <div className="left">
                        <h1>CHUYÊN NGÀNH</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Chuyên ngành</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/chuyennganh/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>
                <TableChuyenNganh accessToken={accessToken} />

            </main >
        </>
    )
}
export default ChuyenNganh;