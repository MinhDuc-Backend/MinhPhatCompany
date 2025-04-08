
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useMemo } from 'react';
import { Box, Button } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { mkConfig, generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import { fetchAllStaff, fetchDeleteStaff } from "../GetAPI"
import { toast } from "react-toastify";
import { useState, useEffect } from 'react';
import moment from "moment";
const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
});

const TableStaff = (props) => {
    const accessToken = props.accessToken;
    const [listData_nhanvien, SetListData_NhanVien] = useState([]);

    // component didmount
    useEffect(() => {
        getListStaff();
    }, []);

    const getListStaff = async () => {
        const headers = { 'x-access-token': accessToken };
        let res = await fetchAllStaff(headers);
        if (res && res.data && res.data.DanhSach) {
            SetListData_NhanVien(res.data.DanhSach)
        }
    }

    const handleDeleteRows = async (row) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dữ liệu này?")){
            const headers = { 'x-access-token': accessToken };
            let res = await fetchDeleteStaff(headers, row.original.MaNV)
            if (res.status === true) {
                toast.success(res.message)
                getListStaff()
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
        const csv = generateCsv(csvConfig)(listData_nhanvien);
        download(csvConfig)(csv);
    };
    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaNV',
                header: 'Mã',
                size: 100,
                enableColumnOrdering: false,
                enableEditing: false,
            },
            {
                id: 'TenDayDu', // Sử dụng một id duy nhất cho cột mới
                header: 'Họ và tên',
                size: 160, // Điều chỉnh kích thước phù hợp
                enableSorting: true, // Có thể cho phép sắp xếp theo tên đầy đủ
                enableEditing: false, // Ngăn người dùng sửa tên trực tiếp trên cột
                Cell: ({ row }) => `${row.original.HoNV} ${row.original.TenNV}`, // Định nghĩa hàm để kết hợp họ và tên
                
            },
            {

                accessorKey: 'Email',
                header: 'Email',
                size: 160,
                enableEditing: false,


            },
            {
                accessorKey: 'SoDienThoai',
                header: 'Số điện thoại',
                size: 100,
                enableEditing: false,
            },
            {
                accessorKey: 'GioiTinh',
                header: 'Giới Tính',
                size: 100,
                enableEditing: false,
            },
            {

                accessorKey: 'NgaySinh',
                header: 'Ngày sinh',
                accessorFn: (dataRow) => moment(dataRow.NgaySinh).format("DD-MM-YYYY"),
                size: 100,
                enableEditing: false,
            },
        ]
    );

    const table = useMantineReactTable({
        columns,
        data: listData_nhanvien,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',
        enableColumnActions: true,
        enableRowActions: true,

        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}>
                <Link to={"/admin/Staff/edit/" + row.original.MaNV}>
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

export default TableStaff