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

///////////////////////////////////////////////////////////////////
// BEGIN PLACEHOLDER DATA /////////////////////////////////////////
const user = {
  address: '9asdfgEGZKHfKCUasdfvreqK6s6KiALNCFxojUa4Tbibw2Ajw1JFo',
  name: 'Eelon Musk',
  pfpUrl: '/images/users/eelon-musk.png',
  notifications: [
    {
      title: '',
      description: '',
      link: '',
      unread: false
    }
  ]
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

  const theme = useTheme()
  const [tabValue, setTabValue] = React.useState('info');

  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const [scrollY, setScrollY] = useState(0)
  const [positionFromTop, setPositionFromTop] = useState(0)
  const positionTop = useRef<HTMLInputElement>();

  useEffect(() => {
    positionTop.current && setPositionFromTop(positionTop.current.offsetTop)
    console.log(positionTop.current.getBoundingClientRect().offsetTop)
  }, [])

  const handleScroll = () => {
    const scrollPos = window.scrollY - positionFromTop
    console.log(scrollPos)
    console.log(positionFromTop)
    setScrollY(scrollPos)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  

  return (
    <>
      <Box sx={{
        height: '260px',
        overflow: 'hidden',
        display: 'block',
      }}>
        <Image src="/images/placeholder/6.jpg" layout="responsive" height={260} width="100vw" />
      </Box>
      <Container sx={{ my: '50px' }}>
        <Grid container>
          <Grid
            item
            lg={3}
            sx={{ pr: "24px", display: { xs: "none", lg: "block" } }}
          >
            <Box sx={{ position: 'relative', height: 'calc(100% + 100px)' }}>
              <motion.div
                animate={{
                  y: scrollY
                }}
                transition={{ type: "spring" }}
              >
                <Box sx={{ position: 'absolute', top: -100, height: '100%', width: '100%' }} ref={positionTop}>
                  <Paper
                    sx={{
                      p: '24px',
                      position: 'sticky',
                      top: 84,
                      width: '100%',
                      border: '1px solid',
                      borderColor: theme.palette.divider
                    }}
                  >
                    <Avatar
                      alt={user.name ? user.name : user.address}
                      src={user.pfpUrl ? user.pfpUrl : ''}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: '24px',
                        bgcolor: theme.palette.primary.main
                      }}
                    />
                    {user.name && <Typography
                      sx={{
                        fontSize: '1.2rem',
                        fontWeight: '700'
                      }}
                    >
                      {user.name}
                    </Typography>}

                  </Paper>
                </Box>
              </motion.div>
            </Box>
          </Grid>
          <Grid item lg={9} xs={12}>



            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: '24px' }}>
                <TabList
                  onChange={handleTabChange}
                  aria-label="NFT Information Tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                >
                  <Tab label="Information" value="info" />
                  <Tab label="Auction Info" value="auction" />
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
              {/* INFO TAB */}
              <Slide direction="up" in={tabValue == 'info'} mountOnEnter unmountOnExit>
                <TabPanel value="info" sx={customTabPanelSx}>
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

              {/* AUCTION TAB */}
              <Slide direction="up" in={tabValue == 'auction'} mountOnEnter unmountOnExit>
                <TabPanel value="auction" sx={customTabPanelSx}>

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
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default User
