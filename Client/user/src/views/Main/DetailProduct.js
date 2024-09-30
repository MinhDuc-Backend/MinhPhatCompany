import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDetailProductUser } from "../GetAPI"

const DetailProduct = () => {
    let navigate = useNavigate();
    const product = useParams();
    const [maSP, setMaSP] = useState("")
    const [tenSP, setTenSP] = useState("")
    const [tenLoaiSP, setTenLoaiSP] = useState("")
    const [Hinh, setHinh] = useState("")
    const [MoTa, setMoTa] = useState("")
    useEffect(() => {
        getDetailProduct()
    }, []);
    const getDetailProduct = async () => {
        let res = await fetchDetailProductUser(product.MaSP);
        if (res && res.data) {
            setMaSP(res.data.MaSP)
            setTenSP(res.data.TenSP)
            setTenLoaiSP(res.data.MaLSPCha.TenLoai)
            setHinh(res.data.Hinh)
            setMoTa(res.data.MoTa)
        }
    }
    const ReturnHome = () => {
        navigate(`/?page=1&cate=all`)
        window.location.reload();
    }
    return (
        <>
            <div id="breadcrumb" class="section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <ul class="breadcrumb-tree">
                                <li><a href="#" onClick={() => ReturnHome()}>Home</a></li>
                                <li class="active">{tenSP}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-5 col-md-push-2">
                            <div id="product-main-img">
                                <div class="product-preview">
                                    <img src={Hinh} alt="" />
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <div class="product-details">
                                <h3 class="product-name">{tenSP}</h3>
                                <h4>{maSP}</h4>
                                <div>
                                    <h3 class="product-price">Liên hệ</h3>
                                </div>
                                <ul class="product-btns">
                                    <li><a href="#"><i class="fa fa-phone"></i> 0918.711.711 (Anh Thảo)</a></li>
                                    <li><a href="#"><i class="fa fa-phone"></i> 0974.379.047 (Anh Tâm)</a></li>
                                </ul>
                                <ul class="product-links">
                                    <li>Loại sản phẩm:</li>
                                    <li><a href="#">{tenLoaiSP}</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div id="product-tab">
                                <ul class="tab-nav">
                                    <li class="active"><a href="#">Mô tả</a></li>
                                </ul>
                                <div class="row">
                                    <div class="col-md-12">
                                        <p>{MoTa}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default DetailProduct;