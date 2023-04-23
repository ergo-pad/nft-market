import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Icon,
  Button
} from '@mui/material'
import ButtonLink from '@components/ButtonLink'
import dynamic from 'next/dynamic'
// import ConfirmPurchase from '@components/dialogs/ConfirmPurchase';

const TimeRemaining = dynamic(() => import('@components/TimeRemaining'), {
  ssr: false,
});

/// API NEEDED ////////
const ApiPriceConversion: { [key: string]: number } = {
  erg: 1.51,
  ergopad: 0.006
}
/// END API NEEDED ///

export interface ISalesCardProps {
  sellerName?: string;
  sellerPfpUrl?: string;
  sellerAddress: string;
  artistAddress: string;
  postDate: Date;
  tokenName: string;
  sale?: { // use if NOT an auction
    price: number;
    currency: string;
    link: string;
    discountCurrency?: string;
    discount?: number;
    isPack?: boolean;
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

const MarketSalesCard: FC<ISalesCardProps> = (props) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [totalPrice, setTotalPrice] = useState(props.sale ? props.sale.price : props.auction?.currentBidPrice)
  const [purchaseCurrency, setPurchaseCurrency] = useState('Erg')
  const [isBid, setIsBid] = useState(false)

  const apiFormSubmit = (buyNow: number, bid: boolean) => {
    if (bid) setIsBid(true)
    else setIsBid(false)
    let obj = {
      currency: '',
      // @ts-ignore
      price: bid ? props.auction.currentBidPrice : buyNow,
    }
    if (props.auction) {
      obj = {
        currency: props.auction.currency,
        price: bid ? props.auction.currentBidPrice : buyNow
      }
    }
    else if (props.sale) {
      obj = {
        currency: props.sale.currency,
        price: props.sale.price
      }
    }
    obj.currency === 'SigUSD' ? (
      setTotalPrice(Number(((ApiPriceConversion[obj.currency.toLowerCase()] * obj.price)).toFixed(2)))
    ) : (
      setTotalPrice(obj.price)
    )
    setPurchaseCurrency(obj.currency === 'SigUSD' ? 'SigUSD' : obj.currency)
    setConfirmationOpen(true)
  }
  return (
    <>
      <Card sx={{ mb: '12px' }}>
        <CardContent sx={{}}>
          <Grid
            container
            justifyContent="space-between"
            wrap="nowrap"
            sx={{
              mb: '24px',
              maxWidth: '100%',
            }}
          >
            <Grid item zeroMinWidth xs>
              <Typography
                sx={{
                  mb: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  lineHeight: 1.3
                }}
              >
                {props.sellerAddress === props.artistAddress ?
                  (
                    props.sale ? 'Sale by Artist' : 'Auction by Artist'
                  ) : (
                    props.sale ? 'Third Party Sale' : 'Auction by Third Party'
                  )}
              </Typography>
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
                <Box sx={{ display: 'inline-block' }}>{'List Date: ' + props.postDate.toDateString()}</Box>
              </Box>
            </Grid>
            <Grid item xs="auto" sx={{ textAlign: 'right' }}>
              {props.sale &&
                <>
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
                    ${(ApiPriceConversion[props.sale.currency.toLowerCase()] * props.sale.price).toFixed(2)} USD
                  </Typography>
                </>
              }
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
                <Box
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: '700',
                  }}
                >
                  <TimeRemaining endTime={props.auction.endTime} />
                </Box>
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
                <Button
                  // @ts-ignore
                  onClick={() => apiFormSubmit(props.auction.buyNowPrice, true)}
                  fullWidth
                  variant="outlined"
                >
                  Place {props.auction.currency} bid
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                // @ts-ignore
                  onClick={() => apiFormSubmit(props.auction.buyNowPrice)}
                  fullWidth
                  variant="contained"
                >
                  Buy now for {props.auction.buyNowPrice + ' ' + props.auction.currency}
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
      {/* <ConfirmPurchase
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        tokenName={props.tokenName}
        isBid={props.auction && isBid}
        // qty={numberSold}
        // openNow={openNow}
        price={totalPrice ? totalPrice : 0}
        currency={purchaseCurrency}
      /> */}
    </>
  )
};

export default MarketSalesCard;