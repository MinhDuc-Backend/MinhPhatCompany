import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import React, { useMemo, useState } from 'react';
import { Box } from '@mantine/core';
import { Link } from "react-router-dom";
import { IconButton } from '@mui/material';
import { Delete, Edit, Label, Visibility } from '@mui/icons-material';
import "./TableCategoryChild.scss"


const TableCategoryChild = (props) => {
    const listData_CategoryChild = props.listData_CategoryChild;

    const columns = useMemo(
        () => [
            {
                accessorKey: 'MaLSPCon',
                header: 'Mã loại sản phẩm con',
                size: 100,
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
            },
            {
                accessorKey: 'TenLoai',
                header: 'Tên loại sản phẩm con',
                size: 100,
                enableEditing: false,
            },
        ],[]
    );

    const table = useMantineReactTable({
        columns,
        data: listData_CategoryChild,
        enableRowSelection: false,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        positionActionsColumn: 'last',

        renderTopToolbarCustomActions: ({ table }) => (
            <label className="ds-cn" htmlFor="inputTen">Danh sách loại sản phẩm nhỏ</label>

        ),

        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '0.3rem' }}> </Box >
        ),

    })
    return (
        <>
            <MantineReactTable table={table} />
        </>
    )
}

export default TableCategoryChild