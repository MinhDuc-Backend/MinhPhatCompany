import "./Nav3.scss"
import avt from "../logoMP.png"

const Nav = (props) => {
    const { changleHidden, changleSwitchMode } = props;
    const TenGV = "CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ THIẾT BỊ MINH PHÁT"
    const HinhGV = avt
    const onChangleHidden = () => {
        changleHidden();
    }
    const onChangleSwitchMode = () => {
        changleSwitchMode();
    }
    return (
        <nav className="nav3">
            <i className='bx bx-menu' onClick={() => onChangleHidden()} ></i>
            <input type="checkbox" id="switch-mode" hidden />
            <label className="name-gv">{TenGV}</label>
        </nav>

    )
}
export default Nav;