import React, { FC, useState } from 'react';
import {
  Grid,
  Button,
  useMediaQuery,
  DialogContent,
  DialogActions,
  Dialog,
  Box,
  Paper,
  Avatar,
  Typography,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import FilterOptions from "@components/FilterOptions";
import NftCard, { INftItem } from '@components/NftCard';
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Link from '@components/Link'
import { formatNumber } from '@utils/general';

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

export interface ICollectionListProps {
  nftListArray: INftItem[];
  setDisplayNumber: React.Dispatch<React.SetStateAction<number>>;
  notFullWidth?: boolean;
}

const priceFormatter = (value: number, currency: string) => {
  const formattedNumber = formatNumber(value)
  return formattedNumber + ' ' + currency
}

const CollectionList: FC<ICollectionListProps> = ({ nftListArray, setDisplayNumber, notFullWidth }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"))
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [filterDialogvalue, setFilterDialogValue] = React.useState("What");
  const [currency, setCurrency] = useState('Erg')

  const rows = [
    { rank: 1, collection: { image: '/images/collections/ergopad-logo.jpg', name: 'Wrath of Gods', link: '/wrath' }, floorPrice: 10, volume: 2103, items: 3000, owners: 1475 },
    { rank: 2, collection: { image: '/images/character1.png', name: 'Cybercitizens', link: '/wrath' }, floorPrice: 0.00325, volume: 3256, items: 5000, owners: 5 },
    { rank: 3, collection: { image: '/images/character2.png', name: 'Ergnomes', link: '/wrath' }, floorPrice: 0.21, volume: 234, items: 280, owners: 22 },
    { rank: 4, collection: { image: '/images/character3.png', name: 'Inferno Black', link: '/wrath' }, floorPrice: 0.00012, volume: 666, items: 666, owners: 54 },
    { rank: 5, collection: { image: '/images/character4.png', name: 'Space Farmers', link: '/wrath' }, floorPrice: 62, volume: 723, items: 15, owners: 888888 },
    { rank: 6, collection: { image: '/images/cube1.png', name: 'WalrusDAO', link: '/wrath' }, floorPrice: 13, volume: 845, items: 873, owners: 7377 },
    { rank: 7, collection: { image: '/images/cube2.png', name: 'Mutant Apes', link: '/wrath' }, floorPrice: 20, volume: 123, items: 653, owners: 26 },
    { rank: 8, collection: { image: '/images/nft-cube.png', name: 'ErgoPixels', link: '/wrath' }, floorPrice: 70, volume: 66, items: 54, owners: 12 },
    { rank: 9, collection: { image: '/images/nft1.png', name: 'Ergo Mummies', link: '/wrath' }, floorPrice: 45, volume: 2000, items: 100000, owners: 1475 },
    { rank: 10, collection: { image: '/images/nft2.png', name: 'Aneta Angels', link: '/wrath' }, floorPrice: 12, volume: 1000, items: 5444, owners: 43 },
    { rank: 11, collection: { image: '/images/paideia-circle-logo.png', name: 'Bitmasks', link: '/wrath' }, floorPrice: 450, volume: 1500, items: 2555555, owners: 70 },
    { rank: 12, collection: { image: '/images/character1.png', name: 'Comet Degens', link: '/wrath' }, floorPrice: 28, volume: 16, items: 5252, owners: 7237 },
    { rank: 13, collection: { image: '/images/collections/ergopad-logo.jpg', name: 'Wrath of Gods', link: '/wrath' }, floorPrice: 10, volume: 2103, items: 3000, owners: 1475 },
    { rank: 14, collection: { image: '/images/character1.png', name: 'Cybercitizens', link: '/wrath' }, floorPrice: 15, volume: 3256, items: 5000, owners: 5 },
    { rank: 15, collection: { image: '/images/character2.png', name: 'Ergnomes', link: '/wrath' }, floorPrice: 12, volume: 234, items: 280, owners: 22 },
    { rank: 16, collection: { image: '/images/character3.png', name: 'Inferno Black', link: '/wrath' }, floorPrice: 100, volume: 666, items: 666, owners: 54 },
    { rank: 17, collection: { image: '/images/character4.png', name: 'Space Farmers', link: '/wrath' }, floorPrice: 62, volume: 723, items: 15, owners: 88888888 },
    { rank: 18, collection: { image: '/images/cube1.png', name: 'WalrusDAO', link: '/wrath' }, floorPrice: 13, volume: 845, items: 873, owners: 7377 },
    { rank: 19, collection: { image: '/images/cube2.png', name: 'Mutant Apes', link: '/wrath' }, floorPrice: 20, volume: 123, items: 653, owners: 26 },
    { rank: 20, collection: { image: '/images/nft-cube.png', name: 'ErgoPixels', link: '/wrath' }, floorPrice: 70, volume: 66, items: 54, owners: 12 },
    { rank: 21, collection: { image: '/images/nft1.png', name: 'Ergo Mummies', link: '/wrath' }, floorPrice: 45, volume: 2000, items: 100000, owners: 1475 },
    { rank: 22, collection: { image: '/images/nft2.png', name: 'Aneta Angels', link: '/wrath' }, floorPrice: 12, volume: 1000, items: 5444, owners: 43 },
    { rank: 23, collection: { image: '/images/paideia-circle-logo.png', name: 'Bitmasks', link: '/wrath' }, floorPrice: 450, volume: 1500, items: 2555555, owners: 70 },
    { rank: 24, collection: { image: '/images/character1.png', name: 'Comet Degens', link: '/wrath' }, floorPrice: 28, volume: 16, items: 5252, owners: 7237 },
    { rank: 25, collection: { image: '/images/collections/ergopad-logo.jpg', name: 'Wrath of Gods', link: '/wrath' }, floorPrice: 10, volume: 2103, items: 3000, owners: 1475 },
    { rank: 26, collection: { image: '/images/character1.png', name: 'Cybercitizens', link: '/wrath' }, floorPrice: 15, volume: 3256, items: 5000, owners: 5 },
    { rank: 27, collection: { image: '/images/character2.png', name: 'Ergnomes', link: '/wrath' }, floorPrice: 12, volume: 234, items: 280, owners: 22 },
    { rank: 28, collection: { image: '/images/character3.png', name: 'Inferno Black', link: '/wrath' }, floorPrice: 100, volume: 666, items: 666, owners: 54 },
    { rank: 29, collection: { image: '/images/character4.png', name: 'Space Farmers', link: '/wrath' }, floorPrice: 62, volume: 723, items: 15, owners: 888888 },
    { rank: 30, collection: { image: '/images/cube1.png', name: 'WalrusDAO', link: '/wrath' }, floorPrice: 13, volume: 845, items: 873, owners: 7377 },
    { rank: 31, collection: { image: '/images/cube2.png', name: 'Mutant Apes', link: '/wrath' }, floorPrice: 20, volume: 123, items: 653, owners: 26 },
    { rank: 32, collection: { image: '/images/nft-cube.png', name: 'ErgoPixels', link: '/wrath' }, floorPrice: 70, volume: 66, items: 54, owners: 12 },
    { rank: 33, collection: { image: '/images/nft1.png', name: 'Ergo Mummies', link: '/wrath' }, floorPrice: 45, volume: 2000, items: 100000, owners: 1475 },
    { rank: 34, collection: { image: '/images/nft2.png', name: 'Aneta Angels', link: '/wrath' }, floorPrice: 12, volume: 1000, items: 5444, owners: 43 },
    { rank: 35, collection: { image: '/images/paideia-circle-logo.png', name: 'Bitmasks', link: '/wrath' }, floorPrice: 450, volume: 1500, items: 2555555, owners: 70 },
    { rank: 36, collection: { image: '/images/character1.png', name: 'Comet Degens', link: '/wrath' }, floorPrice: 28, volume: 16, items: 5252, owners: 7237 },
  ];

  const columns: GridColDef[] = [
    {
      field: 'rank',
      headerName: '#',
      width: 60,
      sortable: false
    },
    {
      field: 'collection',
      headerName: 'Collection',
      renderCell: (params) => (
        <>
          <Box>
            <Avatar
              variant="rounded"
              alt={params.value.name}
              src={params.value.image}
              sx={{ width: 48, height: 48, mr: '6px' }}
            />
          </Box>
          <Link href={'/collections' + params.value.link}>{params.value.name}</Link>
        </>
      ),
      flex: 1,
      minWidth: 200,
      sortable: false
    },
    {
      field: 'floorPrice',
      headerName: 'Floor Price',
      type: 'number',
      width: 140,
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return priceFormatter(value, currency);
      },
    },
    {
      field: 'volume',
      headerName: 'Volume',
      type: 'number',
      width: 140,
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return priceFormatter(value, currency);
      },
    },
    {
      field: 'items',
      headerName: 'Items',
      type: 'number',
      description: 'Number of unique items in this collection.',
      width: 140,
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return formatNumber(value);
      },
    },
    {
      field: 'owners',
      headerName: 'Owners',
      type: 'number',
      description: 'Number of wallets that hold at least one token.',
      width: 140,
      valueFormatter: ({ value }) => {
        if (!value) {
          return value;
        }
        return formatNumber(value);
      },
    },
  ];

  const [apiRows, setApiRows] = useState(rows)
  const [currentRows, setCurrentRows] = useState(apiRows)

  const displayMore = () => {
    setDisplayNumber((prev: number) => prev + 12)
  }

  const handleDialogClick = () => {
    setFilterDialogOpen(true);
  };

  const handleDialogClose = (newValue?: string) => {
    setFilterDialogOpen(false);

    if (newValue) {
      setFilterDialogValue(newValue);
    }
  };

  const testFilter = () => {
    setCurrentRows(prev => prev.filter(filter => filter.rank > 3 && filter.rank < 20))
  }

  const testFilter2 = () => {
    setCurrentRows(rows)
  }

  return (
    <>
      <Grid container sx={{ mb: 2 }} spacing={2}>
        <Grid item xs sm={7}>
          <SearchBar data={apiRows} searchKey="collection.name" setFilteredValue={setCurrentRows} />
        </Grid>
        {desktop && (
          <Grid item sm>
            <SortBy />
          </Grid>
        )}
        <Grid item xs="auto">
          <Button
            variant="outlined"
            sx={{
              height: "100%",
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              '&:hover': {
                color: theme.palette.text.secondary,
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.text.secondary,
              }
            }}
            aria-label="filter"
            onClick={handleDialogClick}
          >
            <FilterAltIcon />
          </Button>
          <ConfirmationDialogRaw
            id="ringtone-menu"
            keepMounted
            open={filterDialogOpen}
            onClose={handleDialogClose}
            value={filterDialogvalue}
          />
        </Grid>
      </Grid>
      <Button onClick={() => testFilter()}>
        Test Filter
      </Button>
      <Button onClick={() => testFilter2()}>
        Test Filter 2
      </Button>
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={currentRows}
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
              '&:first-child': {
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
              '&:first-child': {
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

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"))

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          // background: "rgb(14, 20, 33)",
          width: "100%",
          maxWidth: "400px",
          // maxHeight: "80vh",

        },
      }}
      maxWidth={desktop ? 'sm' : undefined}
      fullScreen={!desktop}
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogContent dividers sx={{ p: '16px', border: 'none' }}>
        {!desktop && <SortBy sx={{ mb: "24px" }} />}
        <FilterOptions />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CollectionList
