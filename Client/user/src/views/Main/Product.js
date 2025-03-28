import { useState, useEffect } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import logomp from "../logomp.jpg"
import Introduction from "./Introduction";
import { fetchAllCategoryChildUser, fetchAllProductUser, fetchAllProductUserCategory } from "../GetAPI"

const Product = () => {
    let navigate = useNavigate();
    const [activeMenu, SetActiveMenu] = useState(false);
    const [listData_category, SetListData_Category] = useState([]);
    const [listData_product, SetListData_Product] = useState([]);
    const [pageNumber, SetPageNumber] = useState([]);
    const [SumPage, SetSumPage] = useState(0);
    const [currentPage, SetCurrentPage] = useState(1);
    const [PageSize, SetPageSize] = useState(12);
    const [KeyWord, SetKeyWord] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchCategory, SetSearchCategory] = useState('all');
    useEffect(() => {
        getListCategory();
        getListProduct(currentPage,PageSize,KeyWord,searchCategory);
    }, []);
    const getListCategory = async () => {
        let res = await fetchAllCategoryChildUser();
        if (res && res.data && res.data.DanhSach) {
            SetListData_Category(res.data.DanhSach)
        }
    }
    const getListProduct = async (page,pagesize,keyword,search) => {
        if (searchParams.get('page')){
            page = searchParams.get('page');
            SetCurrentPage(page);
        }
        if (searchParams.get('cate')){
            search = searchParams.get('cate');
            SetSearchCategory(search);
        }
        if (searchParams.get('searchKey')){
            keyword = searchParams.get('searchKey');
            SetKeyWord(keyword);
        }
        let res = null;
        if (search == 'all')
            res = await fetchAllProductUser(page-1,pagesize,keyword);
        else
            res = await fetchAllProductUserCategory(page-1,pagesize,keyword,search);
        if (res && res.data && res.data.DanhSach) {
            SetListData_Product(res.data.DanhSach)
            SetSumPage(res.data.TongSoLuong)
            let pagenum = []
            for (let i = 1; i <= Math.ceil(res.data.TongSoLuong/PageSize); i++){
                pagenum.push(i);
            }
            SetPageNumber(pagenum);
        }
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
    const ReturnHome = () => {
        navigate(`/home`)
        window.location.reload();
    }
    const ActiveMenu = () => {
        SetActiveMenu(!activeMenu)
    }
    const DetailProduct = (masp) => {
        navigate(`/chi-tiet/${masp}`)
        window.location.reload();
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
                <div class="container">
                    <div id="responsive-nav" class={activeMenu ? "active" : ""}>
                        <ul class="main-nav nav navbar-nav">
                            <li><a href="#" onClick={() => ReturnHome()}>Trang chủ</a></li>
                            <li class="active"><a href="#">Sản phẩm</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="section">
                <div class="container">
                    <div id="store" class="col-md-12">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-xs-12" style={{textAlign: "center"}}>
                                <h2>Phụ tùng máy</h2>
                            </div>
                        </div>
                        <div class="row">
                            {listData_product && listData_product.length > 0 &&
                                listData_product.map((item, index) => {
                                    return (
                                        <div class="col-lg-3 col-md-4 col-xs-6">
                                            <div class="product" onClick={() => DetailProduct(item.MaSP)}>
                                                <div class="product-img">
                                                    <img src={item.Hinh} alt="" />
                                                </div>
                                                <div class="product-body">
                                                    <p class="product-category">{item.MaLSPCon.TenLoai}</p>
                                                    <h3 class="product-name"><a href={`/chi-tiet/${item.MaSP}`}>{item.TenSP}</a></h3>
                                                    <h4 class="product-price">Liên hệ</h4>
                                                </div>
                                                {/* <div class="add-to-cart">
                                                    <button class="add-to-cart-btn"><i class="fa fa-eye"></i>Xem chi tiết</button>
                                                </div> */}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            
                        </div>
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-xs-12">
                                <div class="store-filter clearfix">
                                    <ul class="store-pagination">
                                        {pageNumber && pageNumber.length > 0 && pageNumber.length <= 8 &&
                                            pageNumber.map((item, index) => {
                                                return (
                                                    <li key={item} class={item==currentPage ? "active" : ""}>
                                                        <a href={`/san-pham/?page=${item}&cate=${searchCategory}`}>{item}</a>
                                                    </li>
                                                )
                                            })
                                        }
                                        {pageNumber && pageNumber.length > 8 &&
                                            pageNumber.map((item, index) => {
                                                if (Number(item) == 1){
                                                    return (
                                                        <li key={item} class={item==currentPage ? "active" : ""}>
                                                            <a href={`/san-pham/?page=${item}&cate=${searchCategory}`}>{item}</a>
                                                        </li>
                                                    )
                                                }
                                                if (Number(item) != pageNumber.length){
                                                    if (Number(item) == (Number(currentPage)-3) || Number(item) == (Number(currentPage)+3)){
                                                        return (
                                                            <li key={item}>
                                                                ...
                                                            </li>
                                                        )
                                                    }
                                                    if (Number(item) >= (Number(currentPage)-2) && Number(item) <= (Number(currentPage)+2)){
                                                        return (
                                                            <li key={item} class={item==currentPage ? "active" : ""}>
                                                                <a href={`/san-pham/?page=${item}&cate=${searchCategory}`}>{item}</a>
                                                            </li>
                                                        )
                                                    }
                                                }
                                                else{
                                                    return (
                                                        <li key={item} class={item==currentPage ? "active" : ""}>
                                                            <a href={`/san-pham/?page=${item}&cate=${searchCategory}`}>{item}</a>
                                                        </li>
                                                    )
                                                }
                                            })
                                        }
                                        <li style={{ display: pageNumber.length > 1 && currentPage != pageNumber.length ? 'inline-block' : 'none' }}><a href={`/san-pham/?page=${Number(currentPage) + 1}&cate=${searchCategory}`}><i class="fa fa-angle-right"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Product;