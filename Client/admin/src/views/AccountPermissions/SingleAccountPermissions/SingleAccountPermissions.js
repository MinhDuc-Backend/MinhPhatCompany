
import "./SingleAccountPermissions.scss"
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { fetchDetailQuyenTK, fetchAllChucNang } from "../../GetAPI"

const SingleQuyenTaiKhoan = () => {
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    const quyenTK = useParams();
    const [maquyen, setMaquyen] = useState("")
    const [tenquyen, setTenquyen] = useState("")
    const [listchucnangTK, setListchucnangTK] = useState([]);
    const [listchucnang, setListchucnang] = useState([]);

    const getListChucNang = useCallback(async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllChucNang(headers);
        if (res && res.data && res.data.DanhSach) {
            setListchucnang(res.data.DanhSach)
        }
    }, [accessToken]);

    const getDetailQuyenTK = useCallback(async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDetailQuyenTK(headers, quyenTK.MaQTK);
        if (res && res.data) {
            setMaquyen(res.data.MaQTK)
            setTenquyen(res.data.TenQuyenTK)
            setListchucnangTK(res.data.ChucNang)
        }
    }, [accessToken, quyenTK.MaQTK]);

    const getCheckChucNang = (item) => {
        const check = listchucnangTK.filter(item2 => item2.MaCN.MaCN === item.MaCN).length;
        return check
    }

    useEffect(() => {
        getListChucNang();
        getDetailQuyenTK();
    }, [getListChucNang, getDetailQuyenTK]);
    
    return (
        <>
            <main className="main2">
                <div className="head-title">
                    <div className="left">
                        <h1>THÔNG TIN CHI TIẾT</h1>
                        <ul className="breadcrumb">
                            <li>
                                <Link>Dashboard</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >Quyền tài khoản</Link>
                            </li>
                            <li><i className='bx bx-chevron-right'></i></li>
                            <li>
                                <Link className="active" >{quyenTK.MaQTK}</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <form className="form-new">
                    <div className="container-edit">
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label className="inputTK" htmlFor="inputMaQuyen">Mã quyền</label>
                                <input type="text" className="form-control" id="inputTenDN" value={maquyen} disabled />
                            </div>
                            <div className="form-group col-md-6">
                                <label className="inputTK" htmlFor="inputTenQuyen">Tên Quyền</label>
                                <input type="text" className="form-control" id="inputTenDN" value={tenquyen} disabled />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                                <label className="inputTK" htmlFor="inputTenGV">Danh sách chức năng </label>
                            </div>
                        </div>
                        <div className="form-row">
                            {listchucnang && listchucnang.length > 0 &&
                                listchucnang.map((item, index) => {
                                    return (
                                        <div key={item.MaCN} className="form-group col-md-3">
                                            <div className="form-check form-check-inline" key={item.MaCN}>
                                                <input className="form-check-input checkmark" type="checkbox" id="inlineCheckbox1" value={item.MaCN} checked={getCheckChucNang(item) === 1 ? true : false} readOnly />
                                                <label className="inputTKK" htmlFor="inlineCheckbox1">{item.TenChucNang}</label>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </form>


            </main >
        </>
    )
}
export default SingleQuyenTaiKhoan;