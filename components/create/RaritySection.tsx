import React, { FC, useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Collapse,
  Button,
  Grid,
  Switch
} from '@mui/material'
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import RarityItem from '@components/create/RarityItem'

interface IFileData {
  currentFile: File;
  previewImage: string;
  progress: number;
  message: string;
}

export interface IRarityItem {
  id: string;
  name: string;
  description: string;
  img: IFileData;
}

interface IRaritySectionProps {
  data: IRarityItem[];
  setData: React.Dispatch<React.SetStateAction<IRarityItem[]>>;
}

const fileInitObject = {
  currentFile: {} as File,
  previewImage: '',
  progress: 0,
  message: ""
}

const RaritySection: FC<IRaritySectionProps> = ({ data, setData }) => {
  const [images, setImages] = useState(true)
  const toggleImages = () => {
    setImages(!images)
  }
  return (
    <>
      <Typography variant="h5">
        Rarity
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
        You can create rarity presets. If you choose to have token packs, there will be an option to set the probability of receiving more rare NFTs depending on the pack settings.
      </Typography>
      <Grid
        container
        alignItems="center"
        sx={{
          width: '100%',
          mb: '24px',
          '&:hover': {
            cursor: 'pointer'
          }
        }}
        onClick={() => toggleImages()}
      >
        <Grid item xs>
          <Typography sx={{ verticalAlign: 'middle', mb: 0 }}>
            Include Images
          </Typography>
        </Grid>
        <Grid item xs="auto">
          <Switch
            focusVisibleClassName=".Mui-focusVisible"
            disableRipple
            checked={images}
          />
        </Grid>
      </Grid>

      <TransitionGroup>
        {data.map((item, i) => (
          <Collapse key={item.id}>
            <RarityItem data={data} setData={setData} i={i} images={images} />
          </Collapse>
        ))}
      </TransitionGroup>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Button onClick={() => {
          setData(data.concat([{
            id: uuidv4(),
            name: '',
            description: '',
            img: fileInitObject
          }]))
        }}>
          Add another
        </Button>
      </Box>
    </>
  );
};

export default RaritySection;