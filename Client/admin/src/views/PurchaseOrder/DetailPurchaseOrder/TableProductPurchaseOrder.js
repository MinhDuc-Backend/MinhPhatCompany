import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react';
import "./TableProductPurchaseOrder.scss"


const TableProductPurchaseOrder = (props) => {
    const { listData } = props
    const [accessToken] = useState(localStorage.getItem("accessToken"));

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
                size: 500,

            },
            {
                accessorKey: 'DonViTinh',
                header: 'ĐVT',
                size: 100,
            },
            {
                accessorKey: 'SoLuong',
                header: 'Số lượng',
                size: 100,
            },
        ],[]
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

export default TableProductPurchaseOrder;