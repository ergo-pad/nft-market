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
import { IRarityData } from '@components/create/TokenDetailsForm'
import { IPackData, packTokenDataInit } from '@components/create/TokenDetailsForm';

interface IPackTokenSectionProps {
  data: IPackData[];
  setData: React.Dispatch<React.SetStateAction<IPackData[]>>;
  rarityData: IRarityData[];
}

const PackTokenSection: FC<IPackTokenSectionProps> = ({ data, setData, rarityData }) => {
  const theme = useTheme()
  const [packToggle, setPackToggle] = useState(false)
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
        If you want to sell or give away tokens that represent &quot;packs&quot; of NFTs, such as for card packs or other bundles, select this box to create them. If you choose not to now, you won&apos;t be able to make them later for this collection.
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