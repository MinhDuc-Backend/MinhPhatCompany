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