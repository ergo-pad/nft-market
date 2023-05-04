import React, { FC, useState, useEffect, useContext } from 'react';
import {
  Grid,
  Button,
  useMediaQuery,
  DialogContent,
  DialogActions,
  Dialog,
  Typography,
  Box,
  CircularProgress,
  Divider
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import FilterOptions from "@components/FilterOptions";
import NftCard, { INftItem } from '@components/NftCard';
import BasicSearchBar from '@components/BasicSearchBar'
import SortBy from '@components/SortBy'
import LoadingCard from '@components/LoadingCard'
import SaleCard, { ISaleCardItem } from '@components/sales/SaleCard';
import { filterInit, IFilters } from '@components/FilterOptions';
import { ApiContext, IApiContext } from "@contexts/ApiContext";

export interface ISaleListProps {
  notFullWidth?: boolean;
  collection?: string;
  artistAddress?: string;
}

const searchAndFilterAndSortData = (filteredData: any[], search: string, searchKey: string, sortBy: string) => {
  let newData = filteredData
  console.log(filteredData)
  if (search) {
    newData = filteredData.filter(
      (item) => item[searchKey].toLowerCase().indexOf(search.toLowerCase()) > -1
    );
  }
  if (sortBy) {
    const sortDirection = sortBy.split('-')[1]
    const sortKey = sortBy.split('-')[0]
    if (sortDirection === 'asc') {
      newData = newData.sort((a, b) => {
        if (a[sortKey] < b[sortKey]) {
          return -1;
        }
        if (a[sortKey] > b[sortKey]) {
          return 1;
        }
        return 0;
      });
    }
    if (sortDirection === 'desc') {
      newData = newData.sort((a, b) => {
        if (a[sortKey] > b[sortKey]) {
          return -1;
        }
        if (a[sortKey] < b[sortKey]) {
          return 1;
        }
        return 0;
      });
    }
  }
  return newData;
};

const SaleList: FC<ISaleListProps> = ({ notFullWidth, collection, artistAddress }) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [rawData, setRawData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [sortBy, setSortBy] = useState('')
  const [searchString, setSearchString] = useState<string>('')
  const [displayedData, setDisplayedData] = useState<INftItem[]>([{ link: '', name: '', tokenId: '' }]) // data after search, sort, and filter
  const [localLoading, setLocalLoading] = useState(true)
  const [ready, setReady] = useState(false)
  const apiContext = useContext<IApiContext>(ApiContext);

  useEffect(() => {
    if (ready) {
      const sorted = searchAndFilterAndSortData(
        filteredData,
        searchString,
        'name',
        sortBy
      )
      setDisplayedData(sorted)
    }
  }, [filteredData, searchString, sortBy]);

  useEffect(() => {
    const fetchData = async () => {
      const saleList = await apiContext.api.get("/sale")
      let currentSales = saleList.data
        .filter((item: any) => item?.status === 'WAITING' || item?.status === 'LIVE')

      if (collection) {
        currentSales = currentSales.filter((item: any) => item?.collection.id === collection)
      }

      if (artistAddress) {
        currentSales = currentSales.filter((item: any) => item?.artist.address === artistAddress)
      }

      const displaySales = currentSales.map((item: any) => {
        return {
          imgUrl: item.packs[0].image,
          link: '/marketplace/sale/' + item.id,
          name: item.name,
          qtyRemaining: item.tokensTotal,
          qtyMinted: item.startingTokensTotal,
          price:
            item.packs[0].price[0].tokenId === "0000000000000000000000000000000000000000000000000000000000000000"
              ? Number((item.packs[0].price[0].amount * 0.000000001))
              : Number((item.packs[0].price[0].amount * 0.01).toFixed(2)),
          currency: item.packs[0].price[0].tokenId === "0000000000000000000000000000000000000000000000000000000000000000"
            ? 'Erg'
            : 'SigUSD',
          saleType: 'mint',
          collection: item.collection?.name,
          collectionId: item.collection?.id,
          artist: item.artist?.address,
          artistName: item.artist?.name,
          status: item.status
          // explicit: false,
          // type: '',
        }
      })
      setDisplayedData(displaySales)
      setRawData(displaySales)
      setFilteredData(displaySales)
      setLocalLoading(false)
    }
    fetchData();
    setReady(true)
  }, [])

  const handleDialogClick = () => {
    setFilterDialogOpen(true);
  };

  const handleDialogClose = () => {
    setFilterDialogOpen(false);
  };

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"))

  return (
    <>
      <Grid container sx={{ mb: 2 }} spacing={2}>
        <Grid item xs sm={7}>
          <BasicSearchBar searchString={searchString} setSearchString={setSearchString} />
        </Grid>
        {desktop && (
          <Grid item sm>
            <SortBy
              sortOption={sortBy}
              setSortOption={setSortBy}
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
            id="filter-dialog"
            keepMounted
            open={filterDialogOpen}
            onClose={handleDialogClose}
            rawData={rawData}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        columns={{ xs: 1, sm: 2, md: 3, lg: notFullWidth ? 3 : 4, xl: notFullWidth ? 4 : 5 }}
        sx={{ mb: "24px" }}
      >
        {localLoading ? (
          <Box sx={{ textAlign: 'center', py: '10vh', width: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          displayedData.length > 0 ? displayedData.map((item: any, i: number) => {
            return (
              <Grid key={i} item xs={1}>
                <SaleCard
                  cardData={item}
                />
              </Grid>
            )
          }) :
            <Box sx={{ textAlign: 'center', py: '10vh', width: '100%' }}>
              <Typography variant="h4" color="text.secondary">
                No tokens to display
              </Typography>
            </Box>
        )}
      </Grid>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
      </Box>
    </>
  )
}

interface FilterDialogProps {
  id: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value?: string) => void;
  rawData: INftItem[];
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  filteredData: any[];
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
}

const FilterDialog: FC<FilterDialogProps> = (props) => {
  const {
    onClose,
    open,
    rawData,
    sortBy,
    setSortBy,
    filteredData,
    setFilteredData,
    ...other
  } = props;
  const [localFilteredData, setLocalFilteredData] = useState(rawData);
  const [localSortOption, setLocalSortOption] = useState('')
  const [prevFilters, setPrevFilters] = useState<IFilters>(filterInit);
  const [filters, setFilters] = useState<IFilters>(filterInit);

  useEffect(() => {
    setLocalFilteredData(rawData)
    setFilters(filterInit)
    if (!desktop) {
      setSortBy('')
    }
  }, [rawData])

  const handleCancel = () => {
    setLocalFilteredData(filteredData)
    setFilters(prevFilters)
    if (!desktop) {
      setLocalSortOption(sortBy)
    }
    onClose();
  };

  const handleOk = () => {
    setFilteredData(localFilteredData)
    setPrevFilters(filters)
    if (!desktop) {
      setSortBy(localSortOption)
    }
    onClose();
  };

  const clearFilters = () => {
    setFilters(filterInit)
    if (!desktop) {
      setLocalSortOption('')
    }
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
        <FilterOptions
          data={rawData}
          filters={filters}
          setFilters={setFilters}
          filteredValues={localFilteredData}
          setFilteredValues={setLocalFilteredData}
        />
        {!desktop &&
          <>
            <Typography variant="h5" sx={{ mb: 0 }}>Sort</Typography>
            <Divider sx={{ mb: 2 }} />
            <SortBy
              sortOption={localSortOption}
              setSortOption={setLocalSortOption}
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

export default SaleList