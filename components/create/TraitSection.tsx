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
import TraitItem from '@components/create/TraitItem'
import { ITraitData } from '@pages/create';

interface ITraitSectionProps {
  data: ITraitData[];
  setData: React.Dispatch<React.SetStateAction<ITraitData[]>>;
}

const fileInitObject = {
  currentFile: {} as File,
  previewImage: '',
  progress: 0,
  message: ""
}

const TraitSection: FC<ITraitSectionProps> = ({ data, setData }) => {
  const [images, setImages] = useState(false)
  const toggleImages = () => {
    setImages(!images)
  }
  return (
    <>
      <Typography variant="h5">
        Additional Traits
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.3, mb: '12px' }}>
        Add traits that you will exist across all the NFTs in this collection. You may create presets to specifically limit traits with dropdown menus. Additional traits can be added later when you add NFT data. 
      </Typography>
      <Grid
        container
        alignItems="center"
        sx={{
          width: '100%',
          mb: '24px',
        }}
      >
        <Grid item xs>

        </Grid>
        <Grid
          item
          xs="auto"
          onClick={() => toggleImages()}
          sx={{
            '&:hover': {
              cursor: 'pointer'
            }
          }}
        >
          <Typography sx={{ verticalAlign: 'middle', mb: 0, mr: '6px', display: 'inline-block' }}>
            Include Images
          </Typography>
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
            <TraitItem data={data} setData={setData} i={i} images={images} />
          </Collapse>
        ))}
      </TransitionGroup>
      <Box sx={{ width: '100%', textAlign: 'center', mb: '24px' }}>
        <Button onClick={() => {
          setData(data.concat([{
            id: uuidv4(),
            name: '',
            description: '',
            imgUrl: ''
          }]))
        }}>
          Add another
        </Button>
      </Box>
    </>
  );
};

export default TraitSection;