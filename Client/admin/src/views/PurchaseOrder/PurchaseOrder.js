import "./PurchaseOrder.scss"
import "./TablePurchaseOrder"
import { Link } from "react-router-dom";
import TablePurchaseOrder from "./TablePurchaseOrder";
import { useState } from "react";


const PurchaseOrder = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    return (
        <>
            <main className="main2">
                {/* <HeaderMain title={'Chuyên ngành'} /> */}
                <div className="head-title">
                    <div className="left">
                        <h1>ĐƠN ĐẶT HÀNG</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Đơn đặt hàng</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/PurchaseOrder/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>

                {/* <MantineReactTable table={table} />; */}


                <TablePurchaseOrder accessToken={accessToken} />

            </main >
        </>
    )
}
export default PurchaseOrder;