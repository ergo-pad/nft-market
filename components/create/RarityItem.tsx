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
        <Grid
          container
          spacing={1}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Grid item xs>
            <TextField
              fullWidth
              variant="filled"
              id="rarity-name"
              name="rarity"
              label="Rarity Name"
              value={data[i].rarity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs="auto">
            <IconButton
              onClick={() => removeItem(i)}
            >
              <Icon>
                delete
              </Icon>
            </IconButton>
          </Grid>
        </Grid>
      </>
    )
  }

export default RarityItem;