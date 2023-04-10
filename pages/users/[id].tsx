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
  const { id } = router.query;
  const [tokensByAddress, setTokensByAddress] = useState<any[]>([])
  const [userProfile, setUserProfile] = useState(user);
  const [tabValue, setTabValue] = React.useState("on-sale");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const [loading, setLoading] = useState(true)
  const [loadingProfile, setLoadingProfile] = useState(true)


  const fetchData = async (id: string) => {
    setLoading(true)
    const mappedNfts = await getWalletData([id]);
    const mapped = mappedNfts.imgNfts.map((item, i) => {
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
        }
      )
    }) 
    setTokensByAddress(mapped)
    setLoading(false)
  }

  useEffect(() => {
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
            unmountOnExit
            mountOnEnter
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
          >
            <TabPanel value="owned" sx={customTabPanelSx}>
              {loading ? (
                <Grid
                  container
                  spacing={2}
                  columns={{ xs: 1, sm: 2, md: 3, lg: 3 , xl: 4  }}
                  sx={{ mb: "24px" }}
                >
                  {Array(10).map((_, i) => (
                    <Grid item xs={1} key={i}>
                      <LoadingCard />
                    </Grid>
                  ))}
                </Grid>
              ) :
                <TokenList
                  // loading={loading}
                  // loadingAmount={10}
                  nftListArray={tokensByAddress}
                  setDisplayNumber={setNumberNftsShowing}
                  notFullWidth
                />}
            </TabPanel>
          </Fade>
          {/* ACTIVITY TAB */}
          <Fade
            unmountOnExit
            mountOnEnter
            in={tabValue == "activity"}
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