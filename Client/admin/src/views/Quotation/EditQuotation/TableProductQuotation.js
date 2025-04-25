import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react';
import { Box, Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import "./TableProductQuotation.scss"
import { IconButton, } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { fetchDeleteProductQuotation, fetchAddProductQuotation, fetchDetailQuotation, fetchEditProductQuotation } from "../../GetAPI"
import { toast } from "react-toastify";
import { AxiosRequestConfig } from 'axios';
import { CSVLink, CSVDownload } from "react-csv";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableProductQuotation = (props) => {
    const { listData, MaPBG, SetListData, SetTongTien } = props
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [hiddenFormAddProductQuotation, SetHiddenFormAddProductQuotation] = useState(true);
    const [hiddenFormEditProductQuotation, SetHiddenFormEditProductQuotation] = useState(true);
    const [id, SetID] = useState("")
    const [TenSP, SetTenSP] = useState("")
    const [QuyCachKyThuat, SetQuyCachKyThuat] = useState("")
    const [DonViTinh, SetDonViTinh] = useState("")
    const [SoLuong, SetSoLuong] = useState(0)
    const [Thue, SetThue] = useState(8)
    const [DonGia, SetDonGia] = useState(0)
    const [ThanhTien, SetThanhTien] = useState(0)
    const [ThanhTienSauThue, SetThanhTienSauThue] = useState(0)

    // const handleExportFile = async () => {
    //     const headers = { 'x-access-token': accessToken }
    //     let res = await fetchExportFileDSDeTai(headers, MaKLTN)
    //     const url = URL.createObjectURL(new Blob([res]));
    //     const aTag = document.createElement('a')
    //     aTag.href = url
    //     aTag.setAttribute('download', `DanhsachKhoaLuan_${MaKLTN}.xlsx`)
    //     document.body.appendChild(aTag)
    //     aTag.click();
    //     aTag.remove();
    // }

    const [ma_xoa, setMa_xoa] = useState({})
    const [open, setOpen] = useState(false);
    const handleClickOpen = (row) => {
        setOpen(true);
        setMa_xoa(row)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const hiddenAddForm = () => {
        ClearData()
        SetHiddenFormAddProductQuotation(!hiddenFormAddProductQuotation);
    }

    const hiddenEditForm = () => {
        SetHiddenFormEditProductQuotation(!hiddenFormEditProductQuotation);
    }
    
    const getDetailQuotation = async () => {
            const headers = { 'x-access-token': accessToken };
            let res = await fetchDetailQuotation(headers, MaPBG);
            if (res && res.data) {
                SetListData(res.data.SanPhamPBG)
                SetTongTien(res.data.TongTien)
            }
        }


    const handleDeleteRows = async (row) => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDeleteProductQuotation(headers, MaPBG, row.original._id)
        if (res.status === true) {
            toast.success(res.message)
            getDetailQuotation();
            setOpen(false);
            return;
        }
        if (res.success === false) {
            toast.error(res.message)
            return;
        }
    }

    const ClearData = () => {
        SetTenSP("")
        SetQuyCachKyThuat("")
        SetDonViTinh("")
        SetSoLuong(0)
        SetThue(8)
        SetDonGia(0)
        SetThanhTien(0)
        SetThanhTienSauThue(0)
    }

    const onChangeThanhTien = (event, setSL) => {
        let changeValue = event.target.value;
        setSL(changeValue);
        let tien = changeValue*SoLuong;
        SetThanhTien(tien)
        let tiensauthue = ( (tien*Thue) / 100 ) + tien;
        SetThanhTienSauThue(tiensauthue);
    }

    const onChangeThanhTienSauThue = (event, setSL) => {
        let changeValue = event.target.value;
        setSL(changeValue);
        let tiensauthue = ( (ThanhTien*changeValue) / 100 ) + ThanhTien;
        SetThanhTienSauThue(tiensauthue);
    }

    const OpenEditForm = (row) => {
        SetID(row.original._id)
        SetTenSP(row.original.TenSP)
        SetQuyCachKyThuat(row.original.QuyCachKyThuat)
        SetDonViTinh(row.original.DonViTinh)
        SetSoLuong(row.original.SoLuong)
        SetThue(row.original.Thue)
        SetDonGia(row.original.DonGia)
        SetThanhTien(row.original.ThanhTien)
        SetThanhTienSauThue(row.original.ThanhTienSauThue)
        SetHiddenFormEditProductQuotation(false)
    }

    const handleAddProductQuotation = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !TenSP || !QuyCachKyThuat || !DonViTinh || !SoLuong || !Thue || !DonGia) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        let res = await fetchAddProductQuotation(headers, MaPBG, TenSP, QuyCachKyThuat, DonViTinh, SoLuong, Thue, DonGia, ThanhTien, ThanhTienSauThue)
        if (res.status === true) {
            toast.success(res.message)
            getDetailQuotation();
            SetHiddenFormAddProductQuotation(!hiddenFormAddProductQuotation);
            ClearData();
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;
        }
    }

    const handleEditProductQuotation = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !TenSP || !QuyCachKyThuat || !DonViTinh || !SoLuong || !Thue || !DonGia) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        let res = await fetchEditProductQuotation(headers, MaPBG, id, TenSP, QuyCachKyThuat, DonViTinh, SoLuong, Thue, DonGia, ThanhTien, ThanhTienSauThue)
        if (res.status === true) {
            toast.success(res.message)
            getDetailQuotation();
            SetHiddenFormEditProductQuotation(!hiddenFormEditProductQuotation);
            ClearData();
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;
        }
    }

    const onChangeInputSL = (event, setSL) => {
        let changeValue = event.target.value;
        setSL(changeValue);
    }
    const onChangeSelect = (event, setSelect) => {
        let changeValue = event.target.value;
        setSelect(changeValue);
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: '_id',
                header: 'Id',
                size: 10,
                enableEditing: false,
            },
            {
                accessorKey: 'STT',
                header: 'STT',
                size: 50,
                Cell: ({ row }) => {
                    return <div>{row.index + 1}</div>;
                },

            },
            {
                accessorKey: 'TenSP',
                header: 'Tên sản phẩm',
                size: 200,

            },
            {
                accessorKey: 'QuyCachKyThuat',
                header: 'Quy cách kỹ thuật',
                size: 150,
            },
            {
                accessorKey: 'DonViTinh',
                header: 'ĐVT',
                size: 50,
            },
            {
                accessorKey: 'SoLuong',
                header: 'Số lượng',
                size: 50,
            },
            {
                accessorKey: 'Thue',
                header: 'VAT',
                size: 50,

            },
            {
                accessorKey: 'DonGia',
                header: 'Đơn giá (VNĐ)',
                size: 150,
                Cell: ({ row }) => {
                    const tien = row.original.DonGia
                    const formattedAmount = tien.toLocaleString('vi-VN', {
                        currency: 'VND',
                    });
                    return <div>{formattedAmount}</div>;
                },
            },
            {
                accessorKey: 'ThanhTien',
                header: 'Thành tiền (VNĐ)',
                size: 150,
                Cell: ({ row }) => {
                    const tien = row.original.ThanhTien
                    const formattedAmount = tien.toLocaleString('vi-VN', {
                        currency: 'VND',
                    });
                    return <div>{formattedAmount}</div>;
                },
            },
            {
                accessorKey: 'ThanhTienSauThue',
                header: 'Thành tiền sau thuế (VNĐ)',
                size: 200,
                Cell: ({ row }) => {
                    const tien = row.original.ThanhTienSauThue
                    const formattedAmount = tien.toLocaleString('vi-VN', {
                        currency: 'VND',
                    });
                    return <div>{formattedAmount}</div>;
                },
            },
        ]
    );

    const table = useMantineReactTable({
        columns,
        data: listData,
        enableSorting: false,
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        enableColumnActions: true,
        enableRowActions: true, 
        positionActionsColumn: 'last',
        state: {
            columnVisibility: { _id: false },
        },

        renderRowActions: ({ row }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                <IconButton onClick={() => OpenEditForm(row)} >
                    <Edit fontSize="small" />
                </IconButton>

                <IconButton onClick={() => handleClickOpen(row)}>
                    <Delete fontSize="small" sx={{ color: 'red' }} />
                </IconButton>
            </Box >

        ),
        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}>
                <Button onClick={hiddenAddForm}>Thêm sản phẩm</Button>
            </Box>

        ),
    });

    return (
        <>
            <MantineReactTable table={table} />
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" style={{ color: 'red' }}>
                    {"Xóa dữ liệu"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Dữ liệu bị xóa sẽ không thể hồi phục lại.
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa dữ liệu này ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{ background: 'red' }}>Từ chối</Button>
                    <Button onClick={() => handleDeleteRows(ma_xoa)} autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
            <div className='OpacityDiv' style={{display: hiddenFormAddProductQuotation ? "none" : "block"}}>
                <div className='ProductQuotation'>
                    <form className="form-edit">
                        <div className="container-edit">
                            <div className="form-row titleAddProduct">
                                <div className='form-group col-md-12'><h4>Thêm sản phẩm</h4></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label className="titleLabel" for="inputNgayBD">Tên sản phẩm</label>
                                    <input type="text" value={TenSP} className="form-control customInput" id="inputNgayBD" placeholder='Điền tên sản phẩm ...' onChange={(event) => onChangeInputSL(event, SetTenSP)} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="titleLabel" for="inputTen">Quy cách kỹ thuật</label>
                                    <input type="text" value={QuyCachKyThuat} className="form-control customInput" id="inputTen" placeholder="Điền quy cách kỹ thuật ..." onChange={(event) => onChangeInputSL(event, SetQuyCachKyThuat)} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label className="titleLabel" for="inputNgayBD">Đơn vị tính</label>
                                    <input type="text" value={DonViTinh} className="form-control customInput" id="inputNgayBD" placeholder='VD: Cái, Bộ ...' onChange={(event) => onChangeInputSL(event, SetDonViTinh)} />
                                </div>
                                <div className="form-group col-md-2">
                                    <label className="titleLabel" for="inputTen">Số lượng</label>
                                    <input type="number" value={SoLuong} className="form-control customInput" id="inputTen" onChange={(event) => onChangeInputSL(event, SetSoLuong)} />
                                </div>
                                <div className="form-group col-md-5">
                                    <label className="titleLabel" for="inputTen">Đơn giá</label>
                                    <input type="number" value={DonGia} className="form-control customInput" id="inputTen" onChange={(event) => onChangeThanhTien(event, SetDonGia)} />
                                </div>
                                <div className="form-group col-md-2">
                                    <label className="titleLabel" for="inputTen">Thuế</label>
                                    <select id="inputNganh" value={Thue} onChange={(event) => onChangeThanhTienSauThue(event, SetThue)} className="form-control customInput">
                                        <option key="8" value='8'>8%</option>
                                        <option key="10" value='10'>10%</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label className="titleLabel" for="inputNgayBD">Thành tiền</label>
                                    <input type="text" value={ThanhTien} className="form-control customInput" id="inputNgayBD" readOnly />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="titleLabel" for="inputTen">Thành tiền sau thuế</label>
                                    <input type="text" value={ThanhTienSauThue} className="form-control customInput" id="inputTen" readOnly />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12 formbtnProductQuotation" id="btsubmit">
                                    <button className="btn btnClose" onClick={hiddenAddForm} type="button">Đóng</button>
                                    <button className="btn" type="button" onClick={() => handleAddProductQuotation()}>Thêm sản phẩm</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className='OpacityDiv' style={{display: hiddenFormEditProductQuotation ? "none" : "block"}}>
                <div className='ProductQuotation'>
                    <form className="form-edit">
                        <div className="container-edit">
                            <div className="form-row titleAddProduct">
                                <div className='form-group col-md-12'><h4>Điều chỉnh thông tin</h4></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label className="titleLabel" for="inputNgayBD">Tên sản phẩm</label>
                                    <input type="text" value={TenSP} className="form-control customInput" id="inputNgayBD" placeholder='Điền tên sản phẩm ...' onChange={(event) => onChangeInputSL(event, SetTenSP)} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="titleLabel" for="inputTen">Quy cách kỹ thuật</label>
                                    <input type="text" value={QuyCachKyThuat} className="form-control customInput" id="inputTen" placeholder="Điền quy cách kỹ thuật ..." onChange={(event) => onChangeInputSL(event, SetQuyCachKyThuat)} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label className="titleLabel" for="inputNgayBD">Đơn vị tính</label>
                                    <input type="text" value={DonViTinh} className="form-control customInput" id="inputNgayBD" placeholder='VD: Cái, Bộ ...' onChange={(event) => onChangeInputSL(event, SetDonViTinh)} />
                                </div>
                                <div className="form-group col-md-2">
                                    <label className="titleLabel" for="inputTen">Số lượng</label>
                                    <input type="number" value={SoLuong} className="form-control customInput" id="inputTen" onChange={(event) => onChangeInputSL(event, SetSoLuong)} />
                                </div>
                                <div className="form-group col-md-5">
                                    <label className="titleLabel" for="inputTen">Đơn giá</label>
                                    <input type="number" value={DonGia} className="form-control customInput" id="inputTen" onChange={(event) => onChangeThanhTien(event, SetDonGia)} />
                                </div>
                                <div className="form-group col-md-2">
                                    <label className="titleLabel" for="inputTen">Thuế</label>
                                    <select id="inputNganh" value={Thue} onChange={(event) => onChangeThanhTienSauThue(event, SetThue)} className="form-control customInput">
                                        <option key="8" value='8'>8%</option>
                                        <option key="10" value='10'>10%</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label className="titleLabel" for="inputNgayBD">Thành tiền</label>
                                    <input type="text" value={ThanhTien} className="form-control customInput" id="inputNgayBD" readOnly />
                                </div>
                                <div className="form-group col-md-6">
                                    <label className="titleLabel" for="inputTen">Thành tiền sau thuế</label>
                                    <input type="text" value={ThanhTienSauThue} className="form-control customInput" id="inputTen" readOnly />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12 formbtnProductQuotation" id="btsubmit">
                                    <button className="btn btnClose" onClick={hiddenEditForm} type="button">Đóng</button>
                                    <button className="btn" type="button" onClick={() => handleEditProductQuotation()}>Cập nhật</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )

};

export default TableProductQuotation;