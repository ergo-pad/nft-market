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
import { IRarityData } from '@pages/create';

interface IRaritySectionProps {
  data: IRarityData[];
  setData: React.Dispatch<React.SetStateAction<IRarityData[]>>;
}

const RaritySection: FC<IRaritySectionProps> = ({ data, setData }) => {
  const [images, setImages] = useState(false)
  const toggleImages = () => {
    setImages(!images)
  }
  return (
    <>
      <Grid
        container
        alignItems="center"
        sx={{
          width: '100%',
        }}
      >
        <Grid item xs>
          <Typography variant="h5">
            Rarity
          </Typography>
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

      <Typography variant="body2" sx={{ lineHeight: 1.3, mb: '12px', }}>
        You can create rarity presets. If you choose to have token packs, there will be an option to set the probability of receiving more rare NFTs depending on the pack settings.
      </Typography>

      <TransitionGroup>
        {data.map((item, i) => (
          <Collapse key={item.id}>
            <RarityItem data={data} setData={setData} i={i} images={images} />
          </Collapse>
        ))}
      </TransitionGroup>
      <Box sx={{ width: '100%', textAlign: 'center', mb: '24px' }}>
        <Button onClick={() => {
          setData(data.concat([{
            rarity: '',
            id: uuidv4(),
            description: '',
            image: ''
          }]))
        }}>
          Add another
        </Button>
      </Box>
    </>
  );
};

export default RaritySection;