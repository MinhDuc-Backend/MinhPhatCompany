import "./TableQuotation.scss"
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { Link } from "react-router-dom";
import { IconButton, } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import { fetchAllQuotation, fetchDeleteQuotation } from "../GetAPI"
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

const TableQuotation = (props) => {
    const accessToken = props.accessToken;
    const [listData_quotation, SetListData_Quotation] = useState([]);
    // component didmount
    useEffect(() => {
        getListQuotation();
    }, []);

    const getListQuotation = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllQuotation(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_Quotation(res.data.DanhSach)
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
        let res = await fetchDeleteQuotation(headers, row.original.MaPBG)
        if (res.status === true) {
            toast.success(res.message)
            getListQuotation()
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
        const csv = generateCsv(csvConfig)(listData_quotation);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaPBG',
                header: 'Mã',
                size: 100,
                enableEditing: false,
            },
            {
                accessorKey: 'TenPBG',
                header: 'Tên phiếu báo giá',
                size: 200,
                enableEditing: false,
            },
            {
                accessorKey: 'NgayBaoGia',
                header: 'Ngày báo giá',
                size: 100,
                enableEditing: false,
                Cell: ({ row }) => {
                    const dinhdang = new Date(row.original.NgayBaoGia);
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
                accessorKey: 'KhachHangPBG.TenKH',
                header: 'Tên khách hàng',
                size: 100,
                enableEditing: false,
            },
            {
                accessorKey: 'KhachHangPBG.CongTy.TenCongTy',
                header: 'Tên công ty',
                size: 300,
                enableEditing: false,
            },
            {
                accessorKey: 'TongTien',
                header: 'Tổng tiền',
                size: 100,
                enableEditing: false,
                Cell: ({ row }) => {
                    const tong = row.original.TongTien
                    const formattedAmount = tong.toLocaleString('vi-VN', {
                        currency: 'VND',
                    });
                    return <div className='TotalPrice'>{formattedAmount}</div>;
                },
            },
        ]
    );

    const table = useMantineReactTable({
        columns,
        data: listData_quotation,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',
        enableColumnActions: true,
        enableRowActions: true,
        state: {
            columnVisibility: { MaPBG: false },
        },

        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                <Link to={"/admin/Quotation/single/" + row.original.MaPBG}>
                    <IconButton>
                        <Visibility fontSize="small" />
                    </IconButton>
                </Link>

                <Link to={"/admin/Quotation/edit/" + row.original.MaPBG}>
                    <IconButton  >
                        <Edit fontSize="small" />
                    </IconButton>
                </Link>

                <IconButton onClick={() => handleClickOpen(row)}>
                    <Delete fontSize="small" sx={{ color: 'red' }} />
                </IconButton>

            </Box >

        ),



        // renderTopToolbarCustomActions: ({ table }) => (
        //     <Box
        //         sx={{
        //             display: 'flex',
        //             gap: '16px',
        //             padding: '8px',
        //             flexWrap: 'wrap',
        //         }}
        //     >
        //         <Button
        //             color="lightblue"
        //             //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
        //             onClick={handleExportData}
        //             leftIcon={<IconUpload />}
        //             variant="filled"
        //         >
        //             Export All Data
        //         </Button>
        //         <Button
        //             disabled={
        //                 !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
        //             }
        //             //only export selected rows
        //             onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
        //             leftIcon={<IconUpload />}
        //             variant="filled"
        //         >
        //             Export Selected Rows
        //         </Button>
        //     </Box>

        // ),
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

export default TableQuotation;