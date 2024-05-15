import { useState, useEffect } from "react";
import { Routes,Route,useParams,useNavigate } from "react-router-dom";
import "../css/bootstrap.min.css";
import "./Admin.scss"
import Dashboard from "./Dashboard/dashboard";
import Nav from "./Nav/nav";
import Tongquan from "./Tongquan/Tongquan";
import FeaTure from "./Feature/FeaTure";
import AddFeature from "./Feature/AddFeature";
import EditFeature from "./Feature/EditFeature"

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
                        <Route index element={<Tongquan />}></Route>
                        <Route path='chucnang'>
                            <Route index element={<FeaTure />}></Route>
                            <Route path="new" element={<AddFeature />} ></Route>
                            <Route path="edit/:MaCN" element={<EditFeature />} ></Route>
                        </Route>
                    </Routes >
                </section>
            </div >
        </>

    )
}

export default AdminPage