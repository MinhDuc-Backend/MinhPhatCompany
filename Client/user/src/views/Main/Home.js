import { useState, useEffect } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import logomp from "../logomp.jpg"
import mangluoi from "../MangLuoi.jpg"
import linhvuc from "../LinhVuc.png"
import gtck1 from "../gtck1.png"
import gtck2 from "../gtck2.png"

const Home = () => {
    let navigate = useNavigate();
    const [activeMenu, SetActiveMenu] = useState(false);

    const ReturnHome = () => {
        navigate(`/home`)
        window.location.reload();
    }
    const ActiveMenu = () => {
        SetActiveMenu(!activeMenu)
    }
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
                        <div class="col-md-7 col-sm-12 title">
                            <div class="header-search">
                                <p>CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ THIẾT BỊ MINH PHÁT</p>
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
                            <li class="active"><a href="#" onClick={() => ReturnHome()}>Trang chủ</a></li>
                            <li><a href="/san-pham/?page=1&cate=all&searchKey=">Sản phẩm</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div class="section">
                <div class="container">
                    <div id="store" class="col-md-12">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-xs-12" style={{textAlign: "center", textTransform: "uppercase"}}>
                                <h2>Giới thiệu</h2>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 nameTitle">
                                <p><strong>* Tên công ty</strong></p>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 nameCompany">
                                <p>
                                    <div>CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ THIẾT BỊ MINH PHÁT</div>
                                    <div>(MINH PHAT EQUIPMENT TRADING SERVICE CO., LTD)</div>
                                </p>
                                {/* <p>CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ THIẾT BỊ MINH PHÁT</p>
                                <p>(MINH PHAT EQUIPMENT TRADING SERVICE CO., LTD)</p> */}
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 nameTitle">
                                <p><strong>* Logo</strong></p>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 logoCompany">
                                <img src={logomp} alt="" />
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 nameTitle">
                                <p><strong>* Lĩnh vực</strong></p>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 infoCompany">
                                <p>Cung cấp sản phẩm, dịch vụ cho ngành sản xuất đồ uống nói chung và ngành bia nói riêng.</p>
                                <div><img src={linhvuc} alt="" /></div>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 nameTitle">
                                <p><strong>* Phương châm hoạt động</strong></p>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 infoCompany">
                                <p>Sản phẩm và dịch vụ của Minh Phát gắn liền với lợi ích của khách hàng. Trên tinh thần hợp tác, đồng hành cùng khách hàng để tạo ra những giá trị ổn định với mức chi phí sản xuất tối ưu.</p>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 nameTitle">
                                <p><strong>* Giá trị cam kết</strong></p>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-md-6 imgCompany">
                                <div><img src={gtck1} alt="" /></div>
                            </div>
                            <div className="col-md-6 imgCompany">
                                <div><img src={gtck2} alt="" /></div>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 nameTitle">
                                <p><strong>* Mạng lưới khách hàng</strong></p>
                            </div>
                        </div>
                        <div class="row">
                            <div className="col-lg-12 col-md-12 col-xs-12 imgCompany1">
                                <p>Các nhà máy bia thuộc hệ thống SABECO</p>
                                <div><img src={mangluoi} alt="" /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Home;