import "./TableCategoryFather.scss"
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { IconDownload, IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { fetchDeleteCategoryFather, fetchAllCategoryFather } from "../GetAPI"
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableCategoryFather = (props) => {
    const accessToken = props.accessToken;
    const [listData_CategoryFather, SetListData_CategoryFather] = useState([]);
    // component didmount
    useEffect(() => {
        getListCategoryFather();
    }, []);

    const getListCategoryFather = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCategoryFather(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_CategoryFather(res.data.DanhSach)
        }
    }
    const handleDeleteRows = async (row) => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDeleteCategoryFather(headers, row.original.MaLSPCha)
        if (res.status === true) {
            toast.success(res.message)
            getListCategoryFather()
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
        const csv = generateCsv(csvConfig)(listData_CategoryFather);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaLSPCha',
                header: 'Mã loại',
                size: 200,
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,

            },
            {
                accessorKey: 'TenLoai',
                header: 'Tên loại',
                size: 400,
                enableEditing: false,

            },
        ]
    );

    const table = useMantineReactTable({
        columns,
        data: listData_CategoryFather,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',
        enableColumnActions: true,
        enableRowActions: true,

        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                <Link to={"/admin/CategoryFather/single/" + row.original.MaLSPCha}>
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <Visibility fontSize="small" />
                    </IconButton>
                </Link>
                <Link to={"/admin/CategoryFather/edit/" + row.original.MaLSPCha}>
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
            </Box>

        ),
    });
    return (
        <MantineReactTable table={table} />
    )
};

export default TableCategoryFather;