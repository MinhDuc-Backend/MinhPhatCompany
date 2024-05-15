
import { Link } from "react-router-dom";
import TableFeature from "./TableFeature";
import { useState } from "react";

const FeaTure = () => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    return (
        <>
            <main className="main2">
                <div className="head-title">
                    <div className="left">
                        <h1>CHỨC NĂNG</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Chức năng</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/feature/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>
                <TableFeature accessToken={accessToken} />

            </main >
        </>
    )
}
export default FeaTure;