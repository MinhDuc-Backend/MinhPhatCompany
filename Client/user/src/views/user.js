import { useState,useEffect } from "react";
import { Routes,Route, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/bootstrap.min.css";
import "../css/font-awesome.min.css";
import "../css/nouislider.min.css";
import "../css/slick-theme.css";
import "../css/slick.css";
import "../css/style.css";
import "../css/styleMP.css";
import "./user.scss"
import Header from "./Header/Header";
import Footer from "./InformationBottom/infor";
import Product from "./Main/Product";

const UserPage = () => {  
    return (
        <>
            <Header />
            <Product />
            <Footer />
        </>
    )
}

export default UserPage