import React, { FC, useState } from 'react';
import {
  Grid,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Icon,
  IconButton,
  FormControl,
  InputLabel,
  TextField,
  SelectChangeEvent,
} from '@mui/material'
import { validateWebsiteUrl } from '@components/create/ArtistForm';

interface IArtistSocial {
  id: string;
  network: string;
  url: string;
}

const SocialItem: FC<{
  index: number;
  id: string;
  socialData: IArtistSocial[];
  setSocialData: React.Dispatch<React.SetStateAction<IArtistSocial[]>>;
  errors: boolean[]
  setErrors: React.Dispatch<React.SetStateAction<boolean[]>>;
}> = ({ index, id, socialData, setSocialData, errors, setErrors }) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [sortOption, setSortOption] = useState("");

  const handleChange = (e: SelectChangeEvent) => {
    setSortOption(e.target.value as string);
    setSocialData((prevArray) => {
      const newArray = prevArray.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            network: e.target.value
          }
        }
        return c
      })
      return newArray
    })
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isUrl = validateWebsiteUrl(e.target.value)
    if (isUrl) setErrors((prevArray) => {
      const newArray = prevArray.map((item, i) => {
        if (i === index) {
          return false
        }
        return item
      })
      return newArray
    })
    else setErrors((prevArray) => {
      const newArray = prevArray.map((item, i) => {
        if (i === index) {
          return true
        }
        return item
      })
      return newArray
    })
    setSocialData((prevArray) => {
      const newArray = prevArray.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [e.target.name]: e.target.value
          }
        }
        return item
      })
      return newArray
    })
  }

  const removeItem = (idx: number) => {
    setSocialData(c => c.filter((_current, i) => i !== idx))
    setErrors(c => c.filter((_current, i) => i !== idx))
  }

  return (
    <Grid container spacing={1} sx={{
      mb: '16px',
    }}>
      <Grid item sm={4} xs={12}>
        <Grid
          container
          spacing={1}
          alignItems="center"
        >
          <Grid item xs>
            <FormControl fullWidth variant="filled">
              <InputLabel id={'social-network-' + index}>Social Network</InputLabel>
              <Select
                labelId="sort-select-box-label"
                id="sort-select-box"
                value={sortOption}
                label="Sort By"
                onChange={handleChange}
              >
                <MenuItem value={"telegram"}>Telegram</MenuItem>
                <MenuItem value={"discord"}>Discord</MenuItem>
                <MenuItem value={"twitter"}>Twitter</MenuItem>
                <MenuItem value={"reddit"}>Reddit</MenuItem>
                <MenuItem value={"tiktok"}>TikTok</MenuItem>
                <MenuItem value={"medium"}>Medium</MenuItem>
                <MenuItem value={"linkdin"}>Linkdin</MenuItem>
                <MenuItem value={"twitch"}>Twitch</MenuItem>
                <MenuItem value={"behance"}>Behance</MenuItem>
                <MenuItem value={"youtube"}>YouTube</MenuItem>
                <MenuItem value={"vimeo"}>Vimeo</MenuItem>
                <MenuItem value={"instagram"}>Instagram</MenuItem>
                <MenuItem value={"other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs="auto" sx={{ display: upSm || index === 0 ? 'none' : 'flex' }}>
            <IconButton

              onClick={() => removeItem(index)}
            >
              <Icon>
                delete
              </Icon>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={8} xs={12}>
        <Grid
          container
          spacing={1}
          alignItems="center"
        >
          <Grid item xs>
            <TextField
              fullWidth
              variant="filled"
              id="social-network-link"
              label="Profile Link"
              name="url"
              value={socialData[index].url}
              onChange={handleUrlChange}
              error={errors[index]}
            />
          </Grid>
          <Grid item xs="auto">
            <IconButton
              sx={{ display: !upSm || index === 0 ? 'none' : 'flex' }}
              onClick={() => removeItem(index)}
            >
              <Icon>
                delete
              </Icon>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SocialItem;