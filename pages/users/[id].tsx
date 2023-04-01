import React, { FC, useState, useEffect, useRef, useContext } from "react";
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

const customTabPanelSx = {
  pt: "24px",
  minHeight: "50vh",
};

const User: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const apiContext = useContext<IApiContext>(ApiContext);
  const { id } = router.query;

  const [userProfile, setUserProfile] = useState(user);

  const [tabValue, setTabValue] = React.useState("on-sale");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await apiContext.api.get(`/user/${id}`);
        setUserProfile(res.data);
      } catch (e: any) {
        apiContext.api.error(e);
      }
    };
    if (id) getUserProfile();
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
          </Slide>
          {/* OWNED TAB */}
          <Slide
            direction="up"
            in={tabValue == "owned"}
            mountOnEnter
            unmountOnExit
          >
            <TabPanel value="owned" sx={customTabPanelSx}>
              <TokenList
                nftListArray={recentNfts}
                setDisplayNumber={setNumberNftsShowing}
                notFullWidth
              />
            </TabPanel>
          </Slide>
          {/* ACTIVITY TAB */}
          <Slide
            direction="up"
            in={tabValue == "activity"}
            mountOnEnter
            unmountOnExit
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
