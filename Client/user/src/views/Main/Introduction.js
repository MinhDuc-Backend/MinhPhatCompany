
import mangluoi from "../MangLuoi.jpg"
import linhvuc from "../LinhVuc.png"
const Introduction = () => {
    return (
        <>
            <div id="newsletter" class="section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="newsletter">
                                <p><strong>Lĩnh vực</strong></p>
                                <img src={linhvuc} style={{width: "60%"}} />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="newsletter">
                                <p><strong>Mạng lưới khách hàng</strong></p>
                                <img src={mangluoi} style={{width: "80%"}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Introduction;