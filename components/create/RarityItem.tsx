import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Icon,
  IconButton,
  TextField,
  useTheme
} from '@mui/material'
import { IRarityData } from '@pages/mint';

const RarityItem: FC<{
  data: IRarityData[];
  setData: React.Dispatch<React.SetStateAction<IRarityData[]>>;
  i: number;
}> = ({
  data,
  setData,
  i,
  // images 
}) => {
    const [localRarity, setLocalRarity] = useState('')
    const theme = useTheme()

    const removeItem = (index: number) => {
      setData(current => current.filter((_item, idx) => idx !== index))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalRarity(e.target.value)
    }

    useEffect(() => {
      const timeout = setTimeout(() => {
        setData((prevArray) => {
          const newArray = prevArray.map((item, index) => {
            if (index === i && item.rarity !== localRarity) {
              return {
                ...item,
                rarity: localRarity
              }
            }
            return item
          })
          return newArray
        })
      }, 1000);
      return () => clearTimeout(timeout);
    }, [localRarity])

    useEffect(() => {
      setLocalRarity(data[i].rarity)
    }, [])

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
              value={localRarity}
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