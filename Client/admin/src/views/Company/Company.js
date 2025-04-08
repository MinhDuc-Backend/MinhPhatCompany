import { Link } from "react-router-dom";
import TableCompany from "./TableCompany";
import { useState } from 'react';
const Company = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    return (
        <>
            <main className="main2">
                {/* <HeaderMain title={'Chuyên ngành'} /> */}
                <div className="head-title">
                    <div className="left">
                        <h1>CÔNG TY</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Công ty</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/Company/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>
                <TableCompany accessToken={accessToken} />

            </main >
        </>
    )
}
export default Company;