import React, { FC, useState, useMemo, useEffect, useContext } from 'react';
import {
  Grid,
  Button,
  useMediaQuery,
  DialogContent,
  DialogActions,
  Dialog,
  Typography,
  Box,
  Divider
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import FilterOptions from "@components/FilterOptions";
import NftCard, { INftItem } from '@components/NftCard';
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'
import LoadingCard from '@components/LoadingCard'
import { filterInit, IFilters } from '@components/FilterOptions';
import { recentNfts } from "@components/placeholders/recentNfts";
import UserProfile from "@components/UserProfile";
import { useRouter } from "next/router";
import { ApiContext, IApiContext } from "@contexts/ApiContext";
import { getWalletData } from "@utils/assets";
import { WalletContext } from "@contexts/WalletContext";

export interface ITokenListProps {
  userId: string;
  setDisplayNumber: React.Dispatch<React.SetStateAction<number>>;
  notFullWidth?: boolean;
}

const TokenList: FC<ITokenListProps> = ({ userId, setDisplayNumber, notFullWidth }) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [rawData, setRawData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState(rawData)
  const [sortedData, setSortedData] = useState(rawData)
  const [searchedData, setSearchedData] = useState(rawData)
  const [mixedData, setMixedData] = useState(rawData)
  const [displayedData, setDisplayedData] = useState<INftItem[]>([]) // data after search, sort, and filter
  const [imgNfts, setImgNfts] = useState<any[]>([])
  const [audioNfts, setAudioNfts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const {
    walletAddress,
    dAppWallet,
  } = useContext(WalletContext);
  const apiContext = useContext<IApiContext>(ApiContext);

  useEffect(() => {
    setMixedData(filteredData.filter(o1 => searchedData.some(o2 => o1.tokenId === o2.tokenId)))
  }, [filteredData, searchedData]);

  useEffect(() => {
    setDisplayedData(sortedData)
  }, [sortedData]);

  useEffect(() => {
    setRawData([...imgNfts, ...audioNfts])
    setFilteredData([...imgNfts, ...audioNfts])
    setSearchedData([...imgNfts, ...audioNfts])
    setSortedData([...imgNfts, ...audioNfts])
    setLoading(false)
  }, [imgNfts, audioNfts])

  const displayMore = () => {
    setDisplayNumber((prev: number) => prev + 12)
  }

  const handleDialogClick = () => {
    setFilterDialogOpen(true);
  };

  const handleDialogClose = () => {
    setFilterDialogOpen(false);
  };

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("sm"))

  const fetchData = async (id: string) => {
    setLoading(true)
    const mappedNfts = await getWalletData([id]);
    const imgNfts = mappedNfts.imgNfts.map((item, i) => {
      return (
        {
          imgUrl: item.r9,
          link: '/marketplace/' + item.id,
          name: item.name,
          tokenId: item.id,
          qty: 1,
          // price: 1,
          // currency: '',
          // rarity: '',
          // saleType: 'mint' | 'auction' | 'sale',
          collection: '',
          collectionLink: '',
          artist: '',
          artistLink: '',
          bx: item.bx
        }
      )
    })
    const audioNfts = mappedNfts.audioNfts.map((item, i) => {
      return (
        {
          imgUrl: item.r9,
          link: '/marketplace/' + item.id,
          name: item.name,
          tokenId: item.id,
          qty: 1,
          // price: 1,
          // currency: '',
          // rarity: '',
          // saleType: 'mint' | 'auction' | 'sale',
          collection: '',
          collectionLink: '',
          artist: '',
          artistLink: '',
          bx: item.bx,
          type: item.type
        }
      )
    })
    setImgNfts(imgNfts)
    setAudioNfts(audioNfts)
  }

  const getVestedTokens = async (id: string) => {
    let addressArray = []
    if (id) {
      addressArray = [id]
      if (dAppWallet.addresses.length > 0) {
        if (dAppWallet.addresses.includes(id)) addressArray = dAppWallet.addresses
      }
      try {
        const res = await apiContext.api.post(
          `/vesting/v2/`,
          { addresses: addressArray },
          process.env.ERGOPAD_API
        );
        console.log(res.data)
      } catch (e: any) {
        apiContext.api.error(e);
      }
    }
  };

  useEffect(() => {
    fetchData(userId)
    getVestedTokens(userId)
  }, [userId])

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
        {loading ? (
          Array(10).fill(
            <Grid item xs={1}>
              <LoadingCard />
            </Grid>
          )
        ) : (
          displayedData.length > 0 ? displayedData.map((item: any, i: number) => {
            return (
              <Grid key={i} item xs={1}>
                <NftCard
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

export default TokenList
