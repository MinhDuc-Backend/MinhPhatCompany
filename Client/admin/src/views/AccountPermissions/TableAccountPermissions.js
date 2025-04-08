
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { fetchAllQuyenTK, fetchDeleteQuyenTK } from "../GetAPI"
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';

const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableQuyenTaiKhoan = (props) => {
    const accessToken = props.accessToken;
    const [listData_QuyenTaiKhoan, setListData_QuyenTaiKhoan] = useState([]);
    // component didmount
    useEffect(() => {
        getListQuyenTaiKhoan();
    }, []);

    const getListQuyenTaiKhoan = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllQuyenTK(headers);
        if (res && res.data && res.data.DanhSach) {
            setListData_QuyenTaiKhoan(res.data.DanhSach)
        }
    }
    const handleDeleteRows = async (row) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dữ liệu này?")){
            const headers = { 'x-access-token': accessToken };
            let res = await fetchDeleteQuyenTK(headers, row.original.MaQTK)
            if (res.status === true) {
                toast.success(res.message)
                getListQuyenTaiKhoan()
                return;
            }
            if (res.success === false) {
                toast.error(res.message)
                return;
            }
        }
    }

    const handleExportRows = (rows) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(listData_QuyenTaiKhoan);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaQTK',
                header: 'Mã quyền',
                size: 100,
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
            },
            {
                accessorKey: 'TenQuyenTK',
                header: 'Tên quyền tài khoản',
                size: 100,
                enableEditing: false,
            },
        ]
    );

    const table = useMantineReactTable({
        columns,
        data: listData_QuyenTaiKhoan,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',
        enableColumnActions: true,
        enableRowActions: true,



        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                <Link to={"/admin/AccountPermissions/single/" + row.original.MaQTK}>
                    <IconButton>
                        <Visibility fontSize="small" />
                    </IconButton>
                </Link>

                <Link to={"/admin/AccountPermissions/edit/" + row.original.MaQTK}>
                    <IconButton  >
                        <Edit fontSize="small" />
                    </IconButton>
                </Link>

                <IconButton onClick={() => handleDeleteRows(row)}>
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
                    variant="filled" >
                    Import Data
                </Button> */}
            </Box>

        ),
    });

    return (
        <>
            <MantineReactTable table={table} />
        </>
    )

};

export default TableQuyenTaiKhoan;