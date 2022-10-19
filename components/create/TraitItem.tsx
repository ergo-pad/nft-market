import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Icon,
  IconButton,
  TextField,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import FileUploadArea from '@components/forms/FileUploadArea'

interface IFileData {
  currentFile: File;
  previewImage: string;
  progress: number;
  message: string;
}

interface ITraitData {
  id: string;
  name: string;
  description: string;
  img: IFileData;
}

const TraitItem: FC<{
  data: ITraitData[];
  setData: React.Dispatch<React.SetStateAction<ITraitData[]>>;
  images?: boolean;
  i: number;
}> = ({ data, setData, i, images }) => {
  const [traitImg, setTraitImg] = useState([data[i].img])
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))

  useEffect(() => {
    const newArray = data.map((item, index) => {
      if (index === i) {
        return {
          ...item,
          img: traitImg[0]
        }
      }
      return item
    })
    setData(newArray)
  }, [traitImg[0]])

  const removeItem = (index: number) => {
    setData(current => current.filter((_item, idx) => idx !== index))
  }

  useEffect(() => {
    setTraitImg([data[i].img])
  }, [data[i].img.previewImage])

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

  return (
    <>
      <Collapse in={images} mountOnEnter unmountOnExit>
        <Grid container spacing={1} sx={{ mb: '16px' }} alignItems="stretch">
          <Grid item xs={12} sm={3}>
            <FileUploadArea
              fileData={traitImg}
              setFileData={setTraitImg}
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
              >
                <Grid item xs>
                  <TextField
                    fullWidth
                    variant="filled"
                    id="trait-name"
                    name="name"
                    label="Trait"
                    value={data[i].name}
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
          <Grid item xs={12} sm={3}>
            <Grid
              container
              spacing={1}
              alignItems="center"
            >
              <Grid item xs>
                <TextField
                  fullWidth
                  variant="filled"
                  id="trait-name"
                  name="name"
                  label="Trait"
                  value={data[i].name}
                  onChange={handleChange}
                />
              </Grid>
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
          </Grid>
          <Grid item xs={12} sm={9}>
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