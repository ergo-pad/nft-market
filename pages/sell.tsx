import React, { useState, useContext, useMemo, useEffect } from 'react';
import type { NextPage } from 'next';
import {
  Grid,
  Button,
  Container,
  Typography,
  Box,
  useScrollTrigger
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { recentNfts } from '@components/placeholders/recentNfts'
import SellTokens from '@components/dialogs/SellTokens';
import { WalletContext } from '@contexts/WalletContext';
import NftCard from '@components/NftCard';

// API REQUIREMENTS: 
// - GET user's current tokens (from user wallet address)
// - POST new sale, with given parameters

const randomInteger = (min: number, max: number) => {
  return (min + Math.random() * (max - min)).toFixed();
};

const Sell: NextPage = () => {
  const theme = useTheme();
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const {
    walletAddress,
    setAddWalletModalOpen,
  } = useContext(WalletContext);

  const [selected, setSelected] = useState<boolean[]>([])

  const selectAll = () => {
    setSelected(prev => (
      prev.map(() => true)
    ))
  }

  const selectNone = () => {
    setSelected(prev => (
      prev.map(() => false)
    ))
  }

  const apiCallGETnfts = recentNfts
  useEffect(() => {
    setSelected(apiCallGETnfts.map((item) => false))
  }, [apiCallGETnfts])

  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <>
      {walletAddress !== '' && apiCallGETnfts.length > 1 && (
        <Box
          sx={{
            position: 'fixed',
            top: trigger ? "60px" : "90px",
            transition: 'top 200ms linear',
            background: theme.palette.mode == 'dark' ? "rgba(15,21,32,0.9)" : "rgba(235,235,235,0.9)",
            borderBottom: theme.palette.mode == 'dark' ? "1px solid #1d242f" : "1px solid rgba(140,140,140,0.2)",
            backdropFilter: "blur(25px)",
            zIndex: 100,
            width: '100%',
          }}
        >
          <Container sx={{ textAlign: 'right', py: '6px' }}>
            <Button
              size="small"
              variant="text"
              sx={{ mr: '6px' }}
              onClick={() => selectAll()}
            >
              Select All
            </Button>
            <Button
              size="small"
              variant="text"
              sx={{ mr: '6px' }}
              onClick={() => selectNone()}
            >
              Select None
            </Button>
            <Button
              size="small"
              variant="text"
              disabled={selected.filter(item => item === true).length < 1}
              onClick={() => setConfirmationOpen(true)}
            >
              Sell Selected
            </Button>
          </Container>
        </Box>
      )}
      <Container sx={{ mt: '70px', mb: '50px' }}>
        <Grid container sx={{ mb: '36px' }} alignItems="flex-end">
          <Grid item md={6}>
            <Typography variant="h1">
              Create a Sale
            </Typography>
            <Typography variant="body2" sx={{ mb: 0 }}>
              Select the tokens you&apos;d like to sell.
            </Typography>
          </Grid>
          <Grid item md={6} sx={{ textAlign: 'right' }}>

          </Grid>
        </Grid>
        {walletAddress !== '' ? (
          <Grid
            container
            spacing={2}
            columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
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
      <SellTokens
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        tokens={recentNfts.filter((_item, i) => selected[i] === true).map((item) => {
          return (
            {
              name: item.name,
              collection: item.collection ? item.collection : undefined,
              artist: '', // need to implement getArtist()
              imgUrl: item.imgUrl ? item.imgUrl : `/images/placeholder/${rand}.jpg`,
            }
          )
        })}
      />
    </>
  )
}

export default Sell
