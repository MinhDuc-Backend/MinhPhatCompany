import { useState } from "react";
import { Routes,Route } from "react-router-dom";
import "../css/bootstrap.min.css";
import "./Admin.scss"
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

const AdminPage = () => {
    const [hiddenDB, setHiddenDB] = useState(false);
    const [switchmode, setSwitchmode] = useState(false);
    const changleHidden = () => {
        setHiddenDB(!hiddenDB);
    }
    const changleSwitchMode = () => {
        setSwitchmode(!switchmode);
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
                    </Routes >
                </section>
            </div >
        </>

    )
}

export default AdminPage