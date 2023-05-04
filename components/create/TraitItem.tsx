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
  i: number;
}> = ({
  data,
  setData,
  i,
}) => {
    const theme = useTheme()
    const upSm = useMediaQuery(theme.breakpoints.up('md'))
    const [localTraitData, setLocalTraitData] = useState<{
      traitName: string;
      type: "Property" | "Level" | "Stat";
      max?: number;
    }>({
      traitName: '',
      type: 'Property'
    })

    const removeItem = (index: number) => {
      setData(current => current.filter((_item, idx) => idx !== index))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalTraitData(prev => {
        return {
          ...prev,
          [e.target.name]: e.target.value
        }
      })
    }

    const handleSelectChange = (e: SelectChangeEvent) => {
      setLocalTraitData(prev => {
        return {
          ...prev,
          [e.target.name]: e.target.value
        }
      })
    };

    useEffect(() => {
      const timeout = setTimeout(() => {
        setData((prevArray) => {
          const newArray = prevArray.map((item, index) => {
            if (index === i) {
              return {
                ...item,
                ...localTraitData
              }
            }
            return item
          })
          return newArray
        })
      }, 2000);
      return () => clearTimeout(timeout);
    }, [localTraitData])

    useEffect(() => {
      setLocalTraitData({
        traitName: data[i].traitName,
        type: data[i].type,
      })
    }, [])

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
              value={localTraitData.traitName}
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
                  value={localTraitData.type}
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
                disabled={localTraitData.type === 'Property'}
                label={'Max Value'}
                value={localTraitData.max}
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