import "./TablePurchaseOrder.scss"
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { Link } from "react-router-dom";
import { IconButton, } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import { fetchAllPurchaseOrder, fetchDeletePurchaseOrder } from "../GetAPI"
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

const TablePurchaseOrder = (props) => {
    const accessToken = props.accessToken;
    const [listData_purchaseOrder, SetListData_PurchaseOrder] = useState([]);
    // component didmount
    useEffect(() => {
        getListPurchaseOrder();
    }, []);

    const getListPurchaseOrder = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllPurchaseOrder(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_PurchaseOrder(res.data.DanhSach)
        }
    }

    const [ma_xoa, setMa_xoa] = useState({})
    const [open, setOpen] = useState(false);
    const handleClickOpen = (row) => {
        setOpen(true);
        setMa_xoa(row)
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteRows = async (row) => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDeletePurchaseOrder(headers, row.original.MaDDH)
        if (res.status === true) {
            toast.success(res.message)
            getListPurchaseOrder()
            setOpen(false);
            return;
        }
        if (res.success === false) {
            toast.error(res.message)
            return;
        }
    }

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(listData_purchaseOrder);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaDDH',
                header: 'Mã',
                size: 100,
                enableEditing: false,
            },
            {
                accessorKey: 'CongTyDatHang.TenCongTy',
                header: 'Công ty đặt hàng',
                size: 400,
                enableEditing: false,
            },
            {
                accessorKey: 'NgayDatHang',
                header: 'Ngày đặt hàng',
                size: 100,
                enableEditing: false,
                Cell: ({ row }) => {
                    const dinhdang = new Date(row.original.NgayDatHang);
                    let ngay = dinhdang.getDate();
                    let thang = dinhdang.getMonth() + 1;
                    let nam = dinhdang.getFullYear();
                    if (ngay < 10)
                        ngay = "0" + ngay;
                    if (thang < 10)
                        thang = "0" + thang;
                    let str = ngay + "-" + thang + "-" + nam;
                    return <div>{str}</div>;
                },
            },
            {
                accessorKey: 'NgayHetHan',
                header: 'Ngày hết hạn',
                size: 100,
                enableEditing: false,
                Cell: ({ row }) => {
                    const dinhdang = new Date(row.original.NgayHetHan);
                    let ngay = dinhdang.getDate();
                    let thang = dinhdang.getMonth() + 1;
                    let nam = dinhdang.getFullYear();
                    if (ngay < 10)
                        ngay = "0" + ngay;
                    if (thang < 10)
                        thang = "0" + thang;
                    let str = ngay + "-" + thang + "-" + nam;
                    return <div>{str}</div>;
                },
            },
            {
                accessorKey: 'ThoiHanGiaoHang',
                header: 'Thời gian giao hàng',
                size: 100,
                enableEditing: false,
            },
            {
                accessorKey: 'TrangThaiDDH',
                header: 'Trạng thái',
                size: 100,
                enableEditing: false,
                Cell: ({ row }) => {
                    const trangthai = row.original.TrangThaiDDH
                    return <div className='TotalPrice'>{trangthai}</div>;
                },
            },
        ]
    );

    const table = useMantineReactTable({
        columns,
        data: listData_purchaseOrder,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',
        enableColumnActions: true,
        enableRowActions: true,
        state: {
            columnVisibility: { MaDDH: false },
        },

        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                <Link to={"/admin/PurchaseOrder/single/" + row.original.MaDDH}>
                    <IconButton>
                        <Visibility fontSize="small" />
                    </IconButton>
                </Link>

                <Link to={"/admin/PurchaseOrder/edit/" + row.original.MaDDH}>
                    <IconButton  >
                        <Edit fontSize="small" />
                    </IconButton>
                </Link>

                <IconButton onClick={() => handleClickOpen(row)}>
                    <Delete fontSize="small" sx={{ color: 'red' }} />
                </IconButton>

            </Box >

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
        </>
    )

};

export default TablePurchaseOrder;