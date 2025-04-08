import { Link } from "react-router-dom";
import TableCategoryChild from "./TableCategoryChild";
import { useState } from 'react';
const CategoryChild = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    return (
        <>
            <main className="main2">
                {/* <HeaderMain title={'Chuyên ngành'} /> */}
                <div className="head-title">
                    <div className="left">
                        <h1>LOẠI SẢN PHẨM NHỎ</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Loại sản phẩm nhỏ</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/CategoryChild/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>
                <TableCategoryChild accessToken={accessToken} />

            </main >
        </>
    )
}
export default CategoryChild;