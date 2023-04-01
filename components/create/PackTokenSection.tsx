import React, { FC, useState } from 'react';
import {
  Typography,
  Box,
  Collapse,
  Button,
  Grid,
  useTheme,
  Switch,
} from '@mui/material'
import { TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import PackTokenItem from '@components/create/PackTokenItem';
import { IPackData, IRarityData } from '@pages/mint';

interface IPackTokenSectionProps {
  data: IPackData[];
  setData: React.Dispatch<React.SetStateAction<IPackData[]>>;
  rarityData: IRarityData[];
  packToggle: boolean;
  setPackToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const PackTokenSection: FC<IPackTokenSectionProps> = ({ data, setData, rarityData, packToggle, setPackToggle }) => {
  const theme = useTheme()
  const handlePackToggle = () => {
    setPackToggle(!packToggle);
  };
  return (
    <Box sx={{ mb: '12px' }}>
      <Grid
        container
        alignItems="center"
        sx={{
          width: '100%',
          mb: '0px',
          '&:hover': {
            cursor: 'pointer'
          }
        }}
        onClick={() => handlePackToggle()}
      >
        <Grid item xs>
          <Typography variant="h5" sx={{ verticalAlign: 'middle' }}>
            Pack tokens
          </Typography>
        </Grid>
        <Grid item xs="auto">
          <Typography
            sx={{
              display: 'inline-block',
              mr: '6px',
              verticalAlign: 'middle',
              color: packToggle ? theme.palette.text.primary : theme.palette.text.secondary
            }}
          >
            Enable
          </Typography>
          <Switch
            focusVisibleClassName=".Mui-focusVisible"
            disableRipple
            checked={packToggle}
          />
        </Grid>
      </Grid>
      <Typography variant="body2" sx={{ lineHeight: 1.3 }}>
        If you want to sell or give away tokens that represent &quot;packs&quot; of NFTs, such as for card packs or other bundles, select this box to create them. 
      </Typography>
      <Collapse in={packToggle}>
        <TransitionGroup>
          {data.map((item, i) => (
            <Collapse key={item.id}>
              <PackTokenItem data={data} setData={setData} rarityData={rarityData} index={i} />
            </Collapse>
          ))}
        </TransitionGroup>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <Button onClick={() => {
            setData(data.concat(
              {
                id: uuidv4(),
                packName: '',
                amountOfPacks: 1,
                image: '',
                nftPerPack: [
                  {
                    id: uuidv4(),
                    count: 1,
                    probabilities: [
                      {
                        rarityName: '',
                        probability: 1
                      }
                    ]
                  }
                ],
                price: '',
                currency: 'SigUSD',
              }
            ))
          }}>
            Add another pack
          </Button>
          <Button onClick={() => {
            console.log(data)
          }}>
            Check array
          </Button>
        </Box>
      </Collapse>

    </Box>
  );
};

export default PackTokenSection;