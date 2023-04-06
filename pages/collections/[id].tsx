import React, { FC, useState, useEffect, useRef, useContext } from "react";
import type { NextPage } from "next";
import {
  // Grid,
  // Typography,
  Box,
  useTheme,
  // useMediaQuery,
  Fade,
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

const customTabPanelSx = {
  pt: "24px",
  minHeight: "50vh",
};

const Collection: NextPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const apiContext = useContext<IApiContext>(ApiContext);
  const { id } = router.query;
  const [collectionProfile, setCollectionProfile] = useState(collection);
  const [tabValue, setTabValue] = React.useState("sales");
  const [numberNftsShowing, setNumberNftsShowing] = useState(24)
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
          <Fade
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
          </Fade>
          {/* PROPERTIES TAB */}
          <Fade
            in={tabValue == "properties"}
            mountOnEnter
            unmountOnExit
          >
            <TabPanel value="properties" sx={customTabPanelSx}>
              <Properties traits={collectionTraits} rarities={collectionRarities} />
            </TabPanel>
          </Fade>
          {/* ACTIVITY TAB */}
          <Fade
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
          </Fade>
        </TabContext>
      </CollectionProfile>
    </>
  );
};

export default Collection;
