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

const SalesCard: FC<ISalesCardProps> = (props) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  return (
    <Card sx={{ mb: '12px' }}>
      <CardContent>
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
                  props.sale ? 'Sale by Artist' : 'Artist Auction'
                ) : (
                  props.sale ? 'Third Party Sale' : 'Third Party Auction'
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
};

export default SalesCard;