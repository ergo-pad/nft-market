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
  Slide,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button
} from '@mui/material'
import Link from '@components/Link'
import ButtonLink from '@components/ButtonLink'
import Image from 'next/image';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import dynamic from 'next/dynamic'
import NumberIncrement from '@components/forms/NumberIncrement';
import ConfirmSale from '@components/dialogs/ConfirmSale';

const TimeRemaining = dynamic(() => import('@components/TimeRemaining'), {
  ssr: false,
});

interface ISalesCardProps {
  sellerName?: string;
  sellerPfpUrl?: string;
  sellerAddress: string;
  postDate: Date;
  sale: { // use if NOT an auction
    price: number;
    currency: string;
    link: string;
    isPack?: boolean;
  };
  openNow: boolean;
  setOpenNow: React.Dispatch<React.SetStateAction<boolean>>;
  numberSold: number;
  setNumberSold: React.Dispatch<React.SetStateAction<number>>;
  apiFormSubmit: Function;
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
  artistAddress: string;
  artistLogoUrl: string;
  salesCard: ISalesCardProps;
}

////////////////////////////////////////////////////////////////////////////////////////
// BEGIN SAMPLE DATA ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

const NftType = {
  title: 'Blockheads 3 Pack',
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
    postDate: new Date(1663786534000),
    sale: {
      currency: 'Erg',
      price: 10,
      link: '/',
      isPack: true
    }
  }
}

const ApiPriceConversion: { [key: string]: number } = {
  erg: 1.77,
  ergopad: 0.0112
}

////////////////////////////////////////////////////////////////////////////////////////
// END SAMPLE DATA /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

const SalesCard: FC<ISalesCardProps> = (props) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Card>
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          wrap="nowrap"
          sx={{
            mb: '12px',
            maxWidth: '100%',
          }}
        >
          <Grid item zeroMinWidth xs>
            <Box
              sx={{
                // mb: '12px'
              }}
            >
              <Typography
                sx={{
                  mb: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
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
                ${(ApiPriceConversion['erg'] * props.sale.price).toFixed(2)} USD
              </Typography>
            </Box>
          </Grid>
          <Grid item xs="auto" sx={{ textAlign: 'right' }}>
            <Box
              sx={{
                maxWidth: '180px'
              }}
            >
              <NumberIncrement
                value={props.numberSold}
                setValue={props.setNumberSold}
                label="Quantity"
                name="Quantity"
              />
            </Box>
          </Grid>
        </Grid>
        <FormGroup sx={{ mb: '12px' }}>
          <FormControlLabel control={
            <Checkbox
              checked={props.openNow}
              onChange={() => props.setOpenNow(!props.openNow)}
              inputProps={{ 'aria-label': "Open right away (I don't need the pack tokens)" }}
            />
          } label="Open right away (I don't need the pack tokens)" />
        </FormGroup>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={() => props.apiFormSubmit(false)}
              fullWidth
              variant="outlined"
            >
              Buy with {props.sale.currency}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={() => props.apiFormSubmit(true)}
              fullWidth
              variant="contained"
            >
              Buy with SigUSD
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const Nft: NextPage<INftProps> = (props) => {
  const [numberSold, setNumberSold] = useState(1)
  const [openNow, setOpenNow] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [purchaseCurrency, setPurchaseCurrency] = useState('Erg')

  const apiFormSubmit = (isUsd: boolean) => {
    isUsd ? (
      setTotalPrice(Number((numberSold * (ApiPriceConversion[props.salesCard.sale.currency.toLowerCase()] * props.salesCard.sale.price)).toFixed(2)))
    ) : (
      setTotalPrice(numberSold * props.salesCard.sale.price)
    )
    setPurchaseCurrency(isUsd ? 'SigUSD' : props.salesCard.sale.currency)
    setConfirmationOpen(true)
  }

  const newPropsObject = {
    ...NftType,
    salesCard: {
      ...NftType.salesCard,
      openNow: openNow,
      setOpenNow: setOpenNow,
      numberSold: numberSold,
      setNumberSold: setNumberSold,
      apiFormSubmit: apiFormSubmit,
    },
  }
  props = newPropsObject
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
                {props.title}
              </Typography>

              {/* SUBTITLE */}
              <Box
                sx={{
                  mb: '12px'
                }}
              >
                {props.artistLogoUrl &&
                  <Link
                    href={'/users/' + props.artistAddress}
                    sx={{
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      mr: '6px'
                    }}
                  >
                    <Image src={props.artistLogoUrl} layout="fixed" width={32} height={32} alt="Artist Logo" />
                  </Link>
                }
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
                  <Link
                    href={'/users/' + props.artistAddress}
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
                </Typography>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  typography: 'body1',
                  '& .MuiTabPanel-root': {
                    pt: '24px'
                  }
                }}
              >
                <TabContext value={tabValue}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                      onChange={handleTabChange}
                      aria-label="NFT Information Tabs"
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                    >
                      <Tab label="Information" value="info" />
                      <Tab label="Properties" value="properties" />
                      {/* <Tab label="Activity" value="activity" /> */}
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
                            {props.collectionDescription} {props.collectionUrl && (
                              <Link href={props.collectionUrl}>
                                Learn more...
                              </Link>
                            )}
                          </Typography>


                        </>
                      )}
                      <SalesCard {...props.salesCard} />
                    </TabPanel>
                  </Slide>

                  {/* TRAITS TAB */}
                  <Slide direction="up" in={tabValue == 'properties'} mountOnEnter unmountOnExit>
                    <TabPanel value="properties">
                      <Typography sx={{ mb: '24px' }}>
                        Traits, rarity, etc.
                      </Typography>
                      <SalesCard {...props.salesCard} />
                    </TabPanel>

                  </Slide>

                  {/* ACTIVITY TAB  */}
                  {/*
                  <Slide direction="up" in={tabValue == 'activity'} mountOnEnter unmountOnExit>
                    <TabPanel value="activity">
                      <Typography sx={{ mb: '24px' }}>
                        Past sales activity
                      </Typography>
                      <SalesCard {...props.salesCard} />
                    </TabPanel>
                  </Slide>
                  */}
                </TabContext>
              </Box>

            </Box>
          </Grid>
        </Grid>
      </Container >
      <ConfirmSale
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        tokenName={props.title}
        qty={numberSold}
        openNow={openNow}
        price={totalPrice}
        currency={purchaseCurrency}
      />
    </>
  )
}

export default Nft
