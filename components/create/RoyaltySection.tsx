import React, { FC, useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Collapse,
  Button,
} from '@mui/material'
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import RoyaltyItem from '@components/create/RoyaltyItem'
import { IRoyaltyItem } from '@components/create/TokenDetailsForm'

interface IRoyaltySectionProps {
  data: IRoyaltyItem[];
  setData: React.Dispatch<React.SetStateAction<IRoyaltyItem[]>>;
}

const RoyaltySection: FC<IRoyaltySectionProps> = ({ data, setData }) => {
  return (
    <>
      <TransitionGroup>
        {data.map((item, i) => (
          <Collapse key={item.id}>
            <RoyaltyItem royaltyData={data} setRoyaltyData={setData} index={i} id={item.id} />
          </Collapse>
        ))}
      </TransitionGroup>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Button onClick={() => {
          setData(data.concat([{
            id: uuidv4(),
            address: '',
            pct: 0
          }]))
        }}
        sx={{
          mt: '-12px'
        }}>
          Add royalty recipient
        </Button>
      </Box>
    </>
  );
};

export default RoyaltySection;