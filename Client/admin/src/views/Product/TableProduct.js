
import "./TableProduct.scss";
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { IconDownload, IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { fetchAllProduct, fetchDeleteProduct } from "../GetAPI"
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import moment from "moment";
const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableProduct = (props) => {
    const accessToken = props.accessToken;
    const [listData_product, SetListData_Product] = useState([]);

    // component didmount
    useEffect(() => {
        getListProduct();
    }, []);

    const getListProduct = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllProduct(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_Product(res.data.DanhSach)
        }
    }

    const handleDeleteRows = async (row) => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchDeleteProduct(headers, row.original.MaSP)
        if (res.status === true) {
            toast.success(res.message)
            getListProduct()
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
        const csv = generateCsv(csvConfig)(listData_product);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaSP',
                header: 'Mã',
                size: 100,
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
            },
            {
                accessorKey: 'TenSP',
                header: 'Tên sản phẩm',
                size: 150,
                enableEditing: false,
            },
            {
                accessorKey: 'Hinh',
                header: 'Hình',
                size: 100,
                enableEditing: false,
                Cell: ({ renderedCellValue, row }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '160px',
                        }}
                        >
                        <img
                            alt="Hinh"
                            height={130}
                            src={row.original.Hinh}
                        />
                    </Box>
                ),
            },
            {

                accessorKey: 'MaLSPCha.TenLoai',
                header: 'Loại sản phẩm',
                size: 160,
                enableEditing: false,
            },
            {

                accessorKey: 'SoLuong',
                header: 'Số lượng',
                size: 160,
                enableEditing: false,
            },
        ]
    );

    const table = useMantineReactTable({
        columns,
        data: listData_product,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',
        enableColumnActions: true,
        enableRowActions: true,



        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                {/* <Link onClick={() => table.setEditingRow(row)}>
                    <IconButton>
                        <Visibility fontSize="medium" />
                    </IconButton>
                </Link> */}


                <Link to={"/admin/product/edit/" + row.original.MaSP}>
                    <IconButton onClick={() => table.setEditingRow(row)}>
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
}

export default TableProduct