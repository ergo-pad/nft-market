import React, { useState, useContext, useMemo, useEffect } from 'react';
import type { NextPage } from 'next';
import {
  Grid,
  Button,
  Container,
  Typography,
  Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PackCard from '@components/PackCard';
import { recentNfts } from '@components/placeholders/recentNfts'
import OpenPacks from '@components/dialogs/OpenPacks';
import { WalletContext } from '@contexts/WalletContext';
import NftCard from '@components/NftCard';

const randomInteger = (min: number, max: number) => {
  return (min + Math.random() * (max - min)).toFixed();
};

const Open: NextPage = () => {
  const theme = useTheme();
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const {
    walletAddress,
    setAddWalletModalOpen,
  } = useContext(WalletContext);

  const [selected, setSelected] = useState<boolean[]>([])

  const apiCallGETnfts = recentNfts
  useEffect(() => {
    setSelected(apiCallGETnfts.map((item) => false))
  }, [apiCallGETnfts])

  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);

  return (
    <>
      <Container sx={{ my: '50px' }}>
        <Grid container sx={{ mb: '36px' }} alignItems="flex-end">
          <Grid item md={6}>
            <Typography variant="h1">
              Open Packs
            </Typography>
            <Typography variant="body2" sx={{ mb: 0 }}>
              Any unopened pack tokens are visible here. You may open one at a time, or open all at once.
            </Typography>
          </Grid>
          <Grid item md={6} sx={{ textAlign: 'right' }}>
            {walletAddress !== '' && apiCallGETnfts.length > 1 && (
              <Button variant="contained" onClick={() => setConfirmationOpen(true)}>
                Open All
              </Button>
            )}
          </Grid>
        </Grid>
        {walletAddress !== '' ? (
          <Grid
            container
            spacing={2}
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
      <OpenPacks
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        packs={recentNfts.map((item) => {
          return (
            {
              name: item.name,
              collection: item.collection ? item.collection : undefined,
              artist: item.artist,
              imgUrl: item.imgUrl ? item.imgUrl : `/images/placeholder/${rand}.jpg`,
            }
          )
        })}
      />
    </>
  )
}

export default Open
