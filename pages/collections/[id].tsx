import React, { FC, useState, useEffect, useRef, useContext } from "react";
import type { NextPage } from "next";
import {
  // Grid,
  // Typography,
  Box,
  useTheme,
  // useMediaQuery,
  Slide,
  // Button,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import FilterOptions from "@components/FilterOptions";
import { recentNfts } from "@components/placeholders/recentNfts";
// import SearchBar from "@components/SearchBar";
// import SortBy from "@components/SortBy";
import CollectionProfile from "@components/collections/CollectionProfile";
import { useRouter } from "next/router";
import { ApiContext, IApiContext } from "@contexts/ApiContext";
import { ICollectionProfileProps } from "@components/collections/CollectionProfile";
import Properties from "@components/collections/Properties";
import { v4 as uuidv4 } from 'uuid';
import CollectionActivity, { ICollectionActivity } from "@components/collections/CollectionActivity";
import TokenList from "@components/TokenList";
import { ICollectionTraits, ICollectionRarities } from "@components/collections/Properties";

///////////////////////////////////////////////////////////////////
// BEGIN PLACEHOLDER DATA /////////////////////////////////////////
const collection: ICollectionProfileProps = {
  address: "9asdfgEGZKHfKCUasdfvreqK6s6KiALNCFxojUa4Tbibw2Ajw1JFo",
  collectionName: "Ergopad NFTs",
  collectionLogo: "/images/collections/ergopad-logo.jpg",
  bannerUrl: undefined,
  description: "A psychological phenomenon known as the mere exposure effect is where we develop a preference just because we are familiar with things.",
  socialLinks: [],
  category: '',
  website: 'http://ergopad.io',
};
const collectionTraits: ICollectionTraits[] = [
  {
    traitName: 'Level',
    id: uuidv4(),
    type: 'Level',
    max: 200
  },
  {
    traitName: 'Speed',
    id: uuidv4(),
    type: 'Stat',
  },
  {
    traitName: 'Color',
    id: uuidv4(),
    type: 'Property',
    options: [
      {
        property: 'Red',
        amount: 631
      },
      {
        property: 'Green',
        amount: 225
      },
      {
        property: 'Blue',
        amount: 67
      },
      {
        property: 'Purple',
        amount: 12
      }
    ]
  },
];
const collectionRarities: ICollectionRarities[] = [
  {
    rarity: 'Common',
    amount: 1605
  },
  {
    rarity: 'Uncommon',
    amount: 842
  },
  {
    rarity: 'Rare',
    amount: 320
  },
  {
    rarity: 'Legendary',
    amount: 16
  }
];
const activities: ICollectionActivity[] = [
  {
    tokenImageUrl: '/images/character1.png',
    tokenName: 'Blockheads 3 pack',
    tokenUrl: '',
    collectionName: 'Ergopad NFTs',
    collectionUrl: '/collections/ergopad-nfts',
    initiatorAvatarUrl: '/images/character4.png',
    initiatorUsername: 'Phil',
    initiatorAddress: 'address',
    action: 'purchased',
    date: new Date(1678521600000),
    transactionUrl: 'https://explorer.ergoplatform.com/en/transactions/878e006879bac87cf1b1a46be411f323489de68d67821a227851dc95f6a9e2e1'
  },
  {
    tokenImageUrl: '/images/character1.png',
    tokenName: 'Blockheads 3 pack',
    tokenUrl: '',
    collectionName: 'Ergopad NFTs',
    collectionUrl: '/collections/ergopad-nfts',
    initiatorAvatarUrl: '/images/character2.png',
    initiatorUsername: 'John',
    initiatorAddress: 'address',
    action: 'opened',
    date: new Date(1678701600000),
    transactionUrl: 'https://explorer.ergoplatform.com/en/transactions/878e006879bac87cf1b1a46be411f323489de68d67821a227851dc95f6a9e2e1'
  },
  {
    tokenImageUrl: '/images/character1.png',
    tokenName: 'Blockheads 3 pack',
    tokenUrl: '',
    collectionName: 'Ergopad NFTs',
    collectionUrl: '/collections/ergopad-nfts',
    initiatorAvatarUrl: '/images/users/alone-musk.png',
    initiatorUsername: 'Alice',
    initiatorAddress: 'address',
    action: 'created',
    date: new Date(1678608000000),
    transactionUrl: 'https://explorer.ergoplatform.com/en/transactions/878e006879bac87cf1b1a46be411f323489de68d67821a227851dc95f6a9e2e1'
  },
];
// END PLACEHOLDER DATA ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////

// export interface ConfirmationDialogRawProps {
//   id: string;
//   keepMounted: boolean;
//   value: string;
//   open: boolean;
//   onClose: (value?: string) => void;
// }

// const ConfirmationDialogRaw: FC<ConfirmationDialogRawProps> = (props) => {
//   const { onClose, value: valueProp, open, ...other } = props;
//   const [value, setValue] = useState(valueProp);
//   const radioGroupRef = useRef<HTMLElement>(null);

//   useEffect(() => {
//     if (!open) {
//       setValue(valueProp);
//     }
//   }, [valueProp, open]);

//   const handleEntering = () => {
//     if (radioGroupRef.current != null) {
//       radioGroupRef.current.focus();
//     }
//   };

//   const handleCancel = () => {
//     onClose();
//   };

//   const handleOk = () => {
//     onClose(value);
//   };

//   return (
//     <Dialog
//       sx={{
//         "& .MuiDialog-paper": {
//           background: "rgb(14, 20, 33)",
//           width: "100%",
//           maxWidth: "400px",
//           maxHeight: "80vh",
//         },
//       }}
//       maxWidth="xs"
//       TransitionProps={{ onEntering: handleEntering }}
//       open={open}
//       {...other}
//     >
//       <DialogTitle>Filter &amp; Sort</DialogTitle>
//       <DialogContent dividers>
//         <SortBy sx={{ mb: "24px" }} />
//         <FilterOptions />
//       </DialogContent>
//       <DialogActions>
//         <Button autoFocus onClick={handleCancel}>
//           Cancel
//         </Button>
//         <Button onClick={handleOk}>Ok</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

const customTabPanelSx = {
  pt: "24px",
  minHeight: "50vh",
};

const Collection: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const apiContext = useContext<IApiContext>(ApiContext);
  const { id } = router.query;

  // const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  // const [filterDialogvalue, setFilterDialogValue] = React.useState("Dione");
  const [collectionProfile, setCollectionProfile] = useState(collection);

  // const handleDialogClick = () => {
  //   setFilterDialogOpen(true);
  // };
  // const handleDialogClose = (newValue?: string) => {
  //   setFilterDialogOpen(false);
  //   if (newValue) {
  //     setFilterDialogValue(newValue);
  //   }
  // };

  const [tabValue, setTabValue] = React.useState("sales");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const getCollectionProfile = async () => {
      try {
        const res = await apiContext.api.get(`/collection/${id}`);
        setCollectionProfile(res.data);
      } catch (e: any) {
        apiContext.api.error(e);
      }
    };
    if (id) getCollectionProfile();
  }, [id]);

  // const SearchAndFilter: FC = () => {
  //   return (
  //     <Grid container spacing={2} sx={{ mb: 2 }}>
  //       {useMediaQuery(theme.breakpoints.up("lg")) ? (
  //         <>
  //           <Grid item md={7}>
  //             <SearchBar />
  //           </Grid>
  //           <Grid item md={5}>
  //             <SortBy />
  //           </Grid>
  //         </>
  //       ) : (
  //         <>
  //           <Grid item xs>
  //             <SearchBar />
  //           </Grid>
  //           <Grid item xs="auto">
  //             <Button
  //               sx={{ height: "100%" }}
  //               variant="outlined"
  //               aria-label="filter"
  //               onClick={handleDialogClick}
  //             >
  //               <FilterAltIcon />
  //             </Button>
  //             <ConfirmationDialogRaw
  //               id="ringtone-menu"
  //               keepMounted
  //               open={filterDialogOpen}
  //               onClose={handleDialogClose}
  //               value={filterDialogvalue}
  //             />
  //           </Grid>
  //         </>
  //       )}
  //     </Grid>
  //   )
  // }

  const [numberNftsShowing, setNumberNftsShowing] = useState(24)

  return (
    <>
      {/* Could refactor to have one object passed to CollectionProfile */}
      <CollectionProfile
        address={collectionProfile.address}
        collectionName={collectionProfile.collectionName}
        collectionLogo={collectionProfile.collectionLogo}
        bannerUrl={collectionProfile.bannerUrl}
        description={collectionProfile.description}
        socialLinks={collectionProfile.socialLinks ? collection.socialLinks : []}
        category={collectionProfile.category}
        website={collectionProfile.website}
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
              <Tab label="Sales" value="sales" />
              <Tab label="Properties" value="properties" />
              <Tab label="Activity" value="activity" />
            </TabList>
          </Box>
          {/* SALES TAB */}
          <Slide
            direction="up"
            in={tabValue == "sales"}
            mountOnEnter
            unmountOnExit
          >
            <TabPanel value="sales" sx={customTabPanelSx}>
              <TokenList
                nftListArray={recentNfts}
                setDisplayNumber={setNumberNftsShowing}
                notFullWidth
              />
            </TabPanel>
          </Slide>
          {/* PROPERTIES TAB */}
          <Slide
            direction="up"
            in={tabValue == "properties"}
            mountOnEnter
            unmountOnExit
          >
            <TabPanel value="properties" sx={customTabPanelSx}>
              <Properties traits={collectionTraits} rarities={collectionRarities} />
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
              {activities.map((item, i) => {
                return (
                  <CollectionActivity
                    tokenImageUrl={item.tokenImageUrl}
                    tokenName={item.tokenName}
                    tokenUrl={item.tokenUrl}
                    collectionName={item.collectionName}
                    collectionUrl={item.collectionUrl}
                    initiatorAvatarUrl={item.initiatorAvatarUrl}
                    initiatorUsername={item.initiatorUsername}
                    initiatorAddress={item.initiatorAddress} // for URL 
                    action={item.action}
                    date={item.date}
                    transactionUrl={item.transactionUrl}
                    key={i}
                    index={i}
                  />
                )
              })}
            </TabPanel>
          </Slide>
        </TabContext>
      </CollectionProfile>
    </>
  );
};

export default Collection;
