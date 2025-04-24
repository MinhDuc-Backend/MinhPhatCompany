import "./Quotation.scss"
import "./TableQuotation"
import { Link } from "react-router-dom";
import TableQuotation from "./TableQuotation";
import { useState } from "react";


const Quotation = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    return (
        <>
            <main className="main2">
                {/* <HeaderMain title={'Chuyên ngành'} /> */}
                <div className="head-title">
                    <div className="left">
                        <h1>PHIẾU BÁO GIÁ</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Phiếu báo giá</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/Quotation/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>

                {/* <MantineReactTable table={table} />; */}


                <TableQuotation accessToken={accessToken} />

            </main >
        </>
    )
}
export default Quotation;