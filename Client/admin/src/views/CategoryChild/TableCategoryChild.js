import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button } from '@mantine/core';
import { IconDownload, IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { toast } from "react-toastify";
import { useEffect } from 'react';
import { fetchAllCategoryChild, fetchDeleteCategoryChild } from "../GetAPI"


const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableCategoryChild = (props) => {
    const accessToken = props.accessToken;
    const [listData_categoryChild, SetListData_CategoryChild] = useState([]);
    // component didmount
    useEffect(() => {
        getListCategoryChild();
    }, []);

    const getListCategoryChild = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCategoryChild(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_CategoryChild(res.data.DanhSach)
        }
    }
    const handleDeleteRows = async (row) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dữ liệu này?")){
            const headers = { 'x-access-token': accessToken };
            let res = await fetchDeleteCategoryChild(headers, row.original.MaLSPCon)
            if (res.status === true) {
                toast.success(res.message)
                getListCategoryChild()
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
        const csv = generateCsv(csvConfig)(listData_categoryChild);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaLSPCon',
                header: 'Mã loại SP nhỏ',
                size: 100,
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,

            },
            {
                accessorKey: 'TenLoai',
                header: 'Tên loại',
                size: 100,
                enableEditing: false,

            },
            {
                accessorKey: 'MaLSPCha.TenLoai',
                header: 'Thuộc SP lớn',
                size: 100,
                enableEditing: false,

            },
        ]
    );


    const table = useMantineReactTable({
        columns,
        data: listData_categoryChild,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',
        enableColumnActions: true,
        enableRowActions: true,
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>

                <IconButton onClick={() => table.setEditingRow(row)}>
                    <Visibility fontSize="small" />
                </IconButton>

                <Link to={"/admin/CategoryChild/edit/" + row.original.MaLSPCon}>
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
        <>

            <MantineReactTable table={table} />

        </>
    )

};

export default TableCategoryChild;