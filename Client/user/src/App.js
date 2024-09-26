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
import UserPage from './views/user'

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
                <Route path='/*' element={ <UserPage /> }></Route>
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
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
