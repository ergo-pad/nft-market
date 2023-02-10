import React, { FC, useState, useContext, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  useTheme,
  Button,
  TextField,
} from '@mui/material'
import { WalletContext } from '@contexts/WalletContext'
import FileUploadArea from '@components/forms/FileUploadArea'
import { v4 as uuidv4 } from 'uuid';
import SocialSection from '@components/create/SocialSection';

export interface IArtistData {
  address: string;
  name?: string;
  website?: string;
  tagline?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  social?: {
    socialNetwork: string;
    url: string;
  }[];
}

export const artistDataInit: IArtistData = {
  address: '',
  name: '',
  website: '',
  tagline: '',
  avatarUrl: '',
  bannerUrl: '',
  social: []
}

interface IArtistFormProps {
  artistData: IArtistData;
  setArtistData: React.Dispatch<React.SetStateAction<IArtistData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArtistForm: FC<IArtistFormProps> = ({ artistData, setArtistData, clearForm, setClearForm }) => {
  const {
    walletAddress,
    setAddWalletModalOpen
  } = useContext(WalletContext);
  const theme = useTheme()

  // ARTIST DATA STATES //
  const [artistAvatarImg, setArtistAvatarImg] = useState([''])
  const [artistBannerImg, setArtistBannerImg] = useState([''])
  const [artistSocials, setArtistSocials] = useState([{
    id: uuidv4(),
    network: '',
    url: '',
  }])
  const handleArtistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtistData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  useEffect(() => {
    setArtistData(prev => ({ ...prev, address: walletAddress }))
  }, [walletAddress])
  useEffect(() => {
    const socials = artistSocials.map(({ network, url }) => {
      return {
        socialNetwork: network,
        url: url
      }
    })
    setArtistData(prev => ({ ...prev, social: socials }))
  }, [JSON.stringify(artistSocials)])
  useEffect(() => {
    setArtistData(prev => ({ ...prev, avatarUrl: artistAvatarImg[0] }))
  }, [JSON.stringify(artistAvatarImg)])
  useEffect(() => {
    setArtistData(prev => ({ ...prev, bannerUrl: artistBannerImg[0] }))
  }, [JSON.stringify(artistBannerImg)])

  const [clearTriggerAvatar, setClearTriggerAvatar] = useState(false)
  const [clearTriggerBanner, setClearTriggerBanner] = useState(false)

  useEffect(() => {
    setClearTriggerAvatar(true)
    setClearTriggerBanner(true)
    setArtistSocials([{
      id: uuidv4(),
      network: '',
      url: '',
    }])
    setArtistData(artistDataInit)
    setClearForm(false)
  }, [clearForm])

  return (
    <Box>
      <Typography variant="h4">
        Artist Info
      </Typography>
      <Grid container spacing={2} sx={{ mb: '24px' }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="filled"
            id="wallet-address"
            label="Wallet Address"
            name="address"
            value={walletAddress}
            onClick={() => {
              setAddWalletModalOpen(true)
            }}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            variant="filled"
            id="artist-name"
            label="Artist Name"
            name="name"
            onChange={handleArtistChange}
            value={artistData.name}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            variant="filled"
            id="artist-website"
            label="Website"
            name="website"
            onChange={handleArtistChange}
            value={artistData.website}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="filled"
            id="artist-tagline"
            label="Tagline"
            name="tagline"
            multiline
            minRows={3}
            onChange={handleArtistChange}
            value={artistData.tagline}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUploadArea
            title="Artist Profile Image"
            fileUrls={artistAvatarImg}
            setFileUrls={setArtistAvatarImg}
            expectedImgHeight={120}
            expectedImgWidth={120}
            type="avatar"
            clearTrigger={clearTriggerAvatar}
            setClearTrigger={setClearTriggerAvatar}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUploadArea
            title="Artist Banner"
            fileUrls={artistBannerImg}
            setFileUrls={setArtistBannerImg}
            expectedImgHeight={260}
            expectedImgWidth={3840}
            clearTrigger={clearTriggerBanner}
            setClearTrigger={setClearTriggerBanner}
          />
        </Grid>
      </Grid>
      <SocialSection data={artistSocials} setData={setArtistSocials} />
      <Button onClick={() => console.log(artistData)}>Console log data</Button>
    </Box>
  );
};

export default ArtistForm;