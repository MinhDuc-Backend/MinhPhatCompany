

import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { IconDownload, IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import { fetchAllTaiKhoan, fetchDeleteTaiKhoan } from "../GetAPI"
const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableTaiKhoan = (props) => {
    const accessToken = props.accessToken;
    const [listData_TK, SetListData_TK] = useState([]);
    const [listData, SetListData] = useState([]);
    const [trangthaiTK, setTrangthaiTK] = useState('Đã kích hoạt')

    // component didmount
    useEffect(() => {
        getListTaiKhoan();
    }, []);

    const getListTaiKhoan = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllTaiKhoan(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_TK(res.data.DanhSach)
            SetListData(res.data.DanhSach.filter(item => item.TrangThai === 'Đã kích hoạt'))
        }
    }

    const handleDeleteRows = async (row) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dữ liệu này?")){
            const headers = { 'x-access-token': accessToken };
            let res = await fetchDeleteTaiKhoan(headers, row.original.MaTK)
            if (res.status === true) {
                toast.success(res.message)
                getListTaiKhoan()
                return;
            }
            if (res.success === false) {
                toast.error(res.message)
                return;
            }
        }
    }

    const onChangeSelect = (event, SetSelect) => {
        let changeValue = event.target.value;
        SetSelect(changeValue);
        changeValue === 'Đã kích hoạt' ? SetListData(listData_TK.filter(item => item.TrangThai === 'Đã kích hoạt')) : SetListData(listData_TK.filter(item => item.TrangThai === 'Chưa kích hoạt'))
    }

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(listData);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaTK',
                header: 'Mã tài khoản',
                size: 100,
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,

            },
            {
                accessorKey: 'TenDangNhap',
                header: 'Tên đăng nhập',
                size: 100,
                enableEditing: false,

            },
            {
                accessorKey: 'MaQTK.TenQuyenTK',
                header: 'Quyền tài khoản',
                size: 200,
                enableEditing: false,
            },
        ]
    );

    const table = useMantineReactTable({
        columns,
        data: listData,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',
        enableColumnActions: true,
        enableRowActions: true,



        renderRowActions: ({ row, table }) => (
            trangthaiTK === 'Đã kích hoạt' ?
                <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <Visibility fontSize="small" />
                    </IconButton>

                    <Link to={"/admin/Account/edit/" + row.original.MaTK}>
                        <IconButton  >
                            <Edit fontSize="small" />
                        </IconButton>
                    </Link>

                    <IconButton onClick={() => handleDeleteRows(row)}>
                        <Delete fontSize="small" sx={{ color: 'red' }} />
                    </IconButton>
                </Box >
                :
                <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                    <button type="button" className="btn btn-outline-success">Chấp nhận</button>
                    <button type="button" className="btn btn-outline-danger">Từ chối</button>
                </Box >
        ),



        renderTopToolbarCustomActions: ({ table }) => (
            <Box
                sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    color="lightblue"
                    //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                    onClick={handleExportData}
                    leftIcon={<IconUpload />}
                    variant="filled"
                >
                    Export All Data
                </Button>
                <Button
                    disabled={
                        !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
                    }
                    //only export selected rows
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    leftIcon={<IconUpload />}
                    variant="filled"
                >
                    Export Selected Rows
                </Button>

                {/* <Button
                    //only export selected rows
                    // onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                    leftIcon={<IconDownload />}
                    variant="filled"
                >
                    Import Data
                </Button> */}
            </Box >

        ),
    });
    return (
        <>

            <MantineReactTable table={table} />

        </>
    )

};

export default TableTaiKhoan;