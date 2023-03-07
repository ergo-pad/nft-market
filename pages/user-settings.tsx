import type { NextPage } from 'next'
import React, { useState } from 'react';
import {
  // useTheme,
  // useMediaQuery,
  Typography,
  Button,
  Box
} from '@mui/material'
import ButtonLink from '@components/ButtonLink'
import ArtistForm from '@components/create/ArtistForm'
import { IArtistData, artistDataInit } from '@pages/create'
import UserProfile from '@components/UserProfile';

const UserSettings: NextPage = () => {
  // const theme = useTheme()
  // const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [artistData, setArtistData] = useState<IArtistData>(artistDataInit)
  const [clearArtistForm, setClearArtistForm] = useState(false)
  console.log(artistData)
  return (
    <UserProfile
      address={artistData.address}
      username={artistData.name}
      pfpUrl={artistData.avatarUrl}
      bannerUrl={artistData.bannerUrl}
      tagline={artistData.tagline}
      website={artistData.website}
      socialLinks={artistData.social}
    >
      <Typography variant="h4">
        Update Your Profile
      </Typography>
      <Typography variant="body2">
        Change your user profile here. You must sign with your wallet to verify the changes.
      </Typography>
      <ArtistForm
        artistData={artistData}
        setArtistData={setArtistData}
        clearForm={clearArtistForm}
        setClearForm={setClearArtistForm}
      />
      <Box sx={{ width: '100%', textAlign: 'right' }}>
        <Button variant="contained">
          Save Changes
        </Button>
      </Box>
    </UserProfile>
  )
}

export default UserSettings
