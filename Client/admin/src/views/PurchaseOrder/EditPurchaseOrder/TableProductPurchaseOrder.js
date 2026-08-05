import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react';
import { Box, Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import "./TableProductPurchaseOrder.scss"
import { IconButton, } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { fetchDeleteProductPurchaseOrder, fetchAddProductPurchaseOrder, fetchDetailPurchaseOrder, fetchEditProductPurchaseOrder } from "../../GetAPI"
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

const TableProductPurchaseOrder = (props) => {
    const { listData, MaDDH, SetListData } = props
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();
    const [hiddenFormAddProductPurchaseOrder, SetHiddenFormAddProductPurchaseOrder] = useState(true);
    const [hiddenFormEditProductPurchaseOrder, SetHiddenFormEditProductPurchaseOrder] = useState(true);
    const [id, SetID] = useState("")
    const [TenSP, SetTenSP] = useState("")
    const [DonViTinh, SetDonViTinh] = useState("")
    const [SoLuong, SetSoLuong] = useState(0)

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
        SetHiddenFormAddProductPurchaseOrder(!hiddenFormAddProductPurchaseOrder);
    }

    const hiddenEditForm = () => {
        SetHiddenFormEditProductPurchaseOrder(!hiddenFormEditProductPurchaseOrder);
    }
    
    const getDetailPurchaseOrder = async () => {
            const headers = { 'x-access-token': accessToken };
            let res = await fetchDetailPurchaseOrder(headers, MaDDH);
            if (res && res.data) {
                SetListData(res.data.SanPhamDatHang)
            }
        }


    const handleDeleteRows = async (row) => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDeleteProductPurchaseOrder(headers, MaDDH, row.original._id)
        if (res.status === true) {
            toast.success(res.message)
            getDetailPurchaseOrder();
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
        SetDonViTinh("")
        SetSoLuong(0)
    }

    const OpenEditForm = (row) => {
        SetID(row.original._id)
        SetTenSP(row.original.TenSP)
        SetDonViTinh(row.original.DonViTinh)
        SetSoLuong(row.original.SoLuong)
        SetHiddenFormEditProductPurchaseOrder(false)
    }

    const handleAddProductPurchaseOrder = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !TenSP || !DonViTinh || !SoLuong ) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        let res = await fetchAddProductPurchaseOrder(headers, MaDDH, TenSP, DonViTinh, SoLuong)
        if (res.status === true) {
            toast.success(res.message)
            getDetailPurchaseOrder();
            SetHiddenFormAddProductPurchaseOrder(!hiddenFormAddProductPurchaseOrder);
            ClearData();
            return;
        }
        if (res.status === false) {
            toast.error(res.message)
            return;
        }
    }

    const handleEditProductPurchaseOrder = async () => {
        const headers = { 'x-access-token': accessToken };
        if (!headers || !TenSP || !DonViTinh || !SoLuong) {
            toast.error("Vui lòng điền đầy đủ dữ liệu")
            return
        }
        let res = await fetchEditProductPurchaseOrder(headers, MaDDH, id, TenSP, DonViTinh, SoLuong)
        if (res.status === true) {
            toast.success(res.message)
            getDetailPurchaseOrder();
            SetHiddenFormEditProductPurchaseOrder(!hiddenFormEditProductPurchaseOrder);
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
                size: 500,

            },
            {
                accessorKey: 'DonViTinh',
                header: 'ĐVT',
                size: 100,
            },
            {
                accessorKey: 'SoLuong',
                header: 'Số lượng',
                size: 100,
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
            <div className='OpacityDiv' style={{display: hiddenFormAddProductPurchaseOrder ? "none" : "block"}}>
                <div className='ProductPurchaseOrder'>
                    <form className="form-edit">
                        <div className="container-edit">
                            <div className="form-row titleAddProduct">
                                <div className='form-group col-md-12'><h4>Thêm sản phẩm</h4></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label className="titleLabel" for="inputNgayBD">Tên sản phẩm</label>
                                    <input type="text" value={TenSP} className="form-control customInput" id="inputNgayBD" placeholder='Điền tên sản phẩm ...' onChange={(event) => onChangeInputSL(event, SetTenSP)} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label className="titleLabel" for="inputNgayBD">Đơn vị tính</label>
                                    <input type="text" value={DonViTinh} className="form-control customInput" id="inputNgayBD" placeholder='VD: Cái, Bộ ...' onChange={(event) => onChangeInputSL(event, SetDonViTinh)} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="titleLabel" for="inputTen">Số lượng</label>
                                    <input type="number" value={SoLuong} className="form-control customInput" id="inputTen" onChange={(event) => onChangeInputSL(event, SetSoLuong)} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12 formbtnProductPurchaseOrder" id="btsubmit">
                                    <button className="btn btnClose" onClick={hiddenAddForm} type="button">Đóng</button>
                                    <button className="btn" type="button" onClick={() => handleAddProductPurchaseOrder()}>Thêm sản phẩm</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className='OpacityDiv' style={{display: hiddenFormEditProductPurchaseOrder ? "none" : "block"}}>
                <div className='ProductPurchaseOrder'>
                    <form className="form-edit">
                        <div className="container-edit">
                            <div className="form-row titleAddProduct">
                                <div className='form-group col-md-12'><h4>Điều chỉnh thông tin</h4></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label className="titleLabel" for="inputNgayBD">Tên sản phẩm</label>
                                    <input type="text" value={TenSP} className="form-control customInput" id="inputNgayBD" placeholder='Điền tên sản phẩm ...' onChange={(event) => onChangeInputSL(event, SetTenSP)} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label className="titleLabel" for="inputNgayBD">Đơn vị tính</label>
                                    <input type="text" value={DonViTinh} className="form-control customInput" id="inputNgayBD" placeholder='VD: Cái, Bộ ...' onChange={(event) => onChangeInputSL(event, SetDonViTinh)} />
                                </div>
                                <div className="form-group col-md-4">
                                    <label className="titleLabel" for="inputTen">Số lượng</label>
                                    <input type="number" value={SoLuong} className="form-control customInput" id="inputTen" onChange={(event) => onChangeInputSL(event, SetSoLuong)} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12 formbtnProductPurchaseOrder" id="btsubmit">
                                    <button className="btn btnClose" onClick={hiddenEditForm} type="button">Đóng</button>
                                    <button className="btn" type="button" onClick={() => handleEditProductPurchaseOrder()}>Cập nhật</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )

};

export default TableProductPurchaseOrder;