import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { fetchAllCustomer, fetchDeleteCustomer } from "../GetAPI"
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableCustomer = (props) => {
    const accessToken = props.accessToken;
    const [listData_customer, SetListData_Customer] = useState([]);

    // component didmount
    useEffect(() => {
        getListCustomer();
    }, []);

    const getListCustomer = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllCustomer(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_Customer(res.data.DanhSach)
        }
    }

    const handleDeleteRows = async (row) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dữ liệu này?")){
            const headers = { 'x-access-token': accessToken };
            let res = await fetchDeleteCustomer(headers, row.original.MaKH)
            if (res.status === true) {
                toast.success(res.message)
                getListCustomer()
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
        const csv = generateCsv(csvConfig)(listData_customer);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaKH',
                header: 'Mã khách hàng',
                size: 100,
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
            },
            {
                id: 'TenDayDu', // Sử dụng một id duy nhất cho cột mới
                header: 'Họ và tên',
                size: 160, // Điều chỉnh kích thước phù hợp
                enableSorting: true, // Có thể cho phép sắp xếp theo tên đầy đủ
                enableEditing: false, // Ngăn người dùng sửa tên trực tiếp trên cột
                Cell: ({ row }) => `${row.original.HoKH} ${row.original.TenKH}`, // Định nghĩa hàm để kết hợp họ và tên
                
            },
            {

                accessorKey: 'SoDienThoai',
                header: 'Số điện thoại',
                size: 160,
                enableEditing: false,
            },
            {

                accessorKey: 'CongTy.TenCongTy',
                header: 'Tên công ty',
                size: 240,
                enableEditing: false,
            },
        ]
    );

    const table = useMantineReactTable({
        columns,
        data: listData_customer,
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


                <Link to={"/admin/Customer/edit/" + row.original.MaKH}>
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

export default TableCustomer