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

export interface ICollectionRow {
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

export interface ICollectionListProps {
  setDisplayNumber: React.Dispatch<React.SetStateAction<number>>;
  collectionRows: ICollectionRow[];
}

const priceFormatter = (value: number, currency: string) => {
  const formattedNumber = formatNumber(value)
  return formattedNumber + ' ' + currency
}

const CollectionList: FC<ICollectionListProps> = ({ setDisplayNumber, collectionRows }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"))
  const [currency, setCurrency] = useState('Erg')

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
      headerName: '7 Day Volume',
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

  const [apiRows, setApiRows] = useState(collectionRows) // use setApiRows when API call collects the data
  const [currentRows, setCurrentRows] = useState(apiRows) // use setCurrentRows to determine filtered data from sorting, searching, and filtering
  const [filteredRows, setFilteredRows] = useState(apiRows)
  const [searchedRows, setSearchedRows] = useState(apiRows)

  useEffect(() => {
    setApiRows(collectionRows)
  }, [collectionRows])
  
  const [sortModel, setSortModel] = useState<GridSortModel>([{
    field: 'rank',
    sort: 'asc'
  }]);

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
