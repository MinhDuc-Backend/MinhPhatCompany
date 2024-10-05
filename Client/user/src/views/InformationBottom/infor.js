import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Footer = () => {

    return (
        <footer id="footer">
			<div class="section">
				<div class="container">
					<div class="row">
						<div class="col-md-8">
							<div class="footer">
								<h3 class="footer-title">Thông tin liên hệ</h3>
								<ul class="footer-links">
									<li><a><i class="fa fa-map-marker"></i>2/1A Liên Khu 2-10, Phường Bình Hưng Hòa A, Quận Bình Tân</a></li>
									<li><a><i class="fa fa-phone"></i>0918.711.711 (Anh Thảo)</a></li>
									<li><a><i class="fa fa-phone"></i>0974.379.047 (Anh Tâm)</a></li>
									<li><a><i class="fa fa-envelope-o"></i>minhphatsgb@gmail.com</a></li>
									<li><a><i class="fa fa-code"></i>MST: 0316091469</a></li>
								</ul>
							</div>
						</div>

						<div class="clearfix visible-xs"></div>

						<div class="col-md-4">
							<div class="footer">
								<h3 class="footer-title">Google map</h3>
								<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d692.848062340698!2d106.60142651485181!3d10.785211391675587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752d8f81a8e3a3%3A0xef82b8cc2a791ad6!2zMiBMacOqbiBLaHUgMi0xMCwgQsOsbmggSMawbmcgSG_DoCBBLCBCw6xuaCBUw6JuLCBI4buTIENow60gTWluaCwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1727083734514!5m2!1sen!2s" style={{border: '0px', width: '100%', height: '200px'}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
							</div>
						</div>
					</div>
				</div>
			</div>

		</footer>

    )
}

export default Footer