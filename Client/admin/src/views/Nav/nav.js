import "./Nav3.scss"
import avt from "../logoMP.png"

const Nav = (props) => {
    const { changleHidden, changleSwitchMode } = props;
    // const TenGV = localStorage.getItem("TenGV")
    // const HinhGV = localStorage.getItem("HinhGV")
    const TenGV = "Nguyễn Văn Minh Đức"
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
            {/* <label htmlFor="switch-mode" className="switch-mode" onClick={() => onChangleSwitchMode()}></label> */}
            <label className="name-gv">Xin chào, {TenGV}</label>
        </nav>

    )
}
export default Nav;