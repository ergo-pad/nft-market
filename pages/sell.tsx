import React, { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next'
import {
  Container,
  useTheme,
  useMediaQuery,
  Grid,
  Typography,
  Button,
  Box
} from '@mui/material'
import { WalletContext } from '@contexts/WalletContext';
import { recentNfts } from '@components/placeholders/recentNfts'
import { DataGrid } from '@mui/x-data-grid';
import NftCard from '@components/NftCard';

// API REQUIREMENTS: 
// - GET user's current tokens (from user wallet address)
// - POST new sale, with given parameters

const Sell: NextPage = () => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const {
    walletAddress,
    setAddWalletModalOpen,
  } = useContext(WalletContext);

  const [selected, setSelected] = useState<boolean[]>([])

  const apiCallGETnfts = recentNfts
  useEffect(() => {
    setSelected(apiCallGETnfts.map((item) => false))
  }, [apiCallGETnfts])

  return (
    <Container sx={{ my: '50px' }}>
      <Box>
        <Typography variant="h1">
          Create a Sale
        </Typography>
        <Typography variant="body2" sx={{ mb: '48px' }}>
          Select the tokens you&apos;d like to sell.
        </Typography>
      </Box>
      {walletAddress !== '' ? (
        <Grid
          container
          spacing={3}
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          sx={{ mb: "80px" }}
        >
          {apiCallGETnfts.map((item, i) => {
            return (
              <Grid key={i} item xs={1}>
                <NftCard
                  nftData={item}
                  index={i}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Grid>
            )
          })}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: '20vh' }}>
          <Typography variant="body2" sx={{ mb: '12px' }}>
            You must connect a wallet to use this feature.
          </Typography>
          <Button variant="contained" onClick={() => setAddWalletModalOpen(true)}>
            Connect Now
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default Sell
