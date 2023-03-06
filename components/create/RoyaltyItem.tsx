import React, { FC } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoyaltyData((prevArray) => {
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
              value={royaltyData[index].address}
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
              value={royaltyData[index].pct}
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