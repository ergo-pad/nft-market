import React, { FC } from 'react';
import {
  Typography,
  // useTheme,
  Paper,
  Grid
} from '@mui/material'

interface ITokenPropertiesProps {
  traits: {
    traitName: string; // Name of the overall trait (eg Color, Speed)
    value: string; // The trait value that this NFT has (eg Red, 55)
    qtyWithTrait: number; // the amount of NFTs in the collection that also have this trait
  }[];
  collectionTotalQty: number; // total number of NFTs in a collection. Used to calculate percentage or uniqueness of each trait value. 
}

const TokenProperties: FC<ITokenPropertiesProps> = ({ traits, collectionTotalQty }) => {
  // const theme = useTheme()
  return (
    <>
    <Typography variant="body2">
      Total in collection: {collectionTotalQty}
    </Typography>
      {traits.map((item, i) => {
        return (
          <Paper key={i} sx={{ p: '12px', mb: '12px' }}>
            <Grid container>
              <Grid item xs>
              {item.traitName + ': ' + item.value}
              </Grid>
              <Grid item xs="auto">
                {(item.qtyWithTrait / collectionTotalQty * 100).toFixed(1)}%
              </Grid>
            </Grid>
          </Paper>
        )
      })}
    </>
  );
};

export default TokenProperties;