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
import { ITraitsData } from '@components/create/CollectionForm';

interface ITraitSectionProps {
  data: ITraitsData[];
  setData: React.Dispatch<React.SetStateAction<ITraitsData[]>>;
}

const TraitSection: FC<ITraitSectionProps> = ({ data, setData }) => {
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
            Additional Traits
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

      <Typography variant="body2" sx={{ lineHeight: 1.3, mb: '12px' }}>
        Each NFT in a collection will have the same traits to choose from. Set as many as you'd like here. 
      </Typography>

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
            traitName: '',
            id: uuidv4(),
            description: '',
            image: '',
            type: 'Property'
          }]))
        }}>
          Add another
        </Button>
      </Box>
    </>
  );
};

export default TraitSection;