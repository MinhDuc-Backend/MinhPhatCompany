import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { fetchDetailProductUser, fetchAllCategoryChildUser } from "../GetAPI"
import logomp from "../logoMP.png"

const DetailProduct = () => {
    let navigate = useNavigate();
    const product = useParams();
    const [maSP, setMaSP] = useState("")
    const [tenSP, setTenSP] = useState("")
    const [tenLoaiSP, setTenLoaiSP] = useState("")
    const [Hinh, setHinh] = useState("")
    const [MoTa, setMoTa] = useState("")
    const [listData_category, SetListData_Category] = useState([]);
    const [KeyWord, SetKeyWord] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchCategory, SetSearchCategory] = useState('all');
    const [activeMenu, SetActiveMenu] = useState(false);
    useEffect(() => {
        getListCategory();
        getDetailProduct();
    }, []);
    const getListCategory = async () => {
        let res = await fetchAllCategoryChildUser();
        if (res && res.data && res.data.DanhSach) {
            SetListData_Category(res.data.DanhSach)
        }
    }
    const getDetailProduct = async () => {
        let res = await fetchDetailProductUser(product.MaSP);
        if (res && res.data) {
            setMaSP(res.data.MaSP)
            setTenSP(res.data.TenSP)
            setTenLoaiSP(res.data.MaLSPCon.TenLoai)
            setHinh(res.data.Hinh)
            setMoTa(res.data.MoTa)
        }
    }
    const ReturnPageProduct = () => {
        navigate(`/san-pham/?page=1&cate=all&searchKey=`)
        window.location.reload();
    }
    const ReturnHome = () => {
        navigate(`/home`)
        window.location.reload();
    }
    const onChangeSelect = (event, SetSelect) => {
        let changeValue = event.target.value;
        SetSelect(changeValue);
        navigate(`/san-pham/?page=1&cate=${changeValue}&searchKey=${KeyWord}`)
        window.location.reload();
    }
    const onChangeInput = (event, SetInput) => {
        let changeValue = event.target.value;
        SetInput(changeValue);
    }
    const SearchButton = () => {
        navigate(`/san-pham/?page=1&cate=${searchCategory}&searchKey=${KeyWord}`)
        window.location.reload();
    }
    const ActiveMenu = () => {
        SetActiveMenu(!activeMenu)
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            navigate(`/san-pham/?page=1&cate=${searchCategory}&searchKey=${KeyWord}`)
            window.location.reload();
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault(); // Ngăn chặn tải lại trang
    };
    return (
        <>
            <div id="header">
                <div class="container">
                    <div class="row">
                        <div class="col-md-3 col-sm-12">
                            <div class="header-logo">
                                <a href="#" class="logo" onClick={() => ReturnHome()}>
                                    <img src={logomp} alt="" />
                                </a>
                            </div>
                        </div>
                        <div class="col-md-7 col-sm-12">
                            <div class="header-search">
                                <form onSubmit={handleSubmit}>
                                    <select value={searchCategory} class="input-select" onChange={(event) => onChangeSelect(event, SetSearchCategory)}>
                                        <option value="all">Tất cả</option>
                                        {listData_category && listData_category.length > 0 &&
                                            listData_category.map((item, index) => {
                                                return (
                                                    <option key={item.MaLSPCon} value={item.MaLSPCon}>
                                                        {item.TenLoai}
                                                    </option>
                                                )
                                            })
                                        }
                                    </select>
                                    <input class="input" id="inputsearch" placeholder="Tìm kiếm" value={KeyWord} onChange={(event) => onChangeInput(event, SetKeyWord)} onKeyDown={handleKeyDown} />
                                    <button class="search-btn" type="button" onClick={() => SearchButton()}>Tìm</button>
                                </form>
                            </div>
                        </div>
                        <div class="col-md-2 clearfix">
                            <div class="header-ctn">
								<div class="menu-toggle" onClick={() => ActiveMenu()}>
									<a href="#">
										<i class="fa fa-bars"></i>
										<span>Danh mục</span>
									</a>
								</div>
							</div>
						</div>
                    </div>
                </div>
            </div>
            <nav id="navigation">
                <div class="container"></div>
            </nav>
            <div id="breadcrumb" class="section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <ul class="breadcrumb-tree">
                                <li><a href="#" onClick={() => ReturnHome()}>Trang chủ</a></li>
                                <li><a href="#" onClick={() => ReturnPageProduct()}>Sản phẩm</a></li>
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