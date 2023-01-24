import React, { FC, useState } from 'react';
import type { NextPage } from 'next';
import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  useMediaQuery,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  Container,
  Typography,
  Box,
  Paper
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useTheme } from "@mui/material/styles";
import FilterOptions from "@components/FilterOptions";
import { SxProps } from "@mui/material";
import BasicCard from '@components/BasicCard';
import SearchBar from '@components/SearchBar'
import SortBy from '@components/SortBy'
import PackCard from '@components/PackCard';
import { recentNfts } from '@components/placeholders/recentNfts'
import OpenPacks from '@components/dialogs/OpenPacks';

const sampleData = [
  {
    imgUrl: '/images/nft1.png',
    link: '/marketplace/hello',
    name: 'Aviator Girl  #0314',
  },
  {
    imgUrl: '/images/nft2.png',
    link: '/marketplace/hello',
    name: 'Monk & Fox #0017',
  },
  {
    imgUrl: '/images/nft-cube.png',
    link: '/marketplace/hello',
    name: 'Obsidian Cube',
  },
  {
    imgUrl: '',
    link: '/marketplace/hello',
    name: 'Obsidian Cube',
  },
  {
    imgUrl: '',
    link: '/marketplace/hello',
    name: 'Obsidian Cube',
  },
  {
    imgUrl: '',
    link: '/marketplace/hello',
    name: 'Obsidian Cube',
  },
]

const Dashboard: NextPage = () => {
  const theme = useTheme();
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  return (
    <>
      <Container sx={{ my: '50px' }}>
        <Grid container sx={{ mb: '24px' }}>
          <Grid item md={6}>
            <Typography variant="h1">
              User Dashboard
            </Typography>
            <Typography variant="body2">
              Open packs and manage your sales here.
            </Typography>
          </Grid>
        </Grid>
        <Grid container sx={{ mb: '12px' }}>
          <Grid item md={6}>
            <Typography variant="h4">
              Unopened Packs
            </Typography>
          </Grid>
          <Grid item md={6} sx={{ textAlign: 'right' }}>
            <Button variant="contained"  onClick={() => setConfirmationOpen(true)}>
              Open All
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          sx={{ mb: "80px" }}
        >
          {recentNfts.map((props, i) => {
            return (
              <Grid key={i} item xs={1}>
                <PackCard
                  key={i}
                  link={props.link}
                  imgUrl={props.imgUrl}
                  name={props.name}
                  // price={props.price}
                  rarity={props.rarity}
                  // time={props.time}
                  collection={props.collection}
                  collectionLink={props.collectionLink}
                  artist={props.artist}
                  artistLink={props.artistLink}
                  artistLogo={props.artistLogo}
                />
              </Grid>
            )
          })}
        </Grid>

        <Grid container sx={{ mb: '12px' }}>
          <Grid item md={6}>
            <Typography variant="h4">
              Current Sales
            </Typography>
          </Grid>
          <Grid item md={6} sx={{ textAlign: 'right' }}>
            <Button variant="contained" href="/create/">
              Create A Sale
            </Button>
          </Grid>
        </Grid>
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
              imgUrl: item.imgUrl,
            }
          )
        })}
      />
    </>
  )
}

export default Dashboard
