import React, { FC, useState } from 'react';
import {
  Button,
  useMediaQuery,
  Paper,
  Alert
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import Link from '@components/Link'
import { stringToUrl } from '@utils/general';

export interface ISaleListRow {
  rank: number;
  collection: {
    image: string;
    name: string;
    link: string;
    sys_name: string;
  }
  floorPrice: number;
  volume: number;
  items: number;
  owners: number;
}

export interface ISaleListProps {
  saleRows: ISaleListRow[];
}

const SaleList: FC<ISaleListProps> = ({ saleRows }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"))

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 60,
      sortable: false
    },
    {
      field: 'saleName',
      headerName: 'Sale Name',
      renderCell: (params) => (
        <>
          <Link href={'/marketplace/' + stringToUrl(params.value.saleName)}>{params.value.saleName}</Link>
        </>
      ),
      flex: 1,
      minWidth: 200,
      sortable: false
    },
    {
      field: 'collectionName',
      headerName: 'Collection Name',
      renderCell: (params) => (
        <>
          <Link href={'/marketplace/' + stringToUrl(params.value.saleName)}>{params.value.saleName}</Link>
        </>
      ),
      flex: 1,
      minWidth: 200,
      sortable: false
    },
    {
      field: 'collectionStatus',
      headerName: 'Collection Status',
      width: 140,
      renderCell: (params) => {

        return (
          <>
            <Alert severity="error">{params.value.status}</Alert>
          </>
        )
      }
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      type: 'dateTime',
      width: 140,
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      type: 'dateTime',
      width: 140,
      valueGetter: ({ value }) => value && new Date(value),
    },
    {
      field: 'saleStatus',
      headerName: 'Sale Status',
      width: 140,
      renderCell: (params) => {

        return (
          <>
            <Alert severity="error">{params.value.status}</Alert>
          </>
        )
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => (
        <>
          <Button onClick={() => { return }}>{params.value.action}</Button>
        </>
      ),
      flex: 1,
      minWidth: 200,
      sortable: false
    },
  ];

  const [apiRows, setApiRows] = useState(saleRows) // use setApiRows when API call collects the data

  return (
    <>
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={apiRows}
          columns={columns}
          disableColumnMenu
          autoHeight
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          rowHeight={64}
          getRowId={(row) => row.rank}
          // pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            mb: 0,
            '& .MuiDataGrid-row': {
              '&:hover': {
                background: theme.palette.divider,
                // cursor: 'pointer',
              }
            },
            '& .MuiDataGrid-cell': {
              '&:focus': {
                outline: 'none',
              },
              '&:first-of-type': {
                pl: 2,
              },
              '&:last-child': {
                pr: 2,
              },
            },
            '& .MuiDataGrid-columnHeader': {
              '&:focus': {
                outline: 'none',
              },
              '&:first-of-type': {
                pl: 2,
              },
              '&:last-child': {
                pr: 2,
              },
            }
          }}
        />
      </Paper>
    </>
  )
}

export default SaleList
