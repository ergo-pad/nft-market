import React, { FC, useState, useEffect, useRef, useContext } from 'react';
import type { NextPage } from 'next'
import {
  Grid,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
  Icon,
  Tooltip,
  Fade,
  Slide,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  IconButton,
  Divider
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { UserContext } from '@contexts/UserContext'
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterOptions from "@components/FilterOptions";
import { SxProps } from "@mui/material";
import NftCard from '@components/NftCard';
import { recentNfts } from '@components/placeholders/recentNfts'
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'
import { motion } from 'framer-motion'
import UserProfile from '@components/UserProfile';

///////////////////////////////////////////////////////////////////
// BEGIN PLACEHOLDER DATA /////////////////////////////////////////
const user = {
  address: '9asdfgEGZKHfKCUasdfvreqK6s6KiALNCFxojUa4Tbibw2Ajw1JFo',
  name: 'Eelon Musk',
  pfpUrl: '/images/users/eelon-musk.png',
  bannerUrl: undefined,
  tagline: 'A psychological phenomenon known as the mere exposure effect is where we develop a preference just because we are familiar with things.',
  socialLinks: []
}
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
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
}

const customTabPanelSx = {
  pt: '24px',
  minHeight: '50vh'
}

const User: NextPage = () => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const lessLg = useMediaQuery(theme.breakpoints.down('lg'))

  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [filterDialogvalue, setFilterDialogValue] = React.useState("Dione");
  const handleDialogClick = () => {
    setFilterDialogOpen(true);
  };
  const handleDialogClose = (newValue?: string) => {
    setFilterDialogOpen(false);
    if (newValue) {
      setFilterDialogValue(newValue);
    }
  };

  const [tabValue, setTabValue] = React.useState('on-sale');
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const [scrollY, setScrollY] = useState(0)
  const userProfileCard = useRef<HTMLDivElement>(null)
  const userProfileContainer = useRef<HTMLDivElement>(null)
  const handleScroll = () => {
    const scrollPos = window.scrollY - 216
    if (scrollPos > 0 && (userProfileCard.current !== null && userProfileContainer.current !== null)) {
      if (scrollPos < (userProfileContainer.current.clientHeight - userProfileCard.current.clientHeight)) {
        setScrollY(scrollPos)
      }
      else {
        setScrollY(userProfileContainer.current.clientHeight - userProfileCard.current.clientHeight)
      }
    }
    else {
      setScrollY(0)
    }
  }
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <UserProfile
        address={user.address}
        username={user.name}
        pfpUrl={user.pfpUrl}
        bannerUrl={user.bannerUrl}
        tagline={user.tagline}
        socialLinks={user.socialLinks ? user.socialLinks : []}
      >
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: '24px' }}>
              <TabList
                onChange={handleTabChange}
                aria-label="NFT Information Tabs"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab label="On Sale" value="on-sale" />
                <Tab label="Owned" value="owned" />
                <Tab label="Watch List" value="watch-list" />
                <Tab label="Activity" value="activity" />
              </TabList>
            </Box>
            <Grid container spacing={3}>
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
            {/* ON SALE TAB */}
            <Slide direction="up" in={tabValue == 'on-sale'} mountOnEnter unmountOnExit>
              <TabPanel value="on-sale" sx={customTabPanelSx}>
                <Grid
                  container
                  spacing={4}
                  columns={{ xs: 1, sm: 2, md: 3 }}
                  sx={{ mb: "24px" }}
                >
                  {recentNfts.map((props, i) => {
                    return (
                      <Grid key={i} item xs={1}>
                        <NftCard
                          key={i}
                          link={props.link}
                          imgUrl={props.imgUrl}
                          name={props.name}
                          price={props.price}
                          rarity={props.rarity}
                          time={props.time}
                          collection={props.collection}
                          collectionLink={props.collectionLink}
                          artist={props.artist}
                          artistLink={props.artistLink}
                          artistLogo={props.artistLogo}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Button variant="contained" sx={{}}>Load more...</Button>
                </Box>
              </TabPanel>
            </Slide>

            {/* OWNED TAB */}
            <Slide direction="up" in={tabValue == 'owned'} mountOnEnter unmountOnExit>
              <TabPanel value="owned" sx={customTabPanelSx}>
                <Grid
                  container
                  spacing={4}
                  columns={{ xs: 1, sm: 2, md: 3 }}
                  sx={{ mb: "24px" }}
                >
                  {recentNfts.map((props, i) => {
                    return (
                      <Grid key={i} item xs={1}>
                        <NftCard
                          key={i}
                          link={props.link}
                          imgUrl={props.imgUrl}
                          name={props.name}
                          price={props.price}
                          rarity={props.rarity}
                          time={props.time}
                          collection={props.collection}
                          collectionLink={props.collectionLink}
                          artist={props.artist}
                          artistLink={props.artistLink}
                          artistLogo={props.artistLogo}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Button variant="contained" sx={{}}>Load more...</Button>
                </Box>
              </TabPanel>
            </Slide>

            {/* WATCH LIST TAB */}
            <Slide direction="up" in={tabValue == 'watch-list'} mountOnEnter unmountOnExit>
              <TabPanel value="watch-list" sx={customTabPanelSx}>
                <Typography sx={{ mb: '24px' }}>
                  <Grid
                    container
                    spacing={4}
                    columns={{ xs: 1, sm: 2, md: 3 }}
                    sx={{ mb: "24px" }}
                  >
                    {recentNfts.map((props, i) => {
                      return (
                        <Grid key={i} item xs={1}>
                          <NftCard
                            key={i}
                            link={props.link}
                            imgUrl={props.imgUrl}
                            name={props.name}
                            price={props.price}
                            rarity={props.rarity}
                            time={props.time}
                            collection={props.collection}
                            collectionLink={props.collectionLink}
                            artist={props.artist}
                            artistLink={props.artistLink}
                            artistLogo={props.artistLogo}
                          />
                        </Grid>
                      )
                    })}
                  </Grid>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <Button variant="contained" sx={{}}>Load more...</Button>
                  </Box>                  </Typography>
              </TabPanel>
            </Slide>

            {/* ACTIVITY TAB */}
            <Slide direction="up" in={tabValue == 'activity'} mountOnEnter unmountOnExit>
              <TabPanel value="activity" sx={customTabPanelSx}>
                <Typography sx={{ mb: '24px' }}>
                  Past sales activity
                </Typography>
              </TabPanel>
            </Slide>
          </TabContext>
      </UserProfile>
    </>
  )
}

export default User
