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
import TaiKhoan from "./Account/Account";
import AddTaiKhoan from "./Account/AddAccount/AddAccount";
import EditTaiKhoan from "./Account/EditAccount/EditAccount";
import QuyenTaiKhoan from "./AccountPermissions/AccountPermissions"
import AddQuyenTaiKhoan from "./AccountPermissions/AddAccountPermissions/AddAccountPermissions";
import EditQuyenTaiKhoan from "./AccountPermissions/EditAccountPermissions/EditAccountPermissions";
import SingleQuyenTaiKhoan from "./AccountPermissions/SingleAccountPermissions/SingleAccountPermissions";
import Company from "./Company/Company";
import AddCompany from "./Company/AddCompany/AddCompany";
import EditCompany from "./Company/EditCompany/EditCompany";
import Customer from "./Customer/Customer";
import AddCustomer from "./Customer/AddCustomer/AddCustomer";
import EditCustomer from "./Customer/EditCustomer/EditCustomer";
import Staff from "./Staff/Staff";
import AddStaff from "./Staff/AddStaff/AddStaff";
import EditStaff from "./Staff/EditStaff/EditStaff";
import Quotation from "./Quotation/Quotation";
import AddQuotation from "./Quotation/AddQuotation/AddQuotation";
import SingleQuotation from "./Quotation/DetailQuotation/DetailQuotation";
import EditQuotation from "./Quotation/EditQuotation/EditQuotation";

const AdminPage = () => {
    const [hiddenDB, setHiddenDB] = useState(true);
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
                <Dashboard hiddenDB={hiddenDB} changleHidden={changleHidden} />
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
                        <Route path='Account'  >
                            <Route index element={<TaiKhoan />}></Route>
                            <Route path="new" element={<AddTaiKhoan />} ></Route>
                            <Route path="edit/:MaTK" element={<EditTaiKhoan />} ></Route>
                        </Route>
                        <Route path='AccountPermissions'  >
                            <Route index element={<QuyenTaiKhoan />}></Route>
                            <Route path="new" element={<AddQuyenTaiKhoan />} ></Route>
                            <Route path="single/:MaQTK" element={<SingleQuyenTaiKhoan />} ></Route>
                            <Route path="edit/:MaQTK" element={<EditQuyenTaiKhoan />} ></Route>
                        </Route>
                        <Route path='Company'  >
                            <Route index element={<Company />}></Route>
                            <Route path="new" element={<AddCompany />} ></Route>
                            <Route path="edit/:MaCongTy" element={<EditCompany />} ></Route>
                        </Route>
                        <Route path='Customer'  >
                            <Route index element={<Customer />}></Route>
                            <Route path="new" element={<AddCustomer />} ></Route>
                            <Route path="edit/:MaKH" element={<EditCustomer />} ></Route>
                        </Route>
                        <Route path='Staff'  >
                            <Route index element={<Staff />}></Route>
                            <Route path="new" element={<AddStaff />} ></Route>
                            <Route path="edit/:MaNV" element={<EditStaff />} ></Route>
                        </Route>
                        <Route path='Quotation'  >
                            <Route index element={<Quotation />}></Route>
                            <Route path="new" element={<AddQuotation />} ></Route>
                            <Route path="single/:MaPBG" element={<SingleQuotation />} ></Route>
                            <Route path="edit/:MaPBG" element={<EditQuotation />} ></Route>
                        </Route>
                    </Routes >
                </section>
            </div >
        </>

    )
}

export default AdminPage