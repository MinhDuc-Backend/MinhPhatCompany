import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logomp from "../logomp.jpg"
import { fetchAllCategoryUser, fetchAllProductUser } from "../GetAPI"

const Product = () => {
    const [listData_category, SetListData_Category] = useState([]);
    const [listData_product, SetListData_Product] = useState([]);
    useEffect(() => {
        getListCategory();
        getListProduct();
    }, []);
    const getListCategory = async () => {
        let res = await fetchAllCategoryUser();
        if (res && res.data && res.data.DanhSach) {
            SetListData_Category(res.data.DanhSach)
        }
    }
    const getListProduct = async (page,pagesize,keyword) => {
        if (!page)
            page = 1;
        if (!pagesize)
            pagesize = 16;
        if (!keyword)
            keyword = '';
        let res = await fetchAllProductUser(page,pagesize,keyword);
        if (res && res.data && res.data.DanhSach) {
            SetListData_Product(res.data.DanhSach)
            console.log(listData_product);
        }
    }
    return (
        <>
            <div id="header">
                <div class="container">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="header-logo">
                                <a href="#" class="logo">
                                    <img src={logomp} alt="" />
                                </a>
                            </div>
                        </div>
                        <div class="col-md-9">
                            <div class="header-search">
                                <form>
                                    <select class="input-select">
                                        <option value="0">Tất cả</option>
                                        {listData_category && listData_category.length > 0 &&
                                            listData_category.map((item, index) => {
                                                return (
                                                    <option key={item.MaLSPCha} value={item.MaLSPCha}>{item.TenLoai}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <input class="input" placeholder="Tìm kiếm ở đây" />
                                    <button class="search-btn">Tìm</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section">
                <div class="container">
                    <div id="store" class="col-md-12">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-xs-12" style={{textAlign: "center"}}>
                                <h2>Phụ tùng máy</h2>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-3 col-md-4 col-xs-6">
                                <div class="product">
                                    <div class="product-img">
                                        <img src={logomp} alt="" />
                                    </div>
                                    <div class="product-body">
                                        <p class="product-category">Category</p>
                                        <h3 class="product-name"><a href="#">product name goes here</a></h3>
                                        <h4 class="product-price">Liên hệ</h4>
                                    </div>
                                    <div class="add-to-cart">
                                        <button class="add-to-cart-btn"><i class="fa fa-eye"></i> Xem chi tiết</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-xs-12">
                                <div class="store-filter clearfix">
                                    <ul class="store-pagination">
                                        <li class="active">1</li>
                                        <li><a href="#">2</a></li>
                                        <li><a href="#">3</a></li>
                                        <li><a href="#">4</a></li>
                                        <li><a href="#"><i class="fa fa-angle-right"></i></a></li>
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