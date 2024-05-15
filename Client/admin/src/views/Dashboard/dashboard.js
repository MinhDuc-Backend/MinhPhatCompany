import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import logo from "../logomp.jpg";

const Dashboard = (props) => {
    const { hiddenDB } = props;
    let navigate = useNavigate();
    const LogOut = () => {
        window.localStorage.clear();
        navigate("/")
    }
    const [catalog, setCatalog] = useState([]);
    useEffect(() => {
        // let listdata_chucnang = JSON.parse(localStorage.getItem("listChucNang"))
        let listdata_chucnang = [
            { MaCN: "SP", TenChucNang: "Sản phẩm", Hinh: logo},
            { MaCN: "NV", TenChucNang: "Nhân viên", Hinh: logo},
            { MaCN: "chucnang", TenChucNang: "Chức năng", Hinh: logo}
        ]
        setCatalog(listdata_chucnang)
    }, [])

    return (
        < section id="sidebar" className={hiddenDB ? "hide" : ""} >
            <a className="brand">
                <img src={logo} />
            </a>
            <ul className="side-menu top">
                <li  >
                    <NavLink to={"/"} className={({ isActive }) => isActive ? "active" : ''}>
                        {/* <i className={item.img}></i> */}
                        <img style={{ objectFit: 'cover', height: '20px', width: '20px', marginRight: '10px', marginLeft: '10px' }} src={logo} />
                        <span className="text">Dashboard</span>
                    </NavLink>
                </li>
                {catalog && catalog.length > 0 && catalog.map((item, index) => {
                    return (
                        <li key={item.MaCN} >
                            <NavLink to={"/" + item.MaCN} className={({ isActive }) => isActive ? "active" : ''}>
                                <img style={{ objectFit: 'cover', height: '20px', width: '20px', marginRight: '10px', marginLeft: '10px' }} src={item.Hinh} />
                                <span className="text">{item.TenChucNang}</span>
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
            <ul className="side-menu" style={{ borderTop: 'solid 2px black' }}>
                <li onClick={() => LogOut()}>
                    <a href="#" className="logout">
                        <i className='bx bx-log-out'></i>
                        <span className="text">Đăng xuất</span>
                    </a>
                </li>
            </ul>
        </ section >

    )
}

export default Dashboard