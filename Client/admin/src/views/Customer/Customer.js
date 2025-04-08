import TableCustomer from "./TableCustomer";
import { Link } from "react-router-dom";
import { useState } from 'react';
const Customer = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    return (
        <>
            <main className="main2">
                <div className="head-title">
                    <div className="left">
                        <h1>KHÁCH HÀNG</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Khách hàng</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/Customer/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>
                <TableCustomer accessToken={accessToken} />

            </main >
        </>
    )
}
export default Customer;