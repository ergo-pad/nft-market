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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterOptions from "@components/FilterOptions";
import NftCard from "@components/NftCard";
import { recentNfts } from "@components/placeholders/recentNfts";
import SearchBar from "@components/SearchBar";
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

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

const ConfirmationDialogRaw: FC<ConfirmationDialogRawProps> = (props) => {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = useState(valueProp);
  const radioGroupRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          background: "rgb(14, 20, 33)",
          width: "100%",
          maxWidth: "400px",
          maxHeight: "80vh",
        },
      }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      <DialogTitle>Filter &amp; Sort</DialogTitle>
      <DialogContent dividers>
        <SortBy sx={{ mb: "24px" }} />
        <FilterOptions />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
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

  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [filterDialogvalue, setFilterDialogValue] = React.useState("Dione");
  const [userProfile, setUserProfile] = useState(user);

  const handleDialogClick = () => {
    setFilterDialogOpen(true);
  };
  const handleDialogClose = (newValue?: string) => {
    setFilterDialogOpen(false);
    if (newValue) {
      setFilterDialogValue(newValue);
    }
  };

  const [tabValue, setTabValue] = React.useState("on-sale");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const [scrollY, setScrollY] = useState(0);
  const userProfileCard = useRef<HTMLDivElement>(null);
  const userProfileContainer = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const scrollPos = window.scrollY - 216;
    if (
      scrollPos > 0 &&
      userProfileCard.current !== null &&
      userProfileContainer.current !== null
    ) {
      if (
        scrollPos <
        userProfileContainer.current.clientHeight -
        userProfileCard.current.clientHeight
      ) {
        setScrollY(scrollPos);
      } else {
        setScrollY(
          userProfileContainer.current.clientHeight -
          userProfileCard.current.clientHeight
        );
      }
    } else {
      setScrollY(0);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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

  const SearchAndFilter: FC = () => {
    return (
      <Grid container spacing={3} sx={{ mb: '24px' }}>
        {useMediaQuery(theme.breakpoints.up("lg")) ? (
          <>
            <Grid item md={7}>
              <SearchBar />
            </Grid>
            <Grid item md={5}>
              <SortBy />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs>
              <SearchBar />
            </Grid>
            <Grid item xs="auto">
              <Button
                sx={{ height: "100%" }}
                variant="outlined"
                aria-label="filter"
                onClick={handleDialogClick}
              >
                <FilterAltIcon />
              </Button>
              <ConfirmationDialogRaw
                id="ringtone-menu"
                keepMounted
                open={filterDialogOpen}
                onClose={handleDialogClose}
                value={filterDialogvalue}
              />
            </Grid>
          </>
        )}
      </Grid>
    )
  }

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
