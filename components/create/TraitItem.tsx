import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Icon,
  IconButton,
  TextField,
  Collapse,
  useTheme,
  useMediaQuery,
  Box,
  InputLabel,
  MenuItem,
  FormControl
} from '@mui/material'
import FileUploadArea from '@components/forms/FileUploadArea'
import { ITraitsData } from '@components/create/TokenDetailsForm';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IFileUrl } from '@components/forms/FileUploadArea';

const TraitItem: FC<{
  data: ITraitsData[];
  setData: React.Dispatch<React.SetStateAction<ITraitsData[]>>;
  // images?: boolean;
  i: number;
}> = ({
  data,
  setData,
  i,
  // images 
}) => {
    const [traitImg, setTraitImg] = useState<IFileUrl[]>([])
    // const [imgClearTrigger, setImgClearTrigger] = useState(false)
    const theme = useTheme()
    const upSm = useMediaQuery(theme.breakpoints.up('md'))

    useEffect(() => {
      setData((prevArray) => {
        const newArray = prevArray.map((item, index) => {
          if (index === i) {
            return {
              ...item,
              image: traitImg[0]?.url
            }
          }
          return item
        })
        return newArray
      })
    }, [JSON.stringify(traitImg)])

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

    const handleSelectChange = (e: SelectChangeEvent) => {
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
    };

    // useEffect(() => {
    //   if (data[i].type === 'Property') {
    //     const newArray = data.map((item, index) => {
    //       if (index === i) {
    //         return {
    //           ...item,
    //           max: undefined
    //         }
    //       }
    //       return item
    //     })
    //     setData(newArray)
    //   }
    // }, [data[i].type])

    return (
      <>
        <Grid
          container
          spacing={1}
          sx={{ mb: 2 }}
        >
          <Grid item xs>
            <TextField
              fullWidth
              variant="filled"
              id="trait-name"
              name="traitName"
              label="Trait Name"
              value={data[i].traitName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs="auto" sx={{ display: upSm ? 'none' : 'flex' }}>
            <IconButton
              onClick={() => removeItem(i)}
            >
              <Icon>
                delete
              </Icon>
            </IconButton>
          </Grid>
          <Grid item container spacing={1} xs={12} md={5}>
            <Grid item xs={7}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="trait-type-label">Trait Type</InputLabel>
                <Select
                  id="trait-type"
                  value={data[i].type}
                  label="Type"
                  name="type"
                  onChange={handleSelectChange}
                >
                  <MenuItem value={'Property'}>Property</MenuItem>
                  <MenuItem value={'Level'}>Level</MenuItem>
                  <MenuItem value={'Stat'}>Stat</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={5}>
              <TextField
                fullWidth
                variant="filled"
                id="trait-max"
                name="max"
                type="number"
                disabled={data[i].type === 'Property'}
                label={'Max Value'}
                value={data[i].max}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid item xs="auto" md="auto" sx={{ display: !upSm ? 'none' : 'flex' }}>
            <IconButton onClick={() => removeItem(i)} >
              <Icon>
                delete
              </Icon>
            </IconButton>
          </Grid>
        </Grid>
      </>
    )
  }

export default TraitItem;