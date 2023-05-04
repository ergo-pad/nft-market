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
import { IFileUrl } from '@components/forms/FileUploadArea';
import { IArtistData, artistDataInit } from '@pages/mint';
import { ApiContext, IApiContext } from "@contexts/ApiContext";

const artistSocialsInit = {
  id: uuidv4(),
  network: '',
  url: '',
}

interface IArtistFormProps {
  artistData: IArtistData;
  setArtistData: React.Dispatch<React.SetStateAction<IArtistData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
  disableArtist?: boolean;
}

export const validateWebsiteUrl = (websiteUrl: string) => {
  const urlRegExp: RegExp = /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#@.-]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$/
  return urlRegExp.test(String(websiteUrl).toLowerCase());
}

const ArtistForm: FC<IArtistFormProps> = ({ artistData, setArtistData, clearForm, setClearForm, disableArtist }) => {
  const {
    walletAddress,
    setAddWalletModalOpen
  } = useContext(WalletContext);
  const theme = useTheme()
  const apiContext = useContext<IApiContext>(ApiContext);

  // ARTIST DATA STATES //
  const [artistAvatarImg, setArtistAvatarImg] = useState<IFileUrl[]>([])
  const [artistBannerImg, setArtistBannerImg] = useState<IFileUrl[]>([])
  const [artistSocials, setArtistSocials] = useState([artistSocialsInit])

  // ERROR VALIDATION //
  const [websiteError, setWebsiteError] = useState(false)
  const [socialErrors, setSocialErrors] = useState([false])

  const handleArtistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtistData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isUrl = validateWebsiteUrl(e.target.value)
    if (isUrl) setWebsiteError(false)
    else setWebsiteError(true)
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
    setArtistData(prev => ({ ...prev, avatarUrl: artistAvatarImg[0]?.url }))
  }, [JSON.stringify(artistAvatarImg)])
  useEffect(() => {
    setArtistData(prev => ({ ...prev, bannerUrl: artistBannerImg[0]?.url }))
  }, [JSON.stringify(artistBannerImg)])

  const [clearTriggerAvatar, setClearTriggerAvatar] = useState(false)
  const [clearTriggerBanner, setClearTriggerBanner] = useState(false)

  useEffect(() => {
    if (clearForm === true) {
      setClearTriggerAvatar(true)
      setClearTriggerBanner(true)
      setArtistSocials([artistSocialsInit])
      setArtistData(artistDataInit)
      setClearForm(false)
    }
  }, [clearForm])

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const res = await apiContext.api.get(`/user/${walletAddress}`);
        console.log(res.data)
        setArtistData({
          address: walletAddress,
          name: res.data.name,
          website: res.data.website,
          tagline: res.data.tagline,
          avatarUrl: res.data.pfpUrl,
          bannerUrl: res.data.bannerUrl,
          social: res.data.socials,
        })
        setArtistAvatarImg([{
          url: res.data.pfpUrl,
          ipfs: ''
        }])
        setArtistBannerImg([{
          url: res.data.bannerUrl,
          ipfs: ''
        }])
        setArtistSocials(res.data.socials.map((item: any) => {
          return {
            id: uuidv4(),
            network: item.socialNetwork,
            url: item.url
          }
        }))
      } catch (e: any) {
        apiContext.api.error(e);
      }
    };
    if (walletAddress) getUserProfile()
  }, [walletAddress]);

  return (
    <Box>
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
            label={disableArtist ? "Name" : "Artist Name"}
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
            error={websiteError}
            onChange={handleWebsiteChange}
            value={artistData.website}
            helperText={websiteError && "Enter a valid URL"}
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
            title={disableArtist ? "Profile Image" : "Artist Profile Image"}
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
            title={disableArtist ? "Banner" : "Artist Banner"}
            fileUrls={artistBannerImg}
            setFileUrls={setArtistBannerImg}
            expectedImgHeight={260}
            expectedImgWidth={3840}
            clearTrigger={clearTriggerBanner}
            setClearTrigger={setClearTriggerBanner}
          />
        </Grid>
      </Grid>
      <SocialSection data={artistSocials} setData={setArtistSocials} errors={socialErrors} setErrors={setSocialErrors} />
    </Box>
  );
};

export default ArtistForm;