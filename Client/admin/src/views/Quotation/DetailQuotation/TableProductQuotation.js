import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react';
import "./TableProductQuotation.scss"
import { useNavigate } from "react-router-dom";
import { fetchDeleteProductQuotation } from "../../GetAPI"
import { toast } from "react-toastify";

const TableProductQuotation = (props) => {
    const { listData, MaPBG } = props
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    let navigate = useNavigate();

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
                enableSorting: false,
                enableFilter: false,
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
                    const tien = row.original.ThanhTienSauThue || 0;
                    const formattedAmount = tien.toLocaleString('vi-VN', {
                        currency: 'VND',
                    });
                    return <div>{formattedAmount}</div>;
                },
            },
        ],
        []
    );

    const table = useMantineReactTable({
        columns,
        data: listData,
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        enableColumnActions: true,
        enableRowActions: false,
        state: {
            columnVisibility: { _id: false },
        },
    });

    return (
        <>
            <MantineReactTable table={table} />
        </>
    )

};

export default TableProductQuotation;