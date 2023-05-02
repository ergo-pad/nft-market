import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  useTheme,
  useMediaQuery,
  Icon,
  IconButton,
  TextField,
} from '@mui/material'
import { IRoyaltyItem } from '@components/create/TokenDetailsForm'

const RoyaltyItem: FC<{
  index: number;
  id: string;
  royaltyData: IRoyaltyItem[];
  setRoyaltyData: React.Dispatch<React.SetStateAction<IRoyaltyItem[]>>;
}> = ({ index, id, royaltyData, setRoyaltyData }) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [localRoyaltyData, setLocalRoyaltyData] = useState({
    address: '',
    pct: 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalRoyaltyData(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRoyaltyData((prevArray) => {
        const newArray = prevArray.map((item, i) => {
          if (index === i) {
            return {
              ...item,
              ...localRoyaltyData
            }
          }
          return item
        })
        return newArray
      })
    }, 3000);
    return () => clearTimeout(timeout);
  }, [localRoyaltyData])

  useEffect(() => {
    setLocalRoyaltyData({
      address: royaltyData[index].address,
      pct: royaltyData[index].pct,
    })
  }, [])

  const removeItem = (idx: number) => {
    setRoyaltyData(c => c.filter((_current, i) => i !== idx))
  }

  return (
    <Grid container spacing={1} sx={{
      mb: '16px',
    }}>
      <Grid item sm={8} xs={12}>
        <Grid
          container

          alignItems="center"
        >
          <Grid item xs>
            <TextField
              fullWidth
              variant="filled"
              id="royalty-address"
              label="Address"
              name="address"
              value={localRoyaltyData.address}
              onChange={handleChange}
            />
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
      <Grid item sm={4} xs={12}>
        <Grid
          container

          alignItems="center"
        >
          <Grid item xs>
            <TextField
              fullWidth
              variant="filled"
              id="royalty-percent"
              label="Percent of Sales Price"
              name="pct"
              type="number"
              value={localRoyaltyData.pct}
              onChange={handleChange}
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

export default RoyaltyItem;