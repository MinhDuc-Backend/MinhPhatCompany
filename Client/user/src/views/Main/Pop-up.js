
import iconZalo from "../iconZalo.png"
import iconPhone from "../iconPhone.png"
const Popup = () => {
    return (
        <>
            <a class="btn-tel-chat" target="_blank" rel="nofollow" href="tel:0918711711">
                <img src={iconPhone} />
            </a>
            <a class="btn-zalo-chat" target="_blank" rel="nofollow" href="https://zalo.me/0918711711">
                <img src={iconZalo} />
            </a>
        </>
    )
}
export default Popup;