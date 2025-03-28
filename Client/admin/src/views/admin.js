import { useState,useEffect } from "react";
import { Routes,Route, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/bootstrap.min.css";
import "./Admin.scss"
import { fetchVerifyToken } from "./GetAPI"
import Dashboard from "./Dashboard/dashboard";
import Nav from "./Nav/nav";
import Tongquan from "./Tongquan/Tongquan";
import FeaTure from "./Feature/FeaTure";
import AddFeature from "./Feature/AddFeature";
import EditFeature from "./Feature/EditFeature"
import CategoryFather from "./CategoryFather/CategoryFather";
import AddCategoryFather from "./CategoryFather/AddCategoryFather/AddCategoryFather"
import DetailCategoryFather from "./CategoryFather/DetailCategoryFather/DetailCategoryFather"
import EditCategoryFather from "./CategoryFather/EditCategoryFather/EditCategoryFather"
import Product from "./Product/Product";
import AddProduct from "./Product/AddProduct/AddProduct";
import EditProduct from "./Product/EditProduct/EditProduct";
import CategoryChild from "./CategoryChild/CategoryChild";
import AddCategoryChild from "./CategoryChild/AddCategoryChild/AddCategoryChild"
import EditCategoryChild from "./CategoryChild/EditCategoryChild/EditCategoryChild"

const AdminPage = () => {
    const [hiddenDB, setHiddenDB] = useState(false);
    const [switchmode, setSwitchmode] = useState(false);
    useEffect(() => {
        GetToken()
    }, [])
    const changleHidden = () => {
        setHiddenDB(!hiddenDB);
    }
    const changleSwitchMode = () => {
        setSwitchmode(!switchmode);
    }
    let navigate = useNavigate();
    const GetToken = async () => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/")
            return
        }
        let token = localStorage.getItem("accessToken");
        const headers = { 'x-access-token': token };
        let res = await fetchVerifyToken(headers);
        if (res.status == false) {
            toast.error(res.message)
            window.localStorage.clear();
            navigate("/")
            return
        }
        navigate("/admin/Dashboard")
        return
    }
    
    return (
        <>
            <div className={switchmode ? "dark" : ""}>
                <Dashboard hiddenDB={hiddenDB} />
                <section id="content">
                    <Nav changleHidden={changleHidden} changleSwitchMode={changleSwitchMode} />
                    <Routes >
                        <Route path="Dashboard" index element={<Tongquan />}></Route>
                        <Route path='chucnang'>
                            <Route index element={<FeaTure />}></Route>
                            <Route path="new" element={<AddFeature />} ></Route>
                            <Route path="edit/:MaCN" element={<EditFeature />} ></Route>
                        </Route>
                        <Route path='CategoryFather'  >
                            <Route index element={<CategoryFather />}></Route>
                            <Route path="new" element={<AddCategoryFather />} ></Route>
                            <Route path="single/:MaLSPCha" element={<DetailCategoryFather />} ></Route>
                            <Route path="edit/:MaLSPCha" element={<EditCategoryFather />} ></Route>
                        </Route>
                        <Route path='product'  >
                            <Route index element={<Product />}></Route>
                            <Route path="new" element={<AddProduct />} ></Route>
                            <Route path="edit/:MaSP" element={<EditProduct />} ></Route>
                        </Route>
                        <Route path='CategoryChild'  >
                            <Route index element={<CategoryChild />}></Route>
                            <Route path="new" element={<AddCategoryChild />} ></Route>
                            <Route path="edit/:MaLSPCon" element={<EditCategoryChild />} ></Route>
                        </Route>
                    </Routes >
                </section>
            </div >
        </>

    )
}

export default AdminPage