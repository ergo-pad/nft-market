import React, { FC, useState } from 'react';
import type { NextPage } from 'next';
import {
  Grid,
  Container,
  Typography,
} from "@mui/material";
import { recentNfts } from '@components/placeholders/recentNfts'
import SalesList from '@components/SalesList';

// const marketStats = [
//   {
//     title: 'Collections',
//     number: '2'
//   },
//   {
//     title: 'NFTs',
//     number: '1452'
//   },
//   {
//     title: 'USD Traded',
//     number: '$1.83k'
//   },
//   {
//     title: 'Wallets',
//     number: '17k'
//   }
// ]

const Sales: NextPage = () => {
  // USE THIS FOR API CALL TO KNOW THE NUMBER OF NFT CARDS TO FETCH
  // CAN BE CHANGED IN <SalesList>
  const [numberNftsShowing, setNumberNftsShowing] = useState(24)

  return (
    <Container sx={{ my: '50px' }}>
      <Grid container>
        <Grid item md={6}>
          <Typography variant="h1">
            Marketplace
          </Typography>
          <Typography variant="body2">
            Here you will find token sales from third party resellers. Sales from Sky Harbor and Auction House are also displayed, and you can access their smart contracts directly through this portal.
          </Typography>
        </Grid>
        <Grid item md={6}>
          {/* <Grid container spacing={3}>
            {marketStats.map((props, i) => {
              return (
                <Grid item md={3} key={i}>
                  <Paper
                    elevation={0}
                    sx={{
                      px: '24px',
                      py: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: '700'
                      }}
                    >
                      {props.number}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        color: theme.palette.text.secondary
                      }}
                    >
                      {props.title}
                    </Typography>
                  </Paper>
                </Grid>
              )
            })}
          </Grid> */}
        </Grid>
      </Grid>
      <SalesList
        nftListArray={recentNfts}
        setDisplayNumber={setNumberNftsShowing}
      />
    </Container>
  )
}

export default Sales