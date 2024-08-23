import './App.css';
import './css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BrowserRouter,
    Routes,
    Route,
    useParams,
    Navigate
} from "react-router-dom";
import { useEffect, useState } from "react";
import LoginAdmin from './views/Login/login';
import AdminPage from './views/admin'

function App() {

    const [hiddenDB, setHiddenDB] = useState(false);
    const [switchmode, setSwitchmode] = useState(false);
    const [accessToken, SetAccessToken] = useState("");
    const changleHidden = () => {
        setHiddenDB(!hiddenDB);
    }
    const changleSwitchMode = () => {
        setSwitchmode(!switchmode);
    }

    const [loggedIn, setLoggedIn] = useState();
    const CheckLogin = () => {
        let token = localStorage.getItem("accessToken");
        token ? setLoggedIn(true) : setLoggedIn(false)
    }

    return (
        <BrowserRouter>
            <Routes className="App">
                <Route path='/*' element={<LoginAdmin loggedIn={loggedIn} CheckLogin={() => CheckLogin()} />}></Route>
                <Route path='admin/*' 
                        element={ localStorage.getItem("accessToken") ? <AdminPage /> : <Navigate to="/*" /> } >
                </Route>
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </BrowserRouter>
    );
}

export default App;
