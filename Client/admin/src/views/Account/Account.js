

import { Link } from "react-router-dom";
import TableTaiKhoan from "./TableAccount";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';

const TaiKhoan = () => {
    const [value, setValue] = useState('dstk');
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <main className="main2">
                {/* <HeaderMain title={'Chuyên ngành'} /> */}
                <div className="head-title">
                    <div className="left">
                        <h1>TÀI KHOẢN</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Tài khoản</Link>
                            </li>
                        </ul>
                    </div>
                    <Link to={"/admin/Account/new"} className="btn-download">
                        <i className='bx bxs-cloud-download'></i>
                        <span className="text">Tạo mới</span>
                    </Link>
                </div>
                {/* Tab */}
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Danh sách tài khoản" value="dstk" />
                        </TabList>
                    </Box>

                    <TabPanel value="dstk" >
                        <div className="table">
                            <TableTaiKhoan accessToken={accessToken} />
                        </div>
                    </TabPanel>
                </TabContext>

            </main >
        </>
    )
}
export default TaiKhoan;