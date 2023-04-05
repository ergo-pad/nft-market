import React, { FC, useState, useEffect, useRef, useContext, useMemo } from "react";
import type { NextPage } from "next";
import {
  Grid,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Slide,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Fade
} from "@mui/material";
import LoadingTokenList from '@components/LoadingTokenList'
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import FilterOptions from "@components/FilterOptions";
import { recentNfts } from "@components/placeholders/recentNfts";
import SortBy from "@components/SortBy";
import UserProfile from "@components/UserProfile";
import { useRouter } from "next/router";
import { ApiContext, IApiContext } from "@contexts/ApiContext";
import TokenList from "@components/TokenList";
import { getWalletData, IToken, IAssetList, resolveIpfs } from "@utils/assets";
import { INftItem } from "@components/NftCard";
import { getArtist } from "@utils/get-artist";

///////////////////////////////////////////////////////////////////
// BEGIN PLACEHOLDER DATA /////////////////////////////////////////
const user = {
  address: "",
  name: "",
  pfpUrl: "",
  bannerUrl: undefined,
  tagline: "",
  socials: [],
};
// END PLACEHOLDER DATA ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////

/*
export interface INftItem {
  imgUrl?: string;
  link: string;
  name: string;
  tokenId: string;
  qty?: number;
  price?: number;
  currency?: string;
  rarity?: string;
  saleType?: 'mint' | 'auction' | 'sale';
  collection?: string;
  collectionLink?: string;
  artist: string;
  artistLink: string;
}


{
    "name": "Ergnome #866 Gelatoswap the Tasty Fairy",
    "ch": 629824,
    "description": "\u0003{\"721\":{\"ergnomes-866\":{\"image\":\"https://ipfs.io/ipfs/QmYyazkdQqdc5pxpj6zZt8iRuLZCSFs2wQWFxxw79H2h7u/389_Gelatoswap-the-tasty-fairy4.png\",\"index\":389,\"series\":2,\"name\":\"Gelatoswap the Tasty Fairy\",\"description\":\"She changes flavour depending on the quality of the coins traded in her DEX-cup: colourful when good, brown when... less good. \",\"type\":\"Pet\",\"sex\":\"Male\",\"rarity\":\"Uncommon-Choco\",\"tribe\":\"Sylvan\",\"traits\":[\"Choco\",\"Choco\",\"Fruity\"],\"variety\":8}}}",
    "r7": "0e020101",
    "r9": "https://ipfs.io/ipfs/QmYyazkdQqdc5pxpj6zZt8iRuLZCSFs2wQWFxxw79H2h7u/389_Gelatoswap-the-tasty-fairy4.png",
    "r5": "\u0003{\"721\":{\"ergnomes-866\":{\"image\":\"https://ipfs.io/ipfs/QmYyazkdQqdc5pxpj6zZt8iRuLZCSFs2wQWFxxw79H2h7u/389_Gelatoswap-the-tasty-fairy4.png\",\"index\":389,\"series\":2,\"name\":\"Gelatoswap the Tasty Fairy\",\"description\":\"She changes flavour depending on the quality of the coins traded in her DEX-cup: colourful when good, brown when... less good. \",\"type\":\"Pet\",\"sex\":\"Male\",\"rarity\":\"Uncommon-Choco\",\"tribe\":\"Sylvan\",\"traits\":[\"Choco\",\"Choco\",\"Fruity\"],\"variety\":8}}}",
    "ext": ".png",
    "token": "ERG",
    "id": "91387b9800730a4a84d1e060dacbab51848e8aa27b4f7e710c1c2acf89624957",
    "amount": 1,
    "amountUSD": ""
}

*/


const customTabPanelSx = {
  pt: "24px",
  minHeight: "50vh",
};

const User: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const apiContext = useContext<IApiContext>(ApiContext);
  const { id } = router.query;
  const [tokensByAddress, setTokensByAddress] = useState<any[] | undefined>(undefined)

  const [userProfile, setUserProfile] = useState(user);

  const [tabValue, setTabValue] = React.useState("on-sale");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  // const getArtist = async (data: any[]) => {
  //   const artistInfo = await getArtist(data)
  //   return artistInfo
  // }

  const [loading, setLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)


  const fetchData = async (id: string) => {
    setLoading(true)
    const mappedNfts = await getWalletData([id]);

    const mapped = mappedNfts ? mappedNfts.imgNfts.map((item, i) => {
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
    }) : []; // Check if mappedNfts is undefined and provide a default value, e.g., an empty array
    setTokensByAddress(mapped)
    setLoading(false)
  }

  useMemo(() => {
    const getUserProfile = async () => {
      setLoadingProfile(true)
      try {
        const res = await apiContext.api.get(`/user/${id}`);
        setUserProfile(res.data);
      } catch (e: any) {
        apiContext.api.error(e);
      }
      setLoadingProfile(false)
    };
    if (id) {
      getUserProfile();
      fetchData(id.toString())
    }
  }, [id]);

  // LOADING TEST
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setLoadingProfile(prevLoading => !prevLoading);
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  /////////////////////////////////////////////////////////////////////////////
  // USE THIS FOR API CALL TO FETCH MORE CARDS IF ONLY LOADING A FEW AT A TIME
  // CURRENTLY NOT USED
  // CAN BE CHANGED IN <TokenList>
  const [numberNftsShowing, setNumberNftsShowing] = useState(24)
  /////////////////////////////////////////////////////////////////////////////

  const [containerHeight, setContainerHeight] = useState(0);
  const containerRefLoading = useRef<HTMLDivElement>(null);
  const containerRefLoaded = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading && containerRefLoading.current) {
      console.log("loading: " + containerRefLoading.current.offsetHeight)
      setContainerHeight(containerRefLoading.current.offsetHeight);
    }
    if (!loading && containerRefLoaded.current) {
      console.log("loaded: " + containerRefLoaded.current.offsetHeight)
      setContainerHeight(containerRefLoaded.current.offsetHeight);
    }

    const timer = setTimeout(() => {
      if (containerRefLoaded.current) setContainerHeight(containerRefLoaded.current.offsetHeight);
    }, 1000);

    // Clean up the timer on unmount
    return () => clearTimeout(timer);
  }, [loading, containerRefLoaded?.current?.offsetHeight, tabValue]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRefLoaded.current) {
        setContainerHeight(containerRefLoaded.current.offsetHeight);
      }
      const timer = setTimeout(() => {
        if (containerRefLoaded.current) setContainerHeight(containerRefLoaded.current.offsetHeight);
      }, 1000);
  
      // Clean up the timer on unmount
      return () => clearTimeout(timer);
    };
  
    window.addEventListener("resize", handleResize);
  
    // cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [containerRefLoading.current, containerRefLoaded.current]);

  return (
    <>
      <UserProfile
        address={userProfile.address}
        username={userProfile.name}
        pfpUrl={userProfile.pfpUrl}
        bannerUrl={userProfile.bannerUrl}
        tagline={userProfile.tagline}
        socialLinks={userProfile.socials ?? []}
        loading={loadingProfile}
      >
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
              aria-label="NFT Information Tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="On Sale" value="on-sale" />
              <Tab label="Owned" value="owned" />
              <Tab label="Activity" value="activity" />
            </TabList>
          </Box>

          {/* ON SALE TAB */}
          <Slide
            direction="up"
            in={tabValue == "on-sale"}
          >
            <TabPanel value="on-sale" sx={customTabPanelSx}>
              <TokenList
                nftListArray={recentNfts}
                setDisplayNumber={setNumberNftsShowing}
                notFullWidth
              />
            </TabPanel>
          </Slide>
          {/* OWNED TAB */}
          <Slide
            direction="up"
            in={tabValue == "owned"}
          >
            <TabPanel value="owned" sx={customTabPanelSx}>
              <Box sx={{
                position: "relative",
                height: containerHeight
              }}>
                <Box
                  sx={{
                    ...fadeInAndOut,
                    opacity: loading ? 1 : 0
                  }}
                >
                  <Box sx={{ height: 'auto' }} ref={containerRefLoading} className="loading">
                    <LoadingTokenList
                      notFullWidth
                      numberToDisplay={8}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    ...fadeInAndOut,
                    opacity: loading ? 0 : 1
                  }}
                >
                  {tokensByAddress &&
                    <Box ref={containerRefLoaded} sx={{ height: 'auto' }} className="loaded">
                      <TokenList
                        nftListArray={tokensByAddress}
                        setDisplayNumber={setNumberNftsShowing}
                        notFullWidth
                      />
                    </Box>
                  }
                </Box>
              </Box>
            </TabPanel>
          </Slide>
          {/* ACTIVITY TAB */}
          <Slide
            direction="up"
            in={tabValue == "activity"}
          >
            <TabPanel value="activity" sx={customTabPanelSx}>
              <Typography sx={{ mb: "24px" }}>Past sales activity</Typography>
            </TabPanel>
          </Slide>
        </TabContext>
      </UserProfile>
    </>
  );
};

export default User;

const fadeInAndOut = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  transition: "opacity 0.5s ease-in-out"
}