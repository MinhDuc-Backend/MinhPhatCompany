import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react';
import { Box, Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import "./TableProductQuotation.scss"
import { IconButton, } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { fetchDeleteProductQuotation } from "../../GetAPI"
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
    const { listData, MaPBG } = props
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();

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


    const handleDeleteRows = async (row) => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDeleteProductQuotation(headers, MaPBG, row.original.Id)
        if (res.status === true) {
            toast.success(res.message)
            navigate(`/admin/Quotation/single/${MaPBG}`)
            return;
        }
        if (res.success === false) {
            toast.error(res.message)
            return;
        }
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
                <Link to={`/admin/khoaluan/${MaPBG}/detai/edit/` + row.original.Id}>
                    <IconButton  >
                        <Edit fontSize="small" />
                    </IconButton>
                </Link>

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
                <Link to={`/admin/khoaluan/${MaPBG}/detai/new`}>
                    <Button>Thêm sản phẩm</Button>
                </Link>
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
        </>
    )

};

export default TableProductQuotation;