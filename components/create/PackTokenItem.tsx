import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Icon,
  TextField,
  useTheme,
  Button,
  Slider
} from '@mui/material'
import InputSlider from '@components/forms/InputSlider';
import { IRarityItem } from '@components/create/RaritySection';
import { IDataObject } from '@components/create/PackTokenSection';

interface IPackTokenItemProps {
  data: IDataObject[];
  setData: React.Dispatch<React.SetStateAction<IDataObject[]>>;
  index: number;
  rarityData: IRarityItem[];
}

const PackTokenItem: FC<IPackTokenItemProps> = ({ data, setData, index, rarityData }) => {
  const theme = useTheme()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArray = data.map((item, i) => {
      if (i === index) {
        var regex = /^[0-9]+$/;
        if (!e.target.value.match(regex)) {
          console.log('string')
          return {
            ...item,
            [e.target.name]: e.target.value
          }
        }
        else {
          return {
            ...item,
            [e.target.name]: Number(e.target.value)
          }
        }
      }
      return item
    })
    setData(newArray)
  }
  const handleChangeNum = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, max?: number) => {
    const newArray = data.map((item, i) => {
      if (i === index) {
        var regex = /^[0-9]+$/;
        if (e.target.value.match(regex)) {
          if ((max && Number(e.target.value) <= max) || max === undefined) {
            return {
              ...item,
              [e.target.name]: Number(e.target.value)
            }
          }
          else if (max && Number(e.target.value) > max) {
            return {
              ...item,
              [e.target.name]: max
            }
          }
        }
        else if (e.target.value === '' || e.target.value === undefined || e.target.value === null) {
          return {
            ...item,
            [e.target.name]: ''
          }
        }
      }
      return item
    })
    setData(newArray)
  }
  const handleNumberIncrement = (name: 'nftAmount' | 'packAmount', direction: 'up' | 'down', max?: number) => {
    const newArray = data.map((item, i) => {
      if (i === index) {
        if (direction === 'up' && ((max && item[name] < max) || max === undefined)) {
          return {
            ...item,
            [name]: Number(item[name]) + 1
          }
        }
        if (direction === 'down' && item[name] > 1) {
          return {
            ...item,
            [name]: Number(item[name]) - 1
          }
        }
      }
      return item
    })
    setData(newArray)
  }
  return (
    <>
      <Grid container spacing={1} sx={{ mb: '16px' }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="filled"
            id="pack-name"
            label="Pack Name"
            name="name"
            value={data[index].name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="filled"
            id="pack-amount"
            label="Number of Packs"
            inputProps={{
              inputMode: 'numeric',
            }}
            name="packAmount"
            value={data[index].packAmount}
            onChange={handleChangeNum}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container sx={{ flexWrap: 'nowrap' }}>
            <Grid item sx={{ flexGrow: '0' }}>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  height: '100%',
                  borderRadius: '6px 0 0 6px',
                  background: theme.palette.divider,
                  color: theme.palette.text.secondary
                }}
                onClick={() => handleNumberIncrement('nftAmount', 'down')}
              >
                <Icon>
                  remove
                </Icon>
              </Button>
            </Grid>
            <Grid item sx={{ flexGrow: '1' }}>
              <TextField
                variant="filled"
                fullWidth
                id="nfts-per-pack"
                label="NFTs Per Pack (Max 24)"
                name="nftAmount"
                value={data[index].nftAmount}
                onChange={(e) => handleChangeNum(e, 24)}
                inputProps={{
                  inputMode: 'numeric',
                  step: 1,
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '0'
                  },
                  width: '100%',
                  flexGrow: '1'
                }}
              />
            </Grid>
            <Grid item sx={{ flexGrow: '0' }}>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  height: '100%',
                  borderRadius: '0 6px 6px 0',
                  background: theme.palette.divider,
                  color: theme.palette.text.secondary
                }}
                onClick={() => handleNumberIncrement('nftAmount', 'up', 24)}
              >
                <Icon>
                  add
                </Icon>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          {/* <InputSlider 
          name=""
          data={data} 
          // setData={setData} 
          /> */}
        </Grid>
      </Grid>
    </>
  );
};

export default PackTokenItem;