import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Icon,
  IconButton,
  TextField,
  Collapse,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material'
import FileUploadArea from '@components/forms/FileUploadArea'
import { IRarityData } from '@pages/mint';
import { IFileUrl } from '@components/forms/FileUploadArea';

const RarityItem: FC<{
  data: IRarityData[];
  setData: React.Dispatch<React.SetStateAction<IRarityData[]>>;
  // images?: boolean;
  i: number;
}> = ({ 
  data, 
  setData, 
  i, 
  // images 
}) => {
  const [rarityImg, setRarityImg] = useState<IFileUrl[]>([])
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [imgClearTrigger, setImgClearTrigger] = useState(false)

  useEffect(() => {
    setData((prevArray) => {
      const newArray = prevArray.map((item, index) => {
        if (index === i) {
          return {
            ...item,
            image: rarityImg[0]?.url
          }
        }
        return item
      })
      return newArray
    })
  }, [JSON.stringify(rarityImg)])

  const removeItem = (index: number) => {
    setData(current => current.filter((_item, idx) => idx !== index))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevArray) => {
      const newArray = prevArray.map((item, index) => {
        if (index === i) {
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

  return (
    <>
      {/* <Collapse in={images} mountOnEnter unmountOnExit>
        <Grid container spacing={1} sx={{ mb: '16px' }} alignItems="stretch">
          <Grid item xs={12} sm={3}>
            <FileUploadArea
              fileUrls={rarityImg}
              setFileUrls={setRarityImg}
              autoUpload
              clearTrigger={imgClearTrigger}
              setClearTrigger={setImgClearTrigger}
              imgFill
              sx={{
                height: '100%'
              }}
            />
          </Grid>
          <Grid item container direction="column" justifyContent="space-between" spacing={1} xs={12} sm={9}>
            <Grid item>
              <Grid
                container
                spacing={1}
                alignItems="center"
              >
                <Grid item xs>
                  <TextField
                    fullWidth
                    variant="filled"
                    id="rarity-name"
                    name="rarity"
                    label="Rarity"
                    value={data[i].rarity}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs="auto" sx={{ display: i === 0 ? 'none' : 'flex' }}>
                  <IconButton onClick={() => removeItem(i)}>
                    <Icon>
                      delete
                    </Icon>
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                variant="filled"
                id="rarity-description"
                name="description"
                label="Description"
                value={data[i].description}
                onChange={handleChange}
                multiline
                minRows={2}
                sx={{
                  flex: '0 1 100%',
                  height: '100%',
                  '& .MuiInputBase-root': {
                    flex: '0 1 100%',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Collapse> */}
      {/* <Collapse in={!images} mountOnEnter unmountOnExit> */}
        <Grid container spacing={1} sx={{ mb: '16px' }}>
          <Grid item xs={12} sm={3}>
            <Grid
              container
              spacing={1}
              alignItems="center"
            >
              <Grid item xs>
                <TextField
                  fullWidth
                  variant="filled"
                  id="rarity-name"
                  name="rarity"
                  label="Rarity"
                  value={data[i].rarity}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs="auto" sx={{ display: upSm || i === 0 ? 'none' : 'flex' }}>
                <IconButton
                  onClick={() => removeItem(i)}
                >
                  <Icon>
                    delete
                  </Icon>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Grid
              container
              spacing={1}
              alignItems="center"
            >
              <Grid item xs>
                <TextField
                  fullWidth
                  variant="filled"
                  id="rarity-description"
                  name="description"
                  label="Description"
                  value={data[i].description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs="auto" sx={{ display: !upSm || i === 0 ? 'none' : 'flex' }}>
                <IconButton onClick={() => removeItem(i)} >
                  <Icon>
                    delete
                  </Icon>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      {/* </Collapse> */}
    </>
  )
}

export default RarityItem;