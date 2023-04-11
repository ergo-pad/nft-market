import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import {
  Grid,
  Typography,
  Box,
  useTheme,
  Fade
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { recentNfts } from "@components/placeholders/recentNfts";
import UserProfile from "@components/UserProfile";
import { useRouter } from "next/router";
import { ApiContext, IApiContext } from "@contexts/ApiContext";
import TokenList from "@components/TokenList";
import { getWalletData } from "@utils/assets";
import LoadingCard from '@components/LoadingCard'
import { WalletContext } from "@contexts/WalletContext";

const user = {
  address: "",
  name: "",
  pfpUrl: "",
  bannerUrl: undefined,
  tagline: "",
  socials: [],
};

const customTabPanelSx = {
  pt: "24px",
  minHeight: "50vh",
};

const User: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const apiContext = useContext<IApiContext>(ApiContext);
  const { id, tab } = router.query;
  const [imgNfts, setImgNfts] = useState<any[]>([])
  const [audioNfts, setAudioNfts] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState(user);
  const [tabValue, setTabValue] = React.useState('');
  const [loading, setLoading] = useState(true)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const {
    walletAddress,
    dAppWallet,
  } = useContext(WalletContext);
  const [aggData, setAggData] = useState<any[]>([])

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    const path = router.asPath.split("?")[0];
    router.push(path + `?tab=${newValue}`);
    setTabValue(newValue);
  };

  useEffect(() => {
    if (tab) {
      setTabValue(tab.toString());
    }
    else if (router.isReady) setTabValue('on-sale')
  }, [router.isReady, router.query.tab]);

  useEffect(() => {
    setAggData([...imgNfts, ...audioNfts])
  }, [audioNfts, imgNfts])

  const fetchData = async (id: string) => {
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
    setLoading(false)
  }

  // const vestedTokensNFTResponse = await axios
  //   .post(
  //     `${process.env.API_URL}/vesting/v2/`,
  //     { addresses: [...addresses] },
  //     { ...defaultOptions }
  //   )
  //   .catch((e) => {
  //     console.log('ERROR FETCHING', e);
  //     return {
  //       data: [],
  //     };
  //   });
  // setVestedTokensNFT(vestedTokensNFTResponse.data);

  const getVestedTokens = async (id: string) => {
    let addressArray = []
    if (id) {
      addressArray = [id.toString()]
      if (dAppWallet.addresses.length > 0) {
        if (dAppWallet.addresses.includes(id.toString())) addressArray = [dAppWallet.addresses]
      }
      try {
        const res = await apiContext.api.post(
          `/vesting/v2/`,
          { addresses: addressArray },
          process.env.ERGOPAD_API
        );
        console.log(res.data)
      } catch (e: any) {
        console.log(e)
        apiContext.api.error(e);
      }
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      setLoadingProfile(true)
      try {
        const res = await apiContext.api.get(`/user/${id}`);
        setUserProfile(res.data);
      } catch (e: any) {
        console.log(e)
        apiContext.api.error(e);
      }
      setLoadingProfile(false)
    };
    if (id) {
      getUserProfile();
      fetchData(id.toString())
      getVestedTokens(id.toString())
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
              <Tab label="On Sale" value="on-sale" key="on-sale" />
              <Tab label="Owned" value="owned" key="owned" />
              <Tab label="Activity" value="activity" key="activity" />
            </TabList>
          </Box>

          {/* ON SALE TAB */}
          <Fade
            in={tabValue == "on-sale"}
            mountOnEnter
            unmountOnExit
          >
            <TabPanel value="on-sale" sx={customTabPanelSx}>
              <TokenList
                nftListArray={recentNfts}
                setDisplayNumber={setNumberNftsShowing}
                notFullWidth
              />
            </TabPanel>
          </Fade>
          {/* OWNED TAB */}
          <Fade
            in={tabValue == "owned"}
            mountOnEnter
            unmountOnExit
          >
            <TabPanel value="owned" sx={customTabPanelSx}>
              <TokenList
                loading={loading}
                setLoading={setLoading}
                loadingAmount={10}
                nftListArray={aggData}
                setDisplayNumber={setNumberNftsShowing}
                notFullWidth
              />
            </TabPanel>
          </Fade>
          {/* ACTIVITY TAB */}
          <Fade
            in={tabValue == "activity"}
            mountOnEnter
            unmountOnExit
          >
            <TabPanel value="activity" sx={customTabPanelSx}>
              <Typography sx={{ mb: "24px" }}>Past sales activity</Typography>
            </TabPanel>
          </Fade>
        </TabContext>
      </UserProfile>
    </>
  );
};

export default User;