import React, { FC, useState, useContext, useEffect } from 'react';
import {
  Grid,
  Button,
  useMediaQuery,
  DialogContent,
  DialogActions,
  Dialog,
  Typography,
  Box,
  Divider,
  CircularProgress
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import FilterOptions from "@components/FilterOptions";
import NftCardTest, { INftItem } from '@components/NftCardTest';
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'
import LoadingCard from '@components/LoadingCard'
import { filterInit, IFilters } from '@components/FilterOptions';
import { WalletContext } from "@contexts/WalletContext";
import { ApiContext, IApiContext } from "@contexts/ApiContext";
import { tokenListInfo } from '@utils/assetsNew';

export interface ITokenListProps {
  nftListArray: any[];
  notFullWidth?: boolean;
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  loadingAmount?: number;
}

const TokenList: FC<ITokenListProps> = ({ nftListArray, notFullWidth, loading, setLoading, loadingAmount }) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [rawData, setRawData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [sortedData, setSortedData] = useState<any[]>([])
  const [searchedData, setSearchedData] = useState<any[]>([])
  const [mixedData, setMixedData] = useState<any[]>([])
  const [displayedData, setDisplayedData] = useState<INftItem[]>([]) // data after search, sort, and filter
  const [localLoading, setLocalLoading] = useState(true)
  const [disableFilters, setDisableFilters] = useState(true)
  const { walletAddress, dAppWallet } = useContext(WalletContext);
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
    const list = nftListArray.map((item, i) => {
      return {
        name: item.name,
        link: '/marketplace/' + item.tokenId,
        tokenId: item.tokenId,
        qty: item.amount,
        loading: true
      }
    })
    setDisplayedData(list)
    updateAllData(list)
    setRawData(list)

    if (!loading) setLocalLoading(false)
    async function fetchData() {
      const chunks = chunkArray(list, 8);
      for (const chunk of chunks) {
        await fetchDataChunk(chunk);
      }
    }

    async function fetchDataChunk(chunk: any) {
      const additionalData = await tokenListInfo(chunk);
      setRawData(prevState => {
        const newList = prevState.map(item => {
          const apiItem = additionalData.find(apiItem => apiItem.tokenId === item.tokenId);
          return apiItem ? { ...item, ...apiItem } : item;
        });
        return newList;
      });
    }

    fetchData();
    setDisableFilters(false)
  }, [nftListArray])

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
        {loading || localLoading ? (
          <Box sx={{ textAlign: 'center', py: '10vh', width: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          displayedData.length > 0 ? displayedData.map((item: any, i: number) => {
            return (
              <Grid key={i} item xs={1}>
                <NftCardTest
                  nftData={item}
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
    setFilters(filterInit)
    if (!desktop) {
      setSortOption('')
    }
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

export default TokenList

const chunkArray = (array: any[], chunkSize: number) => {
  return Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, index) => {
    const start = index * chunkSize;
    const end = start + chunkSize;
    return array.slice(start, end);
  });
}