import React, { FC, useState, useEffect } from 'react';
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
  Grow,
  Divider,
  Paper
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
import DirectSalesCard, { IDirectSalesCardProps } from '@components/token/DirectSalesCard';
import TokenProperties from '@components/token/TokenProperties';
import Properties from '@components/collections/Properties';
import TokenActivity, { ITokenActivity } from '@components/token/TokenActivity';
import CollectionsIcon from '@mui/icons-material/Collections';
import MoodIcon from '@mui/icons-material/Mood';
import { v4 as uuidv4 } from 'uuid';
import { ICollectionTraits, ICollectionRarities } from "@components/collections/Properties";
import dayjs from 'dayjs';
import PackTokenSelector from '@components/token/PackTokenSelector';

// Packs or no packs? 
//    a) If packs, are there more than one pack type? 
//        i) Just one type: show collection featured image and display "Open right away"
//        ii) More than one type: pack list with info in place of featured image
//    b) No packs, but its a mint: 
//        - Display collection featured image, 
//        - No "Open right away" displayed
//    c) No packs, its an NFT: display NFT image as featured image. Give token properties as well

// UI needed: 
//    a) Sale card for more than one pack
//    b) Featured image area to select from the available packs
//    c) NFT info

const MintSaleInfo: FC<{
  tokenId: string;
}> = (props) => {
  const apiCallFromAddress = {
    ...NftType,
    tokenId: props.tokenId,
    hasPackTokens: true
  }
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [selected, setSelected] = useState<boolean[]>([])
  const [salesProps, setSalesProps] = useState({
    tokenName: '',
    openNow: false,
    price: 0,
    currency: 'Erg',
  })
  const [featuredImage, setFeaturedImage] = useState('/images/cube2.png')

  // NOTE CURRENCY IS NAN IF NOT ERG. NEEDS FIX LATER
  useEffect(() => {
    if (apiGetSaleById !== undefined && apiGetSaleById.packs.length > 1) {
      setSelected(apiGetSaleById.packs.map((_item, i) => i === 0 ? true : false))
      setSalesProps({
        tokenName: apiGetSaleById.packs[0].name,
        openNow: true,
        price: Number((apiGetSaleById.packs[0].price[0].amount * 0.000000001).toFixed(3)),
        currency: apiGetSaleById.packs[0].price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ? 'Erg' : 'NaN',
      })
      setFeaturedImage(apiGetSaleById.packs[0].image)
    }
  }, [apiGetSaleById])

  useEffect(() => {
    selected.map((item, i) => {
      if (item) {
        setSalesProps({
          tokenName: apiGetSaleById.packs[i].name,
          openNow: true,
          price: Number((apiGetSaleById.packs[i].price[0].amount * 0.000000001).toFixed(3)),
          currency: apiGetSaleById.packs[i].price[0].tokenId === '0000000000000000000000000000000000000000000000000000000000000000' ? 'Erg' : 'NaN',
        })
        setFeaturedImage(apiGetSaleById.packs[i].image)
      }
      return item
    })
      
  }, [selected.toString()])

  return (
    <>
      {/* <Grid container>
        <Grid item md={9}>
          <Typography variant="h1">
            {apiGetSaleById.name}
          </Typography>
          <Typography variant="body2">
            {apiGetSaleById.description}
          </Typography>
        </Grid>
        <Grid item md={3}>
        </Grid>
      </Grid> */}

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        columnSpacing={5}
        sx={{ mb: '24px' }}
      >
        <Grid
          item
          md={6}
          xs={12}
        >
          <Box
            sx={{
              position: 'relative',
              mb: '24px',
              width: '100%'
              // display: apiGetSaleById !== undefined && apiGetSaleById.packs.length > 1 ? 'none' : 'block'
            }}
          >
            <img
              src={featuredImage}
              height={'100%'}
              width={'100%'}
              style={{
                borderRadius: '8px',
              }}
              alt="cube"
            />

          </Box>

        </Grid>
        <Grid item md={6} xs={12}
          sx={{
            pr: { xs: 0, md: '24px' },
          }}
        >
          <Typography variant="h3" sx={{ mb: 1 }}>
            {apiGetSaleById.name}
          </Typography>
          <Typography variant="body2">
            {apiGetSaleById.description}
          </Typography>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ pb: '8px!important' }}>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Grid item>
                  <Typography variant="h6">
                    Collection:
                  </Typography>
                </Grid>
                <Grid item>
                  <Link href={apiCallFromAddress.collectionUrl}>
                    {apiCallFromAddress.collectionTitle}
                  </Link>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Grid item>
                  <Typography variant="h6">
                    Artist:
                  </Typography>
                </Grid>
                <Grid item>
                  <Link href={'/users/' + apiCallFromAddress.artistAddress}>
                    {apiCallFromAddress.artistName}
                  </Link>
                </Grid>
              </Grid>
              {apiGetSaleById.endTime && (
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h6">
                      Sale End:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {dayjs(apiGetSaleById.endTime).toString()}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
          {apiGetSaleById !== undefined && apiGetSaleById.packs.length > 1 && (
            <Paper sx={{ mb: 2, p: 2 }}>
              <Typography variant="h5">
                Choose a pack
              </Typography>
              {apiGetSaleById.packs.map((item, i) => {
                return (
                  <PackTokenSelector
                    key={i}
                    index={i}
                    packInfo={apiGetSaleById.packs[i]}
                    selected={selected}
                    setSelected={setSelected}
                  />
                )
              })}
            </Paper>
          )}
          <Box sx={{ mb: 3 }}>
            <DirectSalesCard {...salesProps} />
          </Box>

        </Grid>
      </Grid>
    </>
  )
};

export default MintSaleInfo;

























const SalesThingMint = {
  title: 'Blockheads 3 Pack',
  tokenName: 'Blockheads 3 Pack',
  description: 'When opened, you will receive 3 Blockhead NFTs. ',
  mintDate: new Date(1663353871000),
  tokenId: '9a8b5be32311f123c4e40f22233da12125c2123dcfd8d6a98e5a3659d38511c8',
  views: 124,
  category: 'Common',
  collectionTitle: 'Origins',
  collectionUrl: '/collections/wrath-of-gods',
  collectionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi. Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  artistName: 'Paideia',
  artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  artistLogoUrl: '/images/paideia-circle-logo.png',
  salesCard: {
    sellerName: 'Paideia',
    sellerPfpUrl: '/images/paideia-circle-logo.png',
    sellerAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    postDate: new Date(1663786534000),
    sale: {
      currency: 'Erg',
      price: 10,
      link: '/',
      isPack: true
    }
  }
}







/// API NEEDED ////////
const ApiPriceConversion: { [key: string]: number } = {
  erg: 1.51,
  ergopad: 0.006
}
/// END API NEEDED ///

////////////////////////////////////////////////////////////////////////////////////////
// BEGIN SAMPLE DATA ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

const apiGetSaleById = {
  "id": "3357bcf6-baa5-4337-a9a0-468364d8a1fd",
  "name": "Sale Name",
  "description": "This is the sale description, added by the user. It can be as long or short as they choose, or not added. ",
  "startTime": "2023-01-10T11:41:57Z",
  "endTime": "2023-04-30T23:27:54Z",
  "sellerWallet": "9h7L7sUHZk43VQC3PHtSp5ujAWcZtYmWATBH746wi75C5XHi68b",
  "saleWallet": "3n7SxSJE7u1zXqj3JmTPYgnEv7ZGc8ULnfeWCDDgij11rrik43ZWTXAwJyGJondbZ6ssk1yQMbCTpkAd3oqXb2EJ6U1h1wk11asoHuFiF8qZs46eXqvfHUbvPkXa2YVM8bKw53UBsNwpmbV2MfEFi1uoC3hAJ2p4v1y75zxYG",
  "packs": [
    {
      "id": "53b93d59-5e46-4ef8-8f24-81e5704ad51e",
      "name": "Single NFT",
      "image": "/images/character3.png",
      "price": [
        {
          "id": "15b4c4f2-4415-4a3f-9777-b9f6bbed02eb",
          "tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
          "amount": 7000000000,
          "packId": "53b93d59-5e46-4ef8-8f24-81e5704ad51e"
        }
      ],
      "content": [
        {
          "id": "44126fcf-140c-4270-89e9-dea71bed1944",
          "rarity": [
            {
              "odds": 100,
              "rarity": "_pt_rarity_Single NFT"
            }
          ],
          "amount": 1,
          "packId": "53b93d59-5e46-4ef8-8f24-81e5704ad51e"
        }
      ]
    },
    {
      "id": "a4b49f9c-9a68-406a-a6b2-f221e31592bd",
      "name": "3 Pack",
      "image": "/images/character2.png",
      "price": [
        {
          "id": "fc2561d4-d35b-47a3-b082-1e71f946832e",
          "tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
          "amount": 10000000000,
          "packId": "a4b49f9c-9a68-406a-a6b2-f221e31592bd"
        }
      ],
      "content": [
        {
          "id": "111df494-c887-4f3b-937e-99b13f65981a",
          "rarity": [
            {
              "odds": 100,
              "rarity": "_pt_rarity_3 Pack"
            }
          ],
          "amount": 3,
          "packId": "a4b49f9c-9a68-406a-a6b2-f221e31592bd"
        }
      ]
    },
    {
      "id": "a4b49f9c-9a68-406a-a6b2-f221e31592bd",
      "name": "5 Pack",
      "image": "/images/character1.png",
      "price": [
        {
          "id": "fc2561d4-d35b-47a3-b082-1e71f946832e",
          "tokenId": "0000000000000000000000000000000000000000000000000000000000000000",
          "amount": 15000000000,
          "packId": "a4b49f9c-9a68-406a-a6b2-f221e31592bd"
        }
      ],
      "content": [
        {
          "id": "111df494-c887-4f3b-937e-99b13f65981a",
          "rarity": [
            {
              "odds": 100,
              "rarity": "_pt_rarity_5 Pack"
            }
          ],
          "amount": 3,
          "packId": "a4b49f9c-9a68-406a-a6b2-f221e31592bd"
        }
      ]
    }
  ],
  "tokens": [],
  "initialNanoErgFee": 10000000000,
  "saleFeePct": 5
}

const collection = {
  address: "9asdfgEGZKHfKCUasdfvreqK6s6KiALNCFxojUa4Tbibw2Ajw1JFo",
  collectionName: "Ergopad NFTs",
  collectionLogo: "/images/collections/ergopad-logo.jpg",
  bannerUrl: undefined,
  description: "A psychological phenomenon known as the mere exposure effect is where we develop a preference just because we are familiar with things.",
  socialLinks: [],
  category: '',
  website: 'http://ergopad.io',
  totalQty: 3000
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

const saleInfo = {
  saleName: '',
  saleDescription: '',
  collection: {
    name: '',
    description: '',
    featuredImage: '',
    totalQty: 3000,
  },
  tokens: [
    {
      title: 'Blockheads Single',
      description: 'This is the description of the token. You will get one Blockhead selected at random. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi. Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: 10,
      currency: 'Erg',
      mintDate: new Date(1663353871000),
      tokenId: '9a8b5be32311f123c4e40f22233da12125c2123dcfd8d6a98e5a3659d38511c8',
      views: 124,
      collectionTitle: 'Wrath of Gods',
      collectionUrl: '/collections/wrath-of-gods',
      artistName: 'Paideia',
      artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
      artistLogoUrl: '/images/paideia-circle-logo.png',
      traits: [
        {
          traitName: 'Rarity',
          value: 'Common',
          qtyWithTrait: 2600
        },
        {
          traitName: 'Color',
          value: 'Blue',
          qtyWithTrait: 130
        },
        {
          traitName: 'Speed',
          value: '54',
          qtyWithTrait: 16
        },
        {
          traitName: 'Hair',
          value: 'Mohawk',
          qtyWithTrait: 521
        },
      ]
    }
  ]
}

const collectionInfo = {
  totalQty: 3000
}

const NftType = {
  title: 'Monk & Fox #0017',
  description: 'This is the description of the token. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi. Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  mintDate: new Date(1663353871000),
  tokenId: '9a8b5be32311f123c4e40f22233da12125c2123dcfd8d6a98e5a3659d38511c8',
  views: 124,
  category: 'Rare',
  collectionTitle: 'Wrath of Gods',
  collectionUrl: '/collections/wrath-of-gods',
  artistName: 'Paideia',
  artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  artistLogoUrl: '/images/paideia-circle-logo.png',
  traits: [
    {
      traitName: 'Rarity',
      value: 'Common',
      qtyWithTrait: 2600
    },
    {
      traitName: 'Color',
      value: 'Blue',
      qtyWithTrait: 130
    },
    {
      traitName: 'Speed',
      value: '54',
      qtyWithTrait: 16
    },
    {
      traitName: 'Hair',
      value: 'Mohawk',
      qtyWithTrait: 521
    },
  ]
}


////////////////////////////////////////////////////////////////////////////////////////
// END SAMPLE DATA /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
