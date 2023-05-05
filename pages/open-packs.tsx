import React, { useState, useContext, useMemo, useEffect } from 'react';
import type { NextPage } from 'next';
import {
  Grid,
  Button,
  Container,
  Typography,
  Box,
  useScrollTrigger,
  CircularProgress
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import OpenPacks from '@components/dialogs/OpenPacks';
import { WalletContext } from '@contexts/WalletContext';
import NftCard from '@components/NftCard';
import { getWalletList, tokenListInfo } from "@utils/assetsNew";

const randomInteger = (min: number, max: number) => {
  return (min + Math.random() * (max - min)).toFixed();
};

const Open: NextPage = () => {
  const theme = useTheme();
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const {
    walletAddress,
    setAddWalletModalOpen,
    dAppWallet
  } = useContext(WalletContext);
  const [nftList, setNftList] = useState<any[] | undefined>()
  const [selected, setSelected] = useState<boolean[]>([])
  const [loading, setLoading] = useState(true)

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

  interface ObjectWithQty {
    [key: string]: any;
    qty: number;
  }

  function expandArrayObjects<T extends ObjectWithQty>(arr: T[]): T[] {
    return ([] as T[]).concat(...arr.map(obj => {
      let repeatedObjs = Array(obj.amount).fill({} as T);
      Object.keys(obj).forEach(key => {
        repeatedObjs.forEach((repeatedObj, i) => {
          repeatedObj[key] = obj[key];
        });
      });
      return repeatedObjs;
    }));
  }
  
  const fetchData = async (addresses: any[]) => {
    const tokenList: any[] = await getWalletList(addresses);
    const additionalData = await tokenListInfo(tokenList);
    const packTokenList = additionalData.filter((item) => item.type === 'PACK')
    const expandedList = expandArrayObjects(packTokenList)
    setNftList(expandedList)
    setSelected(expandedList.map(() => {
      return false
    }))
    setLoading(false)
  };

  useEffect(() => {
    if (dAppWallet.connected === true) {
      fetchData(dAppWallet.addresses);
    }
    else fetchData([walletAddress])
  }, [dAppWallet, walletAddress]);

  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return (
    <>
      {walletAddress !== '' && nftList && (
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
              Open Selected
            </Button>
          </Container>
        </Box>
      )}
      <Container sx={{ mt: '70px', mb: '50px' }}>
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

          </Grid>
        </Grid>
        {loading
          ?
          <Box sx={{ textAlign: 'center', py: '10vh', width: '100%' }}>
            <CircularProgress />
          </Box>
          : walletAddress !== '' && nftList && nftList.length > 0
            ?
            <Grid
              container
              spacing={2}
              columns={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5 }}
              sx={{ mb: "80px" }}
            >
              {nftList.map((item: any, i: number) => {
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
            :
            walletAddress !== '' && nftList && nftList.length === 0 ? 
            <Box sx={{ textAlign: 'center', py: '20vh' }}>
              <Typography variant="h4" color="text.secondary">
                You don&apos;t have any unopened packs. 
              </Typography>
            </Box>
            :
            <Box sx={{ textAlign: 'center', py: '20vh' }}>
              <Typography variant="body2" sx={{ mb: '12px' }}>
                You must connect a wallet to use this feature.
              </Typography>
              <Button variant="contained" onClick={() => setAddWalletModalOpen(true)}>
                Connect Now
              </Button>
            </Box>
        }

      </Container>
      {nftList && selected.find((item => item === true)) &&
        <OpenPacks
          open={confirmationOpen}
          setOpen={setConfirmationOpen}
          packs={nftList.filter((_item, i) => selected[i] === true).map((item) => {
            return (
              {
                name: item.name,
                collection: item.collection ? item.collection : undefined,
                artist: '', // need to implement getArtist()
                imgUrl: item.imgUrl ? item.imgUrl : `/images/placeholder/${rand}.jpg`,
                tokenId: item.tokenId
              }
            )
          })}
        />
      }
    </>
  )
}

export default Open