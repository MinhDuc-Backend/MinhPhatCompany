import "./CategoryFather.scss"
import { Link } from "react-router-dom";
import TableCategoryFather from "./TableCategoryFather";
import { useState } from "react";

const CategoryFather = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    // get danh sach nganh
    return (
        <>
            <main className="main2">
                <div className="head-title">
                    <div className="left">
                        <h1>LOẠI SẢN PHẨM</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Loại sản phẩm</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/CategoryFather/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>
                <TableCategoryFather accessToken={accessToken} />

            </main >
        </>
    )
}
export default CategoryFather;