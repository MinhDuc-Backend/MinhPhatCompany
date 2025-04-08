import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import logo from "../logomp.jpg";
import dashboard from "./dashboard.png"

const Dashboard = (props) => {
    const { hiddenDB, changleHidden } = props;
    let navigate = useNavigate();
    const LogOut = () => {
        window.localStorage.clear();
        navigate("/")
    }
    const [catalog, setCatalog] = useState([]);
    useEffect(() => {
        let listdata_chucnang = JSON.parse(localStorage.getItem("listChucNang"))
        setCatalog(listdata_chucnang)
    }, [])

    const onChangleHidden = () => {
        changleHidden();
    }

    return (
        < section id="sidebar" className={hiddenDB ? "hide" : ""} >
            <a className="brand">
                <img src={logo} />
            </a>
            <i className='bx bx-menu' id="menuhide" onClick={() => onChangleHidden()} style={{display: hiddenDB ? "none" : "block"}} ></i>
            <ul className="side-menu top">
                <li>
                    <NavLink to={"/admin/Dashboard"} className={({ isActive }) => isActive ? "active" : ''}>
                        <img style={{ objectFit: 'cover', height: '20px', width: '20px', marginRight: '10px', marginLeft: '10px' }} src={dashboard} />
                        <span className="text">Dashboard</span>
                    </NavLink>
                </li>
                {catalog && catalog.length > 0 && catalog.map((item, index) => {
                    return (
                        <li key={item.MaCN.MaCN} >
                            <NavLink to={"/admin/" + item.MaCN.MaCN} className={({ isActive }) => isActive ? "active" : ''}>
                                <img style={{ objectFit: 'cover', height: '25px', width: '25px', marginRight: '10px', marginLeft: '10px' }} src={item.MaCN.Hinh} />
                                <span className="text">{item.MaCN.TenChucNang}</span>
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
            <ul className="side-menu" style={{ borderTop: 'solid 2px black' }}>
                <li onClick={() => LogOut()}>
                    <a href="#" className="logout">
                        <i className='bx bx-log-out' style={{ fontSize: "25px"}}></i>
                        <span className="text">Đăng xuất</span>
                    </a>
                </li>
            </ul>
        </ section >

    )
}

export default Dashboard