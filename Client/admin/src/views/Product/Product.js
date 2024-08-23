
import "./Product.scss"
import TableProduct from "./TableProduct";
import { Link } from "react-router-dom";
import { useState } from 'react';
const Product = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    return (
        <>
            <main className="main2">
                {/* <HeaderMain title={'Chuyên ngành'} /> */}
                <div className="head-title">
                    <div className="left">
                        <h1>SẢN PHẨM</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Sản phẩm</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/product/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>
                <TableProduct accessToken={accessToken} />

            </main >
        </>
    )
}
export default Product;