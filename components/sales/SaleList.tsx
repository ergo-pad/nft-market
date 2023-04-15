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
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'
import LoadingCard from '@components/LoadingCard'
import SaleCard, { ISaleCardItem } from '@components/sales/SaleCard';
import { filterInit, IFilters } from '@components/FilterOptions';
import { ApiContext, IApiContext } from "@contexts/ApiContext";

export interface ISaleListProps {
  notFullWidth?: boolean;
}

const SaleList: FC<ISaleListProps> = ({ notFullWidth }) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [rawData, setRawData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [sortedData, setSortedData] = useState<any[]>([])
  const [searchedData, setSearchedData] = useState<any[]>([])
  const [mixedData, setMixedData] = useState<any[]>([])
  const [displayedData, setDisplayedData] = useState<ISaleCardItem[]>([]) // data after search, sort, and filter
  const [localLoading, setLocalLoading] = useState(true)
  const [disableFilters, setDisableFilters] = useState(true)
  const [vestingNfts, setVestingNfts] = useState<any[]>([])
  const apiContext = useContext<IApiContext>(ApiContext);

  useEffect(() => {
    const newData = filteredData.filter(o1 => searchedData.some(o2 => o1.tokenId === o2.tokenId))
    if (mixedData !== newData) setMixedData(newData)
  }, [filteredData, searchedData]);

  useEffect(() => {
    if (displayedData !== sortedData) setDisplayedData(sortedData)
  }, [sortedData]);

  const updateAllData = (data: any[]) => {
    setSearchedData(data)
    setFilteredData(data)
    setSortedData(data)
  }

  useEffect(() => {
    updateAllData(rawData)
  }, [rawData])

  useEffect(() => {
    const fetchData = async () => {
      const saleList = await apiContext.api.get("/sale")
      const currentSales = saleList.data
        .filter((item: any) => item?.status === 'WAITING' || item?.status === 'LIVE')
        .map((item: any) => {
          return {
            imgUrl: '',
            link: '/marketplace/sale/' + item.id,
            name: item.name,
            qtyRemaining: item.tokensTotal,
            qtyMinted: item.startingTokensTotal,
            price: 
              item.packs[0]?.price?.tokenId === "0000000000000000000000000000000000000000000000000000000000000000" 
                ? item.packs[0]?.price?.amount 
                : 0, // temporary, until we are certain how to derive price from any sale. 
            currency: 'Erg', // need to look up SigUSD option
            saleType: 'mint',
            collection: item.collection?.name,
            collectionId: item.collection?.id,
            artist: item.artist?.address,
            artistName: item.artist?.name,
            // explicit: false,
            // type: '',
          }
        })
      setDisplayedData(currentSales)
      updateAllData(currentSales)
      setRawData(currentSales)
      setLocalLoading(false)
    }
    fetchData();
    setDisableFilters(false)
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
          <SearchBar data={rawData} searchKey="name" setFilteredValue={setSearchedData} />
        </Grid>
        {desktop && (
          <Grid item sm>
            <SortBy
              inputData={mixedData}
              setSortedData={setSortedData}
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
            sortedData={sortedData}
            setSortedData={setSortedData}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            displayedData={displayedData}
            mixedData={mixedData}
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
  sortedData: any[];
  setSortedData: React.Dispatch<React.SetStateAction<any[]>>;
  filteredData: any[];
  setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
  displayedData: any[];
  mixedData: any[];
}

const FilterDialog: FC<FilterDialogProps> = (props) => {
  const {
    onClose,
    open,
    rawData,
    sortedData,
    setSortedData,
    filteredData,
    setFilteredData,
    displayedData,
    mixedData,
    ...other
  } = props;
  const [localFilteredData, setLocalFilteredData] = useState(rawData);
  const [localSortedData, setLocalSortedData] = useState<any[]>([])
  const [savedSortOption, setSavedSortOption] = useState('')
  const [sortOption, setSortOption] = useState('');
  const [prevFilters, setPrevFilters] = useState<IFilters>(filterInit);
  const [filters, setFilters] = useState<IFilters>(filterInit);

  useEffect(() => {
    setLocalFilteredData(rawData)
  }, [rawData])

  const handleCancel = () => {
    setLocalFilteredData(filteredData)
    setFilters(prevFilters)
    if (!desktop) {
      setLocalSortedData(sortedData)
      setSortOption(savedSortOption)
    }
    onClose();
  };

  const handleOk = () => {
    setFilteredData(localFilteredData)
    setPrevFilters(filters)
    if (!desktop) {
      setSavedSortOption(sortOption)
      setSortedData(localSortedData)
    }
    onClose();
    console.log(filters.price)
  };

  const clearFilters = () => {
    setFilters(filterInit)
    if (!desktop) {
      setSortOption('')
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
              inputData={mixedData}
              setSortedData={setLocalSortedData}
              controlledSortOption={sortOption}
              setControlledSortOption={setSortOption}
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

export default SaleList
