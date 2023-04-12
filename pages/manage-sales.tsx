import React, { useContext, useState, useEffect } from 'react';
import type { NextPage } from 'next'
import {
  Container,
  useTheme,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Alert
} from '@mui/material'
import { WalletContext } from '@contexts/WalletContext';
import { DataGrid, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import Link from '@components/Link'
import { stringToUrl } from '@utils/general';

const saleRows = [
  {
    id: 1,
    saleName: 'Sale',
    collectionName: 'Collection',
    collectionStatus: 'MINTING_NFTS',
    startDate: '2023-04-09T01:47:00.500Z',
    endDate: '2023-05-08T12:17:00.500Z',
    saleStatus: 'PENDING',
  },
  {
    id: 2,
    saleName: 'Sale',
    collectionName: 'Collection',
    collectionStatus: 'MINTED',
    startDate: '2023-04-13T00:29:50.068Z',
    endDate: '2023-05-12T10:59:50.068Z',
    saleStatus: 'LIVE',
    action: 'End sale'
  },
  {
    id: 3,
    saleName: 'Sale',
    collectionName: 'Collection',
    collectionStatus: 'MINTING',
    startDate: '2023-04-09T01:47:00.500Z',
    endDate: '2023-05-08T12:17:00.500Z',
    saleStatus: 'PENDING',
  },
  {
    id: 4,
    saleName: 'Sale',
    collectionName: 'Collection',
    collectionStatus: 'MINTED',
    startDate: '2023-04-01T06:30:42Z',
    endDate: '2023-05-31T06:30:42Z',
    saleStatus: 'PENDING',
    action: 'Bootstrap'
  },
]

const ManageSales: NextPage = () => {
  const theme = useTheme()
  const {
    walletAddress,
    setAddWalletModalOpen,
  } = useContext(WalletContext);
  const [apiRows, setApiRows] = useState(saleRows) // use setApiRows when API call collects the data

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: '#',
      width: 60
    },
    {
      field: 'saleName',
      headerName: 'Sale Name',
      renderCell: (params) => (
        <Box>
          <Link href={'/marketplace/' + stringToUrl(params.value)}>{params.value}</Link>
        </Box>
      ),
      flex: 1,
      minWidth: 200
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
      field: 'collectionName',
      headerName: 'Collection Name',
      renderCell: (params) => (
        <>
          <Link href={'/collections/' + stringToUrl(params.value)}>{params.value}</Link>
        </>
      ),
      flex: 1,
      minWidth: 200
    },
    {
      field: 'collectionStatus',
      headerName: 'Collection Status',
      width: 220,
      renderCell: (params) => {
        const setSeverity = (input: string) => {
          if (input === "INITIALIZED") return 'warning'
          if (input === "MINTING" || input === "MINTING_NFTS" || input === "REFUNDING") return 'info'
          if (input === "MINTED" || input === "REFUNDED") return 'success'
          if (input === "FAILED") return 'error'
        }
        return (
          <>
            <Alert sx={{ mb: 0, width: '100%' }} severity={setSeverity(params.value)}>{params.value}</Alert>
          </>
        )
      }
    },
    {
      field: 'saleStatus',
      headerName: 'Sale Status',
      width: 180,
      renderCell: (params) => {
        const setSeverity = (input: string) => {
          if (input === "PENDING") return 'warning'
          if (input === "WAITING") return 'info'
          if (input === "LIVE" || input === "SOLD OUT" || input === "FINISHED") return 'success'
        }
        return (
          <>
            <Alert sx={{ mb: 0, width: '100%' }} severity={setSeverity(params.value)}>{params.value}</Alert>
          </>
        )
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      renderCell: (params) => {
        if (params.value !== undefined) {
          return (
            <>
              <Button variant="contained" onClick={() => { return }}>{params.value}</Button>
            </>
          )
        }
        },
      width: 140
    },
  ];

  useEffect(() => {
    setApiRows(saleRows)
  }, [])

  return (
    <Container sx={{ mt: '30px', mb: '50px' }}>
      <Grid container sx={{ mb: '36px' }} alignItems="flex-end">
        <Grid item md={6}>
          <Typography variant="h1">
            Manage Sales
          </Typography>
          <Typography variant="body2" sx={{ mb: 0 }}>
            Use this panel to keep track of pending and active token sales and your minted collections.
          </Typography>
        </Grid>
        <Grid item md={6} sx={{ textAlign: 'right' }}>

        </Grid>
      </Grid>
      {walletAddress !== '' ? (
        <Paper sx={{ width: '100%' }}>
          <DataGrid
            rows={apiRows}
            columns={columns}
            //disableColumnMenu
            autoHeight
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
            }}
            // rowHeight={64}
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
      ) : (
        <Box sx={{ textAlign: 'center', py: '20vh' }}>
          <Typography variant="body2" sx={{ mb: '12px' }}>
            You must connect a wallet to use this feature.
          </Typography>
          <Button variant="contained" onClick={() => setAddWalletModalOpen(true)}>
            Connect Now
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default ManageSales