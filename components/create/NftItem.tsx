import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  Link,
  Icon,
  IconButton,
  useTheme,
  InputLabel,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FileUploadArea from '@components/forms/FileUploadArea'
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useCSVReader } from 'react-papaparse';
import { IFileUrl } from '@components/forms/FileUploadArea';
import { IRarityData, ITraitsData, INftData } from '@components/create/TokenDetailsForm';

interface INftItemProps {
  rarityData: IRarityData[];
  traitData: ITraitsData[];
  nftData: INftData[];
  setNftData: React.Dispatch<React.SetStateAction<INftData[]>>;
  nftImageUrls: { [key: string]: string };
  setNftImageUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  index: number;
  id: string;
}

const NftItem: FC<INftItemProps> = ({ rarityData, traitData, nftData, setNftData, nftImageUrls, setNftImageUrls, index, id }) => {
  const theme = useTheme()
  const [checkMax, setCheckMax] = useState<{ [key: string]: boolean }>({})
  const [thisNft, setThisNft] = useState<INftData>(nftData[index])

  useEffect(() => {
    setThisNft(nftData[index])
  }, [id])

  useEffect(() => {
    const timeout = setTimeout(() => {
      const newArray = nftData.map((item, i) => {
        if (index === i) {
          return {
            ...thisNft
          }
        }
        return item
      })
      setNftData(newArray)
    }, 1000)
    return () => clearTimeout(timeout);
  }, [JSON.stringify(thisNft)])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setThisNft(prev => (
        {
          ...prev,
          traits: traitData.map((item, i) => {
            const matched = prev.traits?.filter((trait) => trait.id === item.id)
            if (matched && matched.length === 1) {
              if (item.max && item.max < Number(matched[0].value)) {
                setCheckMax(prev => ({
                  ...prev,
                  [item.id]: false
                }))
              }
              return (
                {
                  key: item.traitName,
                  value: (item.max && item.max < Number(matched[0].value)) ? item.max.toString() : matched[0].value,
                  type: item.type,
                  id: item.id,
                  max: item.max ? item.max : undefined
                }
              )
            }
            else {
              return (
                {
                  key: item.traitName,
                  value: '',
                  type: item.type,
                  id: item.id
                }
              )
            }
          })
        }
      ))
    }, 1000);
    return () => clearTimeout(timeout);
  }, [JSON.stringify(traitData)])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setThisNft(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleChangeTrait = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setThisNft(prev => ({
      ...prev,
      traits: prev.traits?.map((item, i) => {
        if (e.target.name === item.key) {
          const filteredTraits = traitData.filter((trait) => trait.id === item.id)
          let newValue = e.target.value
          if (filteredTraits.length < 2 && filteredTraits[0].max && Number(newValue) > filteredTraits[0].max) {
            setCheckMax(prev => ({
              ...prev,
              [item.id]: true
            }))
          }
          else {
            setCheckMax(prev => ({
              ...prev,
              [item.id]: false
            }))
          }
          return (
            {
              ...item,
              value: newValue
            }
          )
        }
        else return item
      })
    }))
  }

  const handleExplicitCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThisNft(prev => ({
      ...prev,
      explicit: e.target.checked
    }))
  }

  useEffect(() => {
    const filter = rarityData.filter((data) => data.rarity === raritySelect)
    if (filter.length !== 1) setRaritySelect('')
  }, [rarityData])
  const [raritySelect, setRaritySelect] = useState('')
  const handleRarityChange = (e: SelectChangeEvent) => {
    setRaritySelect(e.target.value)
  }
  useEffect(() => {
    setThisNft(prev => ({
      ...prev,
      rarity: raritySelect
    }))
  }, [raritySelect])

  const removeItem = () => {
    setNftImageUrls(prev => {
      const state = { ...prev };
      delete state[id]
      return state;
    })
    setNftData(current => current.filter((item, idx) => item.id !== id))
  }

  return (
    <Box sx={{ position: 'relative', display: 'block', p: 1, background: theme.palette.divider, mb: 2, borderRadius: '6px' }} key={index}>
      <Grid container spacing={1} sx={{ mb: '16px' }} alignItems="stretch">
        <Grid item xs={12} sm={3}>
          <Box sx={{ width: '100%', height: '300px', display: 'block', position: 'relative' }}>
            <Image
              src={nftImageUrls[id]}
              alt="NFT Preview Image"
              layout="fill"
              objectFit="contain"
              sizes="(max-width: 768px) 100vw,
                    (max-width: 1200px) 50vw,
                    33vw"
            />
          </Box>
        </Grid>
        <Grid item container direction="column" spacing={1} xs={12} sm={9}>
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
                  id="nft-name"
                  name="nftName"
                  label="Name"
                  value={thisNft.nftName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs="auto">
                <IconButton onClick={() => {
                  removeItem()
                }}>
                  <Icon>
                    delete
                  </Icon>
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
          {rarityData.length > 1 && (
            <Grid item>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="rarity-label">Rarity</InputLabel>
                <Select
                  id="rarity"
                  value={raritySelect}
                  label="Rarity"
                  name="rarity"
                  onChange={handleRarityChange}
                >
                  {rarityData.map((item, i) => {
                    return (
                      <MenuItem key={i} value={item.rarity}>{item.rarity}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
          )}

          {thisNft.traits && thisNft.traits.length > 1 && thisNft.traits[0].key !== '' ? (
            thisNft.traits.map((item, i) => {
              return (
                <Grid item key={item.id}>
                  <TextField
                    fullWidth
                    variant="filled"
                    id="trait-value"
                    label={item.key}
                    type={item.type === 'Level' || item.type === 'Stat' ? 'number' : ''}
                    value={item.value}
                    name={item.key}
                    onChange={handleChangeTrait}
                    error={checkMax[item.id]}
                    helperText={checkMax[item.id] ? 'Keep numbers below trait max' : ''}
                  />
                </Grid>
              )
            })
          ) : (
            <Grid item key={index}>
              <TextField
                fullWidth
                variant="filled"
                id="nft-description"
                name="description"
                label="Description"
                value={thisNft.description}
                onChange={handleChange}
              />
            </Grid>
          )}
          <FormControl sx={{ pl: '8px', color: theme.palette.text.secondary }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={thisNft.explicit}
                  onChange={handleExplicitCheckbox}
                />
              }
              label="Contains explicit content"
            />
          </FormControl>
          <Button onClick={() => {
            console.log(thisNft)
          }}>
            console log this nft
          </Button>
          <Button onClick={() => {
            console.log(nftImageUrls)
          }}>
            console log Image URLs
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NftItem;