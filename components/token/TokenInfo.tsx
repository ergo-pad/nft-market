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
  Divider
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import dynamic from 'next/dynamic'
import AuctionBid from '@components/token/AuctionBid';
import DirectSalesCard, { IDirectSalesCardProps } from '@components/token/DirectSalesCard';
import MarketSalesCard, { ISalesCardProps } from '@components/token/MarketSalesCard';
import TokenProperties from '@components/token/TokenProperties';
import TokenActivity, { ITokenActivity } from '@components/token/TokenActivity';
import Nft from '@pages/marketplace/[id]';
import CollectionsIcon from '@mui/icons-material/Collections';
import MoodIcon from '@mui/icons-material/Mood';

/// API NEEDED ////////
const ApiPriceConversion: { [key: string]: number } = {
  erg: 1.51,
  ergopad: 0.006
}
/// END API NEEDED ///

////////////////////////////////////////////////////////////////////////////////////////
// BEGIN SAMPLE DATA ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

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

const collectionInfo = {
  totalQty: 3000
}



const auctionHistory: IAuctionDetailProps[] = [
  {
    time: new Date(1679078760000),
    bidderName: 'Eelon Musk',
    bidderAddress: '9cmRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidderLogoUrl: '/images/users/eelon-musk.png',
    bidPrice: 14,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1679035514000),
    bidderAddress: '9fdPnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidPrice: 13,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1678999514000),
    bidderAddress: '9xyZdDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidPrice: 12,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1678999214000),
    bidderName: 'Alone Musk',
    bidderAddress: '9abCdDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidderLogoUrl: '/images/users/alone-musk.png',
    bidPrice: 11,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1678912814000),
    bidderName: 'Elon Mask',
    bidderAddress: '9tuVzDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidderLogoUrl: '/images/users/elon-mask.png',
    bidPrice: 10,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1678905614000),
    bidderAddress: '9heLlOa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidPrice: 9,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1664348610000),
    bidderAddress: '9isItMeYoureLookiNgFor8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidPrice: 8,
    bidCurrency: 'Erg',
  },
]

const activities: ITokenActivity[] = [
  {
    tokenImageUrl: '/images/character1.png',
    tokenName: 'Blockheads 3 pack',
    tokenUrl: '',
    collectionName: 'Ergopad NFTs',
    collectionUrl: '/collections/ergopad-nfts',
    initiatorAvatarUrl: '/images/character4.png',
    initiatorUsername: 'Phil',
    initiatorAddress: '9isItMeYoureLookiNgFor8SGYUbFpqTwE9G78yffudKq59xTa9',
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
    initiatorAddress: '9isItMeYoureLookiNgFor8SGYUbFpqTwE9G78yffudKq59xTa9',
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
    initiatorAddress: '9isItMeYoureLookiNgFor8SGYUbFpqTwE9G78yffudKq59xTa9',
    action: 'sale-init',
    date: new Date(1678608000000),
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
    initiatorAddress: '9isItMeYoureLookiNgFor8SGYUbFpqTwE9G78yffudKq59xTa9',
    action: 'auction-init',
    date: new Date(1678608000000),
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
    initiatorAddress: '9isItMeYoureLookiNgFor8SGYUbFpqTwE9G78yffudKq59xTa9',
    action: 'auction-won',
    date: new Date(1678608000000),
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
    initiatorAddress: '9isItMeYoureLookiNgFor8SGYUbFpqTwE9G78yffudKq59xTa9',
    action: 'minted',
    date: new Date(1678608000000),
    transactionUrl: 'https://explorer.ergoplatform.com/en/transactions/878e006879bac87cf1b1a46be411f323489de68d67821a227851dc95f6a9e2e1'
  },
]

////////////////////////////////////////////////////////////////////////////////////////
// END SAMPLE DATA /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

interface IAuctionDetailProps {
  time: Date;
  bidderName?: string;
  bidderAddress: string;
  bidderLogoUrl?: string;
  bidPrice: number;
  bidCurrency: string;
}

const TokenInfo: FC<{
  tokenId: string;
  directSaleInfo?: IDirectSalesCardProps;
  marketplaceSaleInfo?: ISalesCardProps;
}> = (props) => {
  const apiCallFromAddress = {
    ...NftType,
    tokenId: props.tokenId
  }
  const theme = useTheme()
  const [tabValue, setTabValue] = React.useState('info');
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  return (
    <>
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
            }}
          >
            <Image
              src="/images/cube2.png"
              layout="responsive"
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
          <Box
            sx={{
              height: '100%',
              position: 'relative',
            }}
          >
            <Typography variant="h4" sx={{ mb: '24px' }}>
              {apiCallFromAddress.title}
            </Typography>

            <Box sx={{ mb: '12px' }}>
              {
                (
                  (
                    props.marketplaceSaleInfo &&
                    props.marketplaceSaleInfo.auction &&
                    ((props.marketplaceSaleInfo.auction.endTime.getTime() - (Date.now() / 1000)) > 0)
                  ) ||
                  props.marketplaceSaleInfo && props.marketplaceSaleInfo.sale
                ) && <MarketSalesCard {...props.marketplaceSaleInfo} />
                ||
                props.directSaleInfo &&
                <DirectSalesCard {...props.directSaleInfo} />
              }
            </Box>

            <Box sx={{ width: '100%', typography: 'body1' }}>
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList
                    onChange={handleTabChange}
                    aria-label="NFT Information Tabs"
                    variant="fullWidth"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                  >
                    <Tab label="Information" value="info" />
                    {
                      props.marketplaceSaleInfo && props.marketplaceSaleInfo.auction && <Tab label="Bids" value="auction" />}
                    <Tab label="Properties" value="properties" />
                    <Tab label="Activity" value="activity" />
                  </TabList>
                </Box>

                {/* INFO TAB */}
                <Grow in={tabValue == 'info'} mountOnEnter unmountOnExit>
                  <TabPanel value="info">
                    <Typography variant="h6" sx={{ mb: '12px' }}>Token Description</Typography>

                    <Typography variant="body2" sx={{ mb: '32px' }}>
                      {apiCallFromAddress.description}
                    </Typography>

                    <Typography variant="h6" sx={{ mb: '12px' }}>Metadata</Typography>

                    {/* TOKEN ID */}
                    <Box
                      sx={{
                        mb: '12px',
                        color: theme.palette.text.secondary,
                        // whiteSpace: 'nowrap',
                        display: 'flex',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-block',
                          color: theme.palette.text.secondary,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <Icon sx={{ display: 'inline-block', verticalAlign: 'middle', mr: '6px', mt: '-3px' }}>tag</Icon>
                        Token ID: {' '}
                        <Link href={'https://explorer.ergoplatform.com/en/token/' + apiCallFromAddress.tokenId}>
                          {apiCallFromAddress.tokenId}
                        </Link>
                      </Box>
                    </Box>

                    {/* DATE MINTED */}
                    <Box
                      sx={{
                        mb: '12px',
                        color: theme.palette.text.secondary
                      }}
                    >
                      <Icon sx={{ verticalAlign: 'middle', mr: '6px', mt: '-3px' }}>calendar_today</Icon>
                      Date Minted: <Box sx={{ display: 'inline-block', color: theme.palette.text.primary }}>{apiCallFromAddress.mintDate.toDateString()}</Box>
                    </Box>

                    {/* Collection */}
                    <Box
                      sx={{
                        mb: '12px',
                        color: theme.palette.text.secondary
                      }}
                    >
                      <CollectionsIcon sx={{ verticalAlign: 'middle', mr: '6px', mt: '-3px' }} />
                      Collection: <Link href={apiCallFromAddress.collectionUrl} sx={{ display: 'inline-block' }}>{apiCallFromAddress.collectionTitle}</Link>
                    </Box>

                    {/* Artist */}
                    <Box
                      sx={{
                        mb: '12px',
                        color: theme.palette.text.secondary
                      }}
                    >
                      <MoodIcon sx={{ verticalAlign: 'middle', mr: '6px', mt: '-3px' }} />
                      Artist: <Link href={'/users/' + apiCallFromAddress.artistAddress} sx={{ display: 'inline-block' }}>{apiCallFromAddress.artistName}</Link>
                    </Box>

                  </TabPanel>
                </Grow >

                {/* AUCTION TAB */}
                <Grow in={tabValue == 'auction'} mountOnEnter unmountOnExit>
                  <TabPanel value="auction">
                    {auctionHistory.map((props, i) => {
                      return (
                        <AuctionBid
                          name={props.bidderName}
                          pfpUrl={props.bidderLogoUrl}
                          address={props.bidderAddress}
                          date={props.time}
                          price={{
                            price: props.bidPrice,
                            currency: props.bidCurrency,
                            usdConversion: ApiPriceConversion[props.bidCurrency.toLowerCase()]
                          }}
                          timeIcon="schedule"
                          key={i}
                        />
                      )
                    })}
                  </TabPanel>
                </Grow >

                {/* TRAITS TAB */}
                <Grow in={tabValue == 'properties'} mountOnEnter unmountOnExit>
                  <TabPanel value="properties">
                    <TokenProperties
                      collectionTotalQty={collectionInfo.totalQty}
                      traits={NftType.traits}
                    />
                  </TabPanel>
                </Grow >


                {/* ACTIVITY TAB */}
                <Grow in={tabValue == 'activity'} mountOnEnter unmountOnExit>
                  <TabPanel value="activity">
                    {activities.map((item, i) => {
                      return (
                        <TokenActivity
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
                </Grow >

              </TabContext>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </>
  )
};

export default TokenInfo;