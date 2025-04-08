import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react';
import { Box, Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { toast } from "react-toastify";
import { useEffect } from 'react';
import { fetchAllCompany, fetchDeleteCompany } from "../GetAPI"


const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableCompany = (props) => {
    const accessToken = props.accessToken;
    const [listData_company, SetListData_Company] = useState([]);
    // component didmount
    useEffect(() => {
        getListCompany();
    }, []);

    const getListCompany = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCompany(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_Company(res.data.DanhSach)
        }
    }
    const handleDeleteRows = async (row) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dữ liệu này?")){
            const headers = { 'x-access-token': accessToken };
            let res = await fetchDeleteCompany(headers, row.original.MaCongTy)
            if (res.status === true) {
                toast.success(res.message)
                getListCompany()
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
        const csv = generateCsv(csvConfig)(listData_company);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaCongTy',
                header: 'Mã công ty',
                size: 100,
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,

            },
            {
                accessorKey: 'TenCongTy',
                header: 'Tên công ty',
                size: 100,
                enableEditing: false,

            },
            {
                accessorKey: 'DiaChi',
                header: 'Địa chỉ',
                size: 300,
                enableEditing: false,

            },
        ]
    );


    const table = useMantineReactTable({
        columns,
        data: listData_company,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',
        enableColumnActions: true,
        enableRowActions: true,
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>

                <Link to={"/admin/Company/edit/" + row.original.MaCongTy}>
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

export default TableCompany;