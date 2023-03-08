import React, { FC, useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Collapse,
  Button,
} from '@mui/material'
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import SocialItem from '@components/create/SocialItem'

interface ISocialItem {
  id: string;
  network: string;
  url: string;
}

interface ISocialSectionProps {
  data: ISocialItem[];
  setData: React.Dispatch<React.SetStateAction<ISocialItem[]>>;
  errors: boolean[]
  setErrors: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const SocialSection: FC<ISocialSectionProps> = ({ data, setData, errors, setErrors }) => {
  return (
    <>
      <Typography variant="h6" sx={{ mb: '12px' }}>
        Social Links
      </Typography>
      <TransitionGroup>
        {data.map((item, i) => (
          <Collapse key={item.id}>
            <SocialItem socialData={data} setSocialData={setData} index={i} id={item.id} errors={errors} setErrors={setErrors} />
          </Collapse>
        ))}
      </TransitionGroup>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Button onClick={() => {
          setData((prev) => {
            return prev.concat([{
              id: uuidv4(),
              network: '',
              url: ''
            }])
          })
          setErrors((prev) => {
            return prev.concat(false)
          })
        }}>
          Add another
        </Button>
      </Box>
    </>
  );
};

export default SocialSection;