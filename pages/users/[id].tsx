import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import { Typography, Box, useTheme, Fade } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { recentNfts } from "@components/placeholders/recentNfts";
import UserProfile from "@components/user/UserProfile";
import { useRouter } from "next/router";
import { ApiContext, IApiContext } from "@contexts/ApiContext";
import TokenList from "@components/TokenList";
import UsersTokenList from "@components/user/UsersTokenList";
import { getWalletList } from "@utils/assetsNew";

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
  const [userProfile, setUserProfile] = useState(user);
  const [tabValue, setTabValue] = React.useState("");
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [aggData, setAggData] = useState<any[]>([]);
  const [displayNumber, setDisplayNumber] = useState(12);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    const path = router.asPath.split("?")[0];
    router.push(path + `?tab=${newValue}`, undefined, { scroll: false });
    setTabValue(newValue);
  };

  useEffect(() => {
    if (tab) {
      setTabValue(tab.toString());
    } else if (router.isReady) setTabValue("on-sale");
  }, [router.isReady, router.query.tab]);

  const fetchData = async (id: string) => {
    const tokenList: any[] = await getWalletList([id]);
    setAggData(tokenList);
    setLoading(false);
  };

  useEffect(() => {
    const getUserProfile = async () => {
      setLoadingProfile(true);
      try {
        const res = await apiContext.api.get(`/user/${id}`);
        setUserProfile(res.data);
      } catch (e: any) {
        apiContext.api.error(e);
      }
      setLoadingProfile(false);
    };
    if (id) {
      getUserProfile();
      fetchData(id.toString());
    }
  }, [id]); // id is better named userAddress. Comes from the URL

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
          <Fade in={tabValue == "on-sale"}>
            <TabPanel value="on-sale" sx={customTabPanelSx}>
              <TokenList
                nftListArray={recentNfts}
                setDisplayNumber={setDisplayNumber}
                notFullWidth
              />
            </TabPanel>
          </Fade>
          {/* OWNED TAB */}
          <Fade in={tabValue == "owned"}>
            <TabPanel value="owned" sx={customTabPanelSx}>
              <UsersTokenList
                loading={loading}
                nftListArray={aggData}
                notFullWidth
              />
            </TabPanel>
          </Fade>
          {/* ACTIVITY TAB */}
          <Fade in={tabValue == "activity"}>
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
