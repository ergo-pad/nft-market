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
  CircularProgress
} from "@mui/material";
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
  address: "9asdfgEGZKHfKCUasdfvreqK6s6KiALNCFxojUa4Tbibw2Ajw1JFo",
  name: "Eelon Musk",
  pfpUrl: "/images/users/eelon-musk.png",
  bannerUrl: undefined,
  tagline:
    "A psychological phenomenon known as the mere exposure effect is where we develop a preference just because we are familiar with things.",
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

  const [loading, setLoading] = useState(false)

  useMemo(() => {
    const getUserProfile = async () => {
      try {
        const res = await apiContext.api.get(`/user/${id}`);
        setUserProfile(res.data);
      } catch (e: any) {
        apiContext.api.error(e);
      }
    };
    if (id) {
      getUserProfile();
      fetchData(id.toString())
    }
  }, [id]);

  // USE THIS FOR API CALL TO KNOW THE NUMBER OF NFT CARDS TO FETCH
  // CAN BE CHANGED IN <TokenList>
  const [numberNftsShowing, setNumberNftsShowing] = useState(24)

  return (
    <>
      <UserProfile
        address={userProfile.address}
        username={userProfile.name}
        pfpUrl={userProfile.pfpUrl}
        bannerUrl={userProfile.bannerUrl}
        tagline={userProfile.tagline}
        socialLinks={userProfile.socials ?? []}
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
              {tokensByAddress && loading === false ? (
                <>
                  <TokenList
                    nftListArray={tokensByAddress}
                    setDisplayNumber={setNumberNftsShowing}
                    notFullWidth
                  />
                </>
              ) : (
                <CircularProgress />
              )}
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
