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
  Typography
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
import SaleList from "@components/sales/SaleList";

// INIT
const collection: ICollectionProfileProps = {
  address: "",
  id: "",
  collectionName: "",
  collectionLogo: "",
  bannerUrl: undefined,
  description: "",
  socialLinks: [],
  category: '',
  website: '',
};

// LEFT AS AN EXAMPLE FOR WHEN THE API IS WORKING
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

// EXAMPLE FOR HOW TO BUILD THE API 
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
// END PLACEHOLDER DATA //

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
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const [collectionRarities, setCollectionRarities] = useState<ICollectionRarities[]>([{
    rarity: '',
    amount: 0
  }])
  const [collectionTraits, setCollectionTraits] = useState<ICollectionTraits[]>([{
    traitName: '',
    id: uuidv4(),
    type: 'Property'
  }])

  useEffect(() => {
    const getCollectionProfile = async () => {
      try {
        const res = await apiContext.api.get(`/collection/${id}`);
        // const collection = res.data.find((obj: any) => {
        //   return obj.id === id?.toString()
        // })
        const collection = res.data
        console.log(res.data)
        setCollectionProfile({
          address: "missing-artist-address",
          id: collection.id,
          collectionName: collection.name,
          collectionLogo: collection.collectionLogoUrl,
          bannerUrl: collection.bannerImageUrl,
          description: collection.description,
          socialLinks: [{
            socialNetwork: 'Twitter',
            url: 'http://twitter.com/missing-socials'
          }],
          category: collection.category,
          website: "https://missing-website.com"
        });
        setCollectionRarities(collection.rarities.map((item: any) => {
          return {
            rarity: item.rarity,
            // amount: 0
          }
        }))
        setCollectionTraits(collection.availableTraits.map((item: any) => {
          return {
            type: item.tpe.toLowerCase().replace(/^\w/, (c: string) => c.toUpperCase()),
            id: uuidv4(),
            traitName: item.name
          }
        }))
      } catch (e: any) {
        if (e.response.data.includes('empty result')) console.log('No collection by that name or ID')
        else apiContext.api.error(e.response.data);
      }
    };
    if (id) getCollectionProfile();
  }, [id]);

  return (
    <>
      <CollectionProfile
        {...collectionProfile}
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
              {collectionProfile.id &&
                <SaleList
                  collection={collectionProfile.id}
                  notFullWidth
                />
              }

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
              <Typography sx={{ mb: 1 }}>
                Sample Data:
              </Typography>
              {activities.map((item, i) => {
                return (
                  <CollectionActivity
                    {...item}
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
