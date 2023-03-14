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
  Slide
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import dynamic from 'next/dynamic'
import UserInfo from '@components/token/UserInfo';
import SalesCard, { ISalesCardProps } from './SalesCard';
import Properties from '@components/collections/Properties';
import Activity, { IActivity } from "@components/Activity";

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
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi. Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  mintDate: new Date(1663353871000),
  tokenId: '9a8b5be32311f123c4e40f22233da12125c2123dcfd8d6a98e5a3659d38511c8',
  views: 124,
  category: 'Rare',
  collectionTitle: 'Wrath of Gods',
  collectionUrl: '/collections/wrath-of-gods',
  artistName: 'Paideia',
  artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  artistLogoUrl: '/images/paideia-circle-logo.png',
}

const SalesThing: ISalesCardProps = {
  sellerName: 'Paideia',
  sellerPfpUrl: '/images/paideia-circle-logo.png',
  sellerAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  postDate: new Date(1663786534000),
  artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  sale: {
    currency: 'Erg',
    price: 10,
    link: '/',
    discountCurrency: 'Ergopad',
    discount: 0.1
  },
  // auction: {
  //   currency: 'Erg',
  //   currentBidPrice: 10,
  //   currentBidLink: '/',
  //   buyNowPrice: 100,
  //   buyNowLink: '/',
  //   endTime: new Date(1664348610000),
  // }
}

const auctionHistory: IAuctionDetailProps[] = [
  {
    time: new Date(1664348610000),
    bidderName: 'Eelon Musk',
    bidderAddress: '9cmRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidderLogoUrl: '/images/users/eelon-musk.png',
    bidPrice: 14,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1664348610000),
    bidderAddress: '9fdPnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidPrice: 13,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1664348610000),
    bidderAddress: '9xyZdDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidPrice: 12,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1664348610000),
    bidderName: 'Alone Musk',
    bidderAddress: '9abCdDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidderLogoUrl: '/images/users/alone-musk.png',
    bidPrice: 11,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1664348610000),
    bidderName: 'Elon Mask',
    bidderAddress: '9tuVzDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    bidderLogoUrl: '/images/users/elon-mask.png',
    bidPrice: 10,
    bidCurrency: 'Erg',
  },
  {
    time: new Date(1664348610000),
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

const activities: IActivity[] = [
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

interface ITokenInfoProps {
  title: string;
  description: string;
  mintDate: Date;
  tokenId: string;
  views: number;
  category?: string;
  collectionTitle?: string;
  collectionUrl?: string;
  collectionDescription?: string;
  artistName: string;
  artistAddress: string;
  artistLogoUrl: string;
  salesCard: ISalesCardProps;
}

const TokenInfo: FC<{ tokenId: string; }> = (props) => {
  const apiCallFromAddress = {
    ...NftType,
    tokenId: props.tokenId
  }
  const apiCallAboutTokenSale = SalesThing
  const theme = useTheme()
  const [tabValue, setTabValue] = React.useState('info');
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  return (
    <>
      <Container sx={{ mb: '100px', mt: '48px' }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          columnSpacing={5}
          sx={{ mb: '100px' }}
        >
          <Grid
            item
            md={6}
            xs={12}
            sx={{
              height: '600px'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                background: '#000',
                height: '100%',
                borderRadius: '16px'
              }}
            >
              <Image
                src="/images/cube2.png"
                layout="fill"
                objectFit="contain"
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
              <Typography variant="h4">
                {apiCallFromAddress.title}
              </Typography>

              {/* SUBTITLE */}
              <Box
                sx={{
                  mb: '24px'
                }}
              >
                {apiCallFromAddress.artistLogoUrl &&
                  <Link
                    href={'/users/' + apiCallFromAddress.artistAddress}
                    sx={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      mr: '6px'
                    }}
                  >
                    <Image src={apiCallFromAddress.artistLogoUrl} layout="fixed" width={32} height={32} alt="Artist Logo" />
                  </Link>
                }
                <Typography sx={{ display: 'inline-block', fontWeight: '700', }}>
                  {apiCallFromAddress.collectionUrl ? (
                    <Link
                      href={apiCallFromAddress.collectionUrl}
                      sx={{
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {apiCallFromAddress.collectionTitle}
                    </Link>
                  ) : (
                    apiCallFromAddress.collectionTitle
                  )}
                </Typography>
                {' '}
                <Typography
                  component="span"
                  sx={{
                    fontStyle: 'italic',
                    color: theme.palette.text.secondary,
                  }}
                >
                  by
                  {' '}
                  <Link
                    href={'/users/' + apiCallFromAddress.artistAddress}
                    sx={{
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {apiCallFromAddress.artistName}
                  </Link>
                </Typography>
              </Box>

              {
                (
                  (
                    apiCallAboutTokenSale.auction &&
                    ((apiCallAboutTokenSale.auction.endTime.getTime() - (Date.now() / 1000)) > 0)
                  ) ||
                  apiCallAboutTokenSale.sale
                ) &&
                <SalesCard {...apiCallAboutTokenSale} />
              }

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
                      {apiCallAboutTokenSale.auction && <Tab label="Auction Info" value="auction" />}
                      <Tab label="Properties" value="properties" />
                      <Tab label="Activity" value="activity" />
                    </TabList>
                  </Box>

                  {/* INFO TAB */}
                  <Slide direction="up" in={tabValue == 'info'} mountOnEnter unmountOnExit>
                    <TabPanel value="info">
                      <Typography variant="h6" sx={{ mb: '12px' }}>General Information</Typography>

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

                      <Typography variant="body2" sx={{ mb: '32px' }}>
                        {apiCallFromAddress.description}
                      </Typography>
                    </TabPanel>
                  </Slide>

                  {/* AUCTION TAB */}
                  <Slide direction="up" in={tabValue == 'auction'} mountOnEnter unmountOnExit>
                    <TabPanel value="auction">
                      {auctionHistory.map((props, i) => {
                        return (
                          <UserInfo
                            name={props.bidderName}
                            pfpUrl={props.bidderLogoUrl}
                            address={props.bidderAddress}
                            date={'17 minutes ago'}
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
                  </Slide>

                  {/* TRAITS TAB */}
                  <Slide direction="up" in={tabValue == 'properties'} mountOnEnter unmountOnExit>
                    <TabPanel value="properties">
                      Type: Human
                      Mouth: Smirk
                    </TabPanel>
                  </Slide>


                  {/* ACTIVITY TAB */}
                  <Slide direction="up" in={tabValue == 'activity'} mountOnEnter unmountOnExit>
                    <TabPanel value="activity">
                      <Typography sx={{ mb: '24px' }}>
                        Past sales activity
                      </Typography>


                    </TabPanel>
                  </Slide>

                </TabContext>
              </Box>

            </Box>
          </Grid>
        </Grid>
      </Container >
    </>
  )
};

export default TokenInfo;