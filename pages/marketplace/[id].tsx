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
  Tooltip
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

interface ISalesCardProps {
  sellerName?: string;
  sellerPfpUrl?: string;
  sellerAddress: string;
  postDate: Date;
  sale?: { // use if NOT an auction
    price: number;
    currency: string;
    link: string;
    discountCurrency?: string;
    discount?: number;
  }
  auction?: {
    currency: string;
    currentBidPrice: number;
    currentBidLink: string;
    buyNowPrice: number;
    buyNowLink: string;
    endTime: Date;
  }
}

interface INftProps {
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
  artistUrl: string;
  artistAddress: string;
  artistLogoUrl: string;
  stats: {
    title: string;
    stat: number | string;
  }[];
  salesCard: ISalesCardProps;
}

interface IAuctionDetailProps {
  time: Date;
  bidderName?: string;
  bidderUrl: string;
  bidderAddress: string;
  bidderLogoUrl?: string;
  bidPrice: number;
  bidCurrency: string;
}

const NftType = {
  title: 'Monk & Fox #0017',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi. Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  mintDate: new Date(1663353871),
  tokenId: '9a8b5be32311f123c4e40f22233da12125c2123dcfd8d6a98e5a3659d38511c8',
  views: 124,
  category: 'Rare',
  collectionTitle: 'Wrath of Gods',
  collectionUrl: '/collections/wrath-of-gods',
  collectionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi. Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  artistName: 'Paideia',
  artistUrl: '/users/paideia',
  artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  artistLogoUrl: '/images/paideia-circle-logo.png',
  stats: [
    {
      title: 'string',
      stat: 100,
    },
  ],
  salesCard: {
    sellerName: 'Paideia',
    sellerPfpUrl: '/images/paideia-circle-logo.png',
    sellerAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    postDate: new Date(1663786534),
    // sale: {
    //   currency: 'Erg',
    //   price: 10,
    //   link: '/',
    //   discountCurrency: 'Ergopad',
    //   discount: 0.1
    // },
    auction: {
      currency: 'Erg',
      currentBidPrice: 10,
      currentBidLink: '/',
      buyNowPrice: 100,
      buyNowLink: '/',
      endTime: new Date(1664348610),
    }
  }
}

const ApiPriceConversion: { [key: string]: number } = {
  erg: 2.83,
  ergopad: 0.032
}

const timeRemaining = (endTime: Date) => {
  const now = Date.now() / 1000
  const diff = endTime.getTime() - now;

  let seconds: string | number = Math.floor(diff % 60),
    minutes: string | number = Math.floor((diff / 60) % 60),
    hours: string | number = Math.floor((diff / (60 * 60)) % 24),
    days: string | number = Math.floor((diff / (60 * 60)) / 24);

  return days + "d, " + hours + "h, " + minutes + "m, " + seconds + "s";
}

const TimeRemaining: FC<{ endTime: Date }> = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(timeRemaining(endTime));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(timeRemaining(endTime));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const date = endTime.toLocaleDateString()

  return <Tooltip title={date} arrow placement="top"><Box>{timeLeft}</Box></Tooltip>
}

const SalesCard: FC<ISalesCardProps> = (props) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <Card>
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          sx={{
            mb: '18px',
          }}
        >
          <Grid item>
            <Grid
              container
            // alignItems="center"
            >
              <Grid item>
                <Avatar
                  alt={props.sellerName ? props.sellerName : props.sellerAddress}
                  src={props.sellerPfpUrl}
                  sx={{
                    mr: '6px',
                    width: 48,
                    height: 48,
                    display: upSm ? 'flex' : 'none',
                    bgcolor: theme.palette.primary.main
                  }}
                />
              </Grid>
              <Grid item>

                {/* SELLER ADDRESS OR NAME */}
                <Box
                  sx={{
                    color: theme.palette.text.primary,
                    // whiteSpace: 'nowrap',
                    display: 'flex',
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-block',
                      color: theme.palette.text.primary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    Sold By {' '}
                    <Link
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: '700',
                        '&:hover': {
                          color: theme.palette.primary.main,
                        }
                      }}
                      href={'https://explorer.ergoplatform.com/en/addresses/' + props.sellerAddress}
                    >
                      {props.sellerName ? props.sellerName : props.sellerAddress}
                    </Link>
                  </Box>
                </Box>

                {/* DATE LISTED */}
                <Box
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem'
                  }}
                >
                  <Icon
                    sx={{
                      verticalAlign: 'middle',
                      mr: '6px',
                      mt: '-4px',
                      fontSize: '18px !important'
                    }}
                  >
                    calendar_today
                  </Icon>
                  List Date: <Box sx={{ display: 'inline-block' }}>{props.postDate.toDateString()}</Box>
                </Box>

              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ textAlign: 'right' }}>
            {props.sale ? (
              <>
                <Typography
                  sx={{
                    mb: 0,
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    lineHeight: 1.3
                  }}
                >
                  {props.sale.price + ' ' + props.sale.currency}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem'
                  }}
                >
                  ${ApiPriceConversion[props.sale.currency.toLowerCase()] * props.sale.price} USD
                </Typography>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>


        {props.sale ? (
          props.sale.discount ?
            (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <ButtonLink
                    href={props.sale.link}
                    fullWidth
                    variant="outlined"
                  >
                    Buy with {props.sale.currency}
                  </ButtonLink>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <ButtonLink
                    href={props.sale.link}
                    fullWidth
                    variant="contained"
                  >
                    {props.sale.discountCurrency + ' (' + props.sale.discount * 100 + '% off)'}
                  </ButtonLink>
                </Grid>
              </Grid>
            ) : (
              <ButtonLink
                href={props.sale.link}
                fullWidth
                variant="outlined"
              >
                Buy with {props.sale.currency}
              </ButtonLink>
            )
        ) : (
          props.auction &&
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: '700',
                }}
              >
                {props.auction.currentBidPrice + ' ' + props.auction.currency + ' ($' + (ApiPriceConversion[props.auction.currency.toLowerCase()] * props.auction.currentBidPrice).toFixed(2) + ' USD)'}

              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontStyle: 'italic',
                  fontSize: '0.875rem'
                }}
              >
                Highest bid
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: '700',
                }}
              >
                <TimeRemaining endTime={props.auction.endTime} />
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontStyle: 'italic',
                  fontSize: '0.875rem'
                }}
              >
                Time Remaining
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonLink
                href={props.auction.currentBidLink}
                fullWidth
                variant="outlined"
              >
                Place {props.auction.currency} bid
              </ButtonLink>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonLink
                href={props.auction.buyNowLink}
                fullWidth
                variant="contained"
              >
                Buy now for {props.auction.buyNowPrice + ' ' + props.auction.currency}
              </ButtonLink>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}

const Nft: NextPage<INftProps> = (props) => {
  props = NftType;
  const theme = useTheme()
  const [tabValue, setTabValue] = React.useState('info');

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
                {props.title}
              </Typography>

              {/* SUBTITLE */}
              <Box
                sx={{
                  mb: '48px'
                }}
              >
                {props.artistUrl && props.artistLogoUrl ? (
                  <Link
                    href={props.artistUrl}
                    sx={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      mr: '6px'
                    }}
                  >
                    <Image src={props.artistLogoUrl} layout="fixed" width={32} height={32} />
                  </Link>
                ) : (
                  ''
                )}
                <Typography sx={{ display: 'inline-block', fontWeight: '700', }}>
                  {props.collectionUrl ? (
                    <Link
                      href={props.collectionUrl}
                      sx={{
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {props.collectionTitle}
                    </Link>
                  ) : (
                    props.collectionTitle
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
                  {props.artistUrl ? (
                    <Link
                      href={props.artistUrl}
                      sx={{
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {props.artistName}
                    </Link>
                  ) : (
                    props.artistName
                  )}
                </Typography>
              </Box>

              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabValue}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                      onChange={handleTabChange}
                      aria-label="lab API tabs example"
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                    >
                      <Tab label="Information" value="info" />
                      {props.salesCard.auction && <Tab label="Auction Info" value="auction" />}
                      <Tab label="Properties" value="properties" />
                      <Tab label="Activity" value="activity" />
                    </TabList>
                  </Box>
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
                        <Link href={'https://explorer.ergoplatform.com/en/token/' + props.tokenId}>
                          {props.tokenId}
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
                      Date Minted: <Box sx={{ display: 'inline-block', color: theme.palette.text.primary }}>{props.mintDate.toDateString()}</Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: '32px' }}>
                      {props.description}
                    </Typography>

                    {props.collectionDescription && (
                      <>
                        <Typography variant="h6" sx={{ mb: '12px' }}>Collection Description</Typography>
                        <Typography variant="body2" sx={{ mb: '32px' }}>
                          {props.collectionDescription}
                        </Typography>
                      </>
                    )}

                  </TabPanel>
                  <TabPanel value="auction">Auction Info</TabPanel>
                  <TabPanel value="properties">Traits, rarity, etc.</TabPanel>
                  <TabPanel value="activity">Past sales activity</TabPanel>
                </TabContext>
              </Box>
              {((props.salesCard.auction && ((props.salesCard.auction.endTime.getTime() - (Date.now() / 1000)) > 0)) || props.salesCard.sale) &&
                <SalesCard {...props.salesCard} />
              }
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default Nft
