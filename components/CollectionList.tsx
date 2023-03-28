import React, { FC } from 'react';
import {
  Grid,
  Button,
  useMediaQuery,
  DialogContent,
  DialogActions,
  Dialog,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import FilterOptions from "@components/FilterOptions";
import NftCard, { INftItem } from '@components/NftCard';
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'
import { DataGrid, GridColDef, GridRenderCellParams  } from '@mui/x-data-grid';
import Link from '@components/Link'

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

const CollectionList: FC<ICollectionListProps> = ({ nftListArray, setDisplayNumber, notFullWidth }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"))
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [filterDialogvalue, setFilterDialogValue] = React.useState("What");

  const columns: GridColDef[] = [
    {
      field: 'rank',
      headerName: 'Rank',
      width: 90
    },
    {
      field: 'collection',
      headerName: 'Collection',
      renderCell: (params) => (
        <Link href={'/collections' + params.value.link}>{params.value.name}</Link>
      ),
      width: desktop ? 500 : 200,
    },
    {
      field: 'floorPrice',
      headerName: 'Floor Price',
      width: 100,
    },
    {
      field: 'volume',
      headerName: 'Volume',
      type: 'number',
      width: 110,
    },
    {
      field: 'items',
      headerName: 'Items',
      type: 'number',
      description: 'Number of unique items in this collection.',
      width: 160,
    },
    {
      field: 'owners',
      headerName: 'Owners',
      type: 'number',
      description: 'Number of wallets that hold at least one token.',
      width: 160,
    },
  ];

  const rows = [
    { id: 1, rank: 1, collection: {name: 'Wrath of Gods', link: '/wrath'}, floorPrice: 10, volume: 2103, items: 3000, owners: 1475 },
    { rank: 2, collection: {name: 'Cybercitizens', link: '/wrath'}, floorPrice: 15, volume: 3256, items: 5000, owners: 5 },
    { rank: 3, collection: {name: 'Ergnomes', link: '/wrath'}, floorPrice: 12, volume: 234, items: 280, owners: 22 },
    { rank: 4, collection: {name: 'Inferno Black', link: '/wrath'}, floorPrice: 100, volume: 666, items: 666, owners: 54 },
    { rank: 5, collection: {name: 'Space Farmers', link: '/wrath'}, floorPrice: 62, volume: 723, items: 15, owners: 888888 },
    { rank: 6, collection: {name: 'WalrusDAO', link: '/wrath'}, floorPrice: 13, volume: 845, items: 873, owners: 7377 },
    { rank: 7, collection: {name: 'Mutant Apes', link: '/wrath'}, floorPrice: 20, volume: 123, items: 653, owners: 26 },
    { rank: 8, collection: {name: 'ErgoPixels', link: '/wrath'}, floorPrice: 70, volume: 66, items: 54, owners: 12 },
    { rank: 9, collection: {name: 'Ergo Mummies', link: '/wrath'}, floorPrice: 45, volume: 2000, items: 100000, owners: 1475 },
    { rank: 10, collection: {name: 'Aneta Angels', link: '/wrath'}, floorPrice: 12, volume: 1000, items: 5444, owners: 43 },
    { rank: 11, collection: {name: 'Bitmasks', link: '/wrath'}, floorPrice: 450, volume: 1500, items: 2555555, owners: 70 },
    { rank: 12, collection: {name: 'Comet Degens', link: '/wrath'}, floorPrice: 28, volume: 16, items: 5252, owners: 7237 },
  ];

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


  return (
    <>
      <Grid container sx={{ mb: 2 }} spacing={2}>
        <Grid item xs sm={7}>
          <SearchBar />
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
      <Paper sx={{ height: '85vh', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          // initialState={{
          //   pagination: {
          //     paginationModel: {
          //       pageSize: 50,
          //     },
          //   },
          // }}
          getRowId={(row) => row.rank}
          // pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-row': {
              '&:hover': {
                background: theme.palette.divider,
                // cursor: 'pointer',
              }
            },
            '& .MuiDataGrid-cell': {
              '&:focus': {
                outline: 'none',
              }
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
