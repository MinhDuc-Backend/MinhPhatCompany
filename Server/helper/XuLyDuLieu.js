import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const vietnamTimeZone = 'Asia/Ho_Chi_Minh';

export const XuLyNgaySinh = (data) => {
    const date = new Date(data);
    let ngay = date.getDate();
    let thang = date.getMonth() + 1;
    let nam = date.getFullYear();
    if (ngay < 10)
        ngay = "0" + ngay;
    if (thang < 10)
        thang = "0" + thang;
    return ngay + "-" + thang + "-" + nam;
}

export const DoiDinhDangNgay = (data) => {
    const date = new Date(data);
    let ngay = date.getDate();
    let thang = date.getMonth() + 1;
    let nam = date.getFullYear();
    if (ngay < 10)
        ngay = "0" + ngay;
    if (thang < 10)
        thang = "0" + thang;
    return nam + "-" + thang + "-" + ngay;
}

export const TaoMaPhieuBaoGia = () => {
    const date = new Date();
    const vietnamTime = toZonedTime(date, vietnamTimeZone);
    const formattedTimeVN = format(vietnamTime, 'ddMMyyyyHHmmss', { timeZone: vietnamTimeZone });
    return "BG" + formattedTimeVN;
}

export const DinhDangNgayBaoGia = (data) => {
    const date = new Date(data);
    const vietnamTime = toZonedTime(date, vietnamTimeZone);
    const formattedTimeVN = format(vietnamTime, "'TP.HCM, ngày 'dd' tháng 'MM' năm 'yyyy'", { timeZone: vietnamTimeZone });
    return formattedTimeVN;
}

export const DinhDangSoBaoGia = (macty, ngaybaogia) => {
    const date = new Date(ngaybaogia);
    let thang = date.getMonth() + 1;
    let nam = date.getFullYear();
    if (thang < 10)
        thang = "0" + thang;
    return "MP-" + macty + "/" + nam + "-" + thang;
}