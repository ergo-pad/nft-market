import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Icon,
  TextField,
  useTheme,
  Button,
  Slider,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Switch,
  Typography,
  Collapse,
  Box
} from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IRarityData } from '@components/create/TokenDetailsForm'
import { IPackData, packTokenDataInit } from '@components/create/TokenDetailsForm';
import NumberIncrementNftArray from '@components/forms/NumberIncrementNftArray';
import { v4 as uuidv4 } from 'uuid';

interface IPackTokenItemProps {
  data: IPackData[];
  setData: React.Dispatch<React.SetStateAction<IPackData[]>>;
  index: number;
  rarityData: IRarityData[];
}

export interface INftPackObject {
  id: string;
  count: number | '';
  probabilities: {
    rarityName: string;
    probability: number;
  }[]
}

const nftPackObjectInit = {
  id: uuidv4(),
  count: 1,
  probabilities: [
    {
      rarityName: '',
      probability: 1
    }
  ]
}

const PackTokenItem: FC<IPackTokenItemProps> = ({ data, setData, index, rarityData }) => {
  const theme = useTheme()
  const [customProbabilitiesToggle, setCustomProbabilitiesToggle] = useState(false)
  const handleCustomProbabilitiesToggle = () => {
    setCustomProbabilitiesToggle(!customProbabilitiesToggle);
  };
  const [nftArray, setNftArray] = useState<INftPackObject[]>([nftPackObjectInit])
  const [probabilityArray, setProbabilityArray] = useState(nftPackObjectInit.probabilities)
  const [openRarityAlert, setOpenRarityAlert] = useState(false);

  useEffect(() => {
    setProbabilityArray(rarityData.map((item, i) => {
      return {
        rarityName: item.rarity,
        probability: 1
      }
    }))
    if (rarityData.length < 2) {
      setCustomProbabilitiesToggle(false);
    }
  }, [rarityData])

  useEffect(() => {
    const newArray: INftPackObject[] = nftArray.map((item, i) => {
      return {
        ...item,
        probabilities: probabilityArray
      }
    })
    setNftArray(newArray)
  }, [probabilityArray])

  useEffect(() => {
    const newArray = data.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          nftPerPack: customProbabilitiesToggle ? nftArray : [{ count: nftArray[0].count, id: nftArray[0].id }]
        }
      }
      return item
    })
    setData(newArray)
  }, [JSON.stringify(nftArray), customProbabilitiesToggle])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArray = data.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [e.target.name]: e.target.value
        }
      }
      return item
    })
    setData(newArray)
  }

  const handleSelectChange = (e: SelectChangeEvent) => {
    const newArray = data.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [e.target.name]: e.target.value
        }
      }
      return item
    })
    setData(newArray)
  };

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

  const handleChangeProbability = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    typeNum: number,
    probabilityIndex: number,
  ) => {
    const newArray = nftArray.map((item, i) => {
      if (i === typeNum) {
        return {
          ...item,
          probabilities: [
            ...item.probabilities.slice(0, probabilityIndex),
            {
              ...item.probabilities[probabilityIndex],
              probability: Number(e.target.value)
            },
            ...item.probabilities.slice(probabilityIndex + 1),
          ]
        }
      }
      return item
    })
    setNftArray(newArray)
  }

  const addProbabilityType = () => {
    const init = {
      id: uuidv4(),
      count: 1,
      probabilities: probabilityArray
    }
    setNftArray(nftArray.concat(init))
  }

  const checkProbabilityToggleForRarityOptions = () => {
    if (rarityData.length > 1) {
      handleCustomProbabilitiesToggle()
    }
    else {
      setOpenRarityAlert(true);
    }
  }

  const handleCloseRarityAlert = () => {
    setOpenRarityAlert(false);
  };

  const removeItem = (i: number) => {
    setData(current => current.filter((_item, idx) => idx !== i))
  }
  const removeProbabilityType = (i: number) => {
    setNftArray(nftArray.filter((_item, idx) => idx !== i))
  }

  return (
    <Box sx={{ position: 'relative', display: 'block', p: 1, background: theme.palette.divider, mb: 2, borderRadius: '6px' }}>
      <Grid container spacing={1} sx={{ mb: '16px' }}>
        <Grid item xs={12}>
          <Grid
            container
            spacing={1}
            alignItems="center"
          >
            <Grid item xs>
              <TextField
                fullWidth
                variant="filled"
                id="pack-name"
                label="Pack Name"
                name="packName"
                value={data[index].packName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs="auto" sx={{ display: index === 0 ? 'none' : 'flex' }}>
              <IconButton onClick={() => removeItem(index)}>
                <Icon>
                  delete
                </Icon>
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="filled"
            id="pack-amount"
            label="Number of Packs"
            inputProps={{
              inputMode: 'numeric',
            }}
            name="amountOfPacks"
            value={data[index].amountOfPacks}
            onChange={handleChangeNum}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="filled"
            id="price"
            label="Price Per Pack"
            inputProps={{
              inputMode: 'numeric',
            }}
            name="price"
            value={data[index].price}
            onChange={handleChangeNum}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl variant="filled" fullWidth>
            <InputLabel id="currency">Currency</InputLabel>
            <Select
              id="currency"
              value={data[index].currency}
              label="Currency"
              name="currency"
              onChange={handleSelectChange}
            >
              <MenuItem value={'SigUSD'}>SigUSD</MenuItem>
              <MenuItem value={'Erg'}>Erg</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          onClick={checkProbabilityToggleForRarityOptions}
          sx={{
            '&:hover': {
              cursor: 'pointer',
            }
          }}
        >
          <Box>
            <Switch
              focusVisibleClassName=".Mui-focusVisible"
              disableRipple
              checked={customProbabilitiesToggle}
            />
            <Typography
              sx={{
                display: 'inline-block',
                ml: '6px',
                verticalAlign: 'middle',
                color: customProbabilitiesToggle ? theme.palette.text.primary : theme.palette.text.secondary
              }}
            >
              Use Custom Probabilities
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Collapse in={!customProbabilitiesToggle}>
            <NumberIncrementNftArray
              dataArray={nftArray}
              setDataArray={setNftArray}
              max={24}
              name="nftPerPack"
              label="NFTs Per Pack (Max 24)"
              index={0}
            />
          </Collapse>
          <Collapse in={customProbabilitiesToggle}>
            <Button onClick={addProbabilityType}>Add Another Probability Type</Button>
          </Collapse>
        </Grid>
        <Grid item xs={12}>
          <Collapse in={customProbabilitiesToggle}>

            <Grid container spacing={2}>
              {nftArray.map((item, i) => {
                return (
                  <Grid item xs={12} md={6} key={i}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Grid
                          container
                          spacing={1}
                          alignItems="center"
                        >
                          <Grid item xs>
                            <Typography variant="h6">
                              Probability Type {i + 1}
                            </Typography>
                          </Grid>
                          <Grid item xs="auto"
                          sx={{
                            display: (nftArray.length > 1) ? 'block' : 'none',
                          }}
                          >
                            <IconButton onClick={() => removeProbabilityType(i)}>
                              <Icon>
                                delete
                              </Icon>
                            </IconButton>
                          </Grid>
                        </Grid>

                      </Grid>
                      <Grid item xs={12}>
                        <NumberIncrementNftArray
                          dataArray={nftArray}
                          setDataArray={setNftArray}
                          // max={24}
                          name={'nftPerType' + (i + 1)}
                          label={"Number of NFTs of Type " + (i + 1)}
                          index={i}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {item.probabilities && item.probabilities.map((item, idx) => {
                          return (
                            <React.Fragment key={idx}>
                              <TextField
                                fullWidth
                                variant="filled"
                                id={"probability-type" + i + '-' + item.rarityName}
                                label={item.rarityName}
                                inputProps={{
                                  inputMode: 'numeric',
                                }}
                                name={'probability-type-' + i + '-' + item.rarityName}
                                value={item.probability}
                                onChange={(e) => handleChangeProbability(e, i, idx)}
                                sx={{ mb: 1 }}
                              />
                            </React.Fragment>
                          )
                        })}
                      </Grid>
                    </Grid>
                  </Grid>
                )
              })}
            </Grid>
          </Collapse>
        </Grid>
      </Grid>
      <Dialog
        open={openRarityAlert}
        onClose={handleCloseRarityAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Add rarity options"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You must set more than one Rarity option to use this feature.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRarityAlert} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PackTokenItem;