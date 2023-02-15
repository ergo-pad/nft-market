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
  images?: boolean;
  i: number;
}> = ({ data, setData, i, images }) => {
  const [traitImg, setTraitImg] = useState<IFileUrl[]>([])
  const [imgClearTrigger, setImgClearTrigger] = useState(false)
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))

  useEffect(() => {
    const newArray = data.map((item, index) => {
      if (index === i) {
        return {
          ...item,
          image: traitImg[0]?.url
        }
      }
      return item
    })
    setData(newArray)
  }, [JSON.stringify(traitImg)])

  const removeItem = (index: number) => {
    setData(current => current.filter((_item, idx) => idx !== index))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newArray = data.map((item, index) => {
      if (index === i) {
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
    const newArray = data.map((item, index) => {
      if (index === i) {
        return {
          ...item,
          [e.target.name]: e.target.value
        }
      }
      return item
    })
    setData(newArray)
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
      <Collapse in={images} mountOnEnter unmountOnExit>
        <Grid container spacing={1} sx={{ mb: '16px' }} alignItems="stretch">
          <Grid item xs={12} sm={3}>
            <FileUploadArea
              fileUrls={traitImg}
              setFileUrls={setTraitImg}
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
                sx={{ mb: 1 }}
              >
                <Grid item xs>
                  <TextField
                    fullWidth
                    variant="filled"
                    id="trait-name"
                    name="traitName"
                    label="Trait"
                    value={data[i].traitName}
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
              <Grid
                container
                spacing={1}
                alignItems="center"
              >
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    variant="filled"
                    id="trait-max"
                    name="max"
                    disabled={data[i].type === 'Property'}
                    label={'Max ' + data[i].type}
                    value={data[i].max}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                variant="filled"
                id="trait-description"
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
      </Collapse>
      <Collapse in={!images} mountOnEnter unmountOnExit>
        <Grid container spacing={1} sx={{ mb: '16px' }}>
          <Grid item xs={12}>
            <Grid
              container
              spacing={1}
              alignItems="center"
            >
              <Grid item container xs={12} md={6}>
                <TextField
                  fullWidth
                  variant="filled"
                  id="trait-name"
                  name="traitName"
                  label="Trait Name"
                  value={data[i].traitName}
                  onChange={handleChange}
                />
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  variant="filled"
                  id="trait-max"
                  name="max"
                  disabled={data[i].type === 'Property'}
                  label={'Max ' + data[i].type}
                  value={data[i].max}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
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
                  id="trait-description"
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
      </Collapse>
    </>
  )
}

export default TraitItem;