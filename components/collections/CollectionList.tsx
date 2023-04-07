import React, { FC, useState, useEffect } from 'react';
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
  Divider
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import CollectionFilterOptions from "@components/collections/CollectionFilterOptions";
import NftCard, { INftItem } from '@components/NftCard';
import SearchBar from '@components/SearchBar'
import CollectionSort from '@components/collections/CollectionSort'
import { DataGrid, GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid';
import Link from '@components/Link'
import { formatNumber } from '@utils/general';

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

  const [apiRows, setApiRows] = useState(rows) // use setApiRows when API call collects the data
  const [currentRows, setCurrentRows] = useState(apiRows) // use setCurrentRows to determine filtered data from sorting, searching, and filtering
  const [filteredRows, setFilteredRows] = useState(apiRows)
  const [searchedRows, setSearchedRows] = useState(apiRows)
  
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  useEffect(() => {
    setCurrentRows(filteredRows.filter(o1 => searchedRows.some(o2 => o1.rank === o2.rank)))
  }, [filteredRows, searchedRows])

  // const displayMore = () => {
  //   setDisplayNumber((prev: number) => prev + 12)
  // }

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const handleDialogClick = () => {
    setFilterDialogOpen(true);
  };

  const handleDialogClose = () => {
    setFilterDialogOpen(false);
  };

  return (
    <>
      <Grid container sx={{ mb: 2 }} spacing={2}>
        <Grid item xs sm={7}>
          <SearchBar data={apiRows} searchKey="collection.name" setFilteredValue={setSearchedRows} />
        </Grid>
        {desktop && (
          <Grid item sm>
            <CollectionSort
              sortModel={sortModel}
              setSortModel={setSortModel}
            />
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
          <FilterDialog
            id="collection-filter-dialog"
            keepMounted
            open={filterDialogOpen}
            onClose={handleDialogClose}
            data={apiRows}
            setFilteredValues={setFilteredRows}
            sortModel={sortModel}
            setSortModel={setSortModel}
          />
        </Grid>
      </Grid>
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
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

interface FilterDialogProps {
  id: string;
  keepMounted: boolean;
  setFilteredValues: React.Dispatch<React.SetStateAction<any[]>>;
  data: any[];
  open: boolean;
  onClose: (value?: any[]) => void;
  sortModel: GridSortModel;
  setSortModel: React.Dispatch<React.SetStateAction<GridSortModel>>;
}

export interface ICollectionFilters {
  floorPrice: {
    min: number | '';
    max: number | '';
  };
  volume: {
    min: number | '';
    max: number | '';
  };
  items: {
    min: number | '';
    max: number | '';
  };
  owners: {
    min: number | '';
    max: number | '';
  };
}

const FilterDialog: FC<FilterDialogProps> = (props) => {
  const {
    onClose,
    open,
    setSortModel,
    setFilteredValues,
    sortModel,
    data,
    ...other
  } = props;
  const [localFilteredValues, setLocalFilteredValues] = useState(props.data);
  const [localSortModel, setLocalSortModel] = useState<GridSortModel>([])
  const [prevFilters, setPrevFilters] = useState<ICollectionFilters>(
    {
      floorPrice: { min: '', max: '' },
      volume: { min: '', max: '' },
      items: { min: '', max: '' },
      owners: { min: '', max: '' }
    }
  );
  const [filters, setFilters] = useState<ICollectionFilters>(
    {
      floorPrice: { min: '', max: '' },
      volume: { min: '', max: '' },
      items: { min: '', max: '' },
      owners: { min: '', max: '' }
    }
  );

  const handleCancel = () => {
    setLocalFilteredValues(data)
    setFilters(prevFilters)
    !desktop && setLocalSortModel(sortModel)
    onClose();
  };

  const handleOk = () => {
    setFilteredValues(localFilteredValues)
    setPrevFilters(filters)
    !desktop && setSortModel(localSortModel)
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      floorPrice: { min: '', max: '' },
      volume: { min: '', max: '' },
      items: { min: '', max: '' },
      owners: { min: '', max: '' }
    })
    !desktop && setLocalSortModel([])
  }

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"))

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
      maxWidth={desktop ? 'md' : undefined}
      fullScreen={!desktop}
      open={open}
      {...other}
    >
      <DialogContent dividers sx={{ p: '16px', border: 'none' }}>
        <CollectionFilterOptions
          data={props.data}
          filters={filters}
          setFilters={setFilters}
          setFilteredValues={setLocalFilteredValues}
        />
        {!desktop &&
          <>
            <Typography variant="h5" sx={{ mb: 0 }}>Sort</Typography>
            <Divider sx={{ mb: 2 }} />
            <CollectionSort
              sortModel={localSortModel}
              setSortModel={setLocalSortModel}
              sx={{ mb: "24px" }}
            />
          </>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={clearFilters}>Clear All</Button>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CollectionList
