import React, { FC, useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Switch,
  useTheme,
  Collapse
} from '@mui/material'

export interface ISaleInfoData {
  royalties: {
    address: string;
    percent: number; // 1000 * royalty percentage of this recipient (e.g. 50 if the receipient receives 5% of the sale)
  }[];
  dateStart: Date;
  dateEnd: Date;
  price: {
    tokenId?: string; // if there are multiple packs to sell, this is the token ID of the pack. Don't use for sales without pack tokens
    price: number;
    currency: 'erg' | 'sigusd'; // default to sigusd
  }[];
}

export const saleInfoDataInit: ISaleInfoData = {
  royalties: [
    {
      address: '',
      percent: 1000, // 1000 * royalty percentage of this recipient (e.g. 50 if the receipient receives 5% of the sale)
    },
  ],
  dateStart: new Date(1663353871000), // FIX DEFAULTS
  dateEnd: new Date(1663353871000), // FIX DEFAULTS
  price: [
    {
      tokenId: '', // if there are multiple packs to sell, this is the token ID of the pack. Don't use for sales without pack tokens
      price: 1,
      currency: 'sigusd', // default to sigusd
    },
  ]
}
// END FORM INIT //

interface ISalesInfoProps {
  saleInfoData: ISaleInfoData;
  setSaleInfoData: React.Dispatch<React.SetStateAction<ISaleInfoData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const SalesInfo: FC<ISalesInfoProps> = ({ saleInfoData, setSaleInfoData, clearForm, setClearForm }) => {
  const theme = useTheme()
  
  // SALE DATA STATES //
  const [createSale, setCreateSale] = useState(true)
  const toggleCreateSale = () => {
    setCreateSale(!createSale)
  }

  // CLEAR FORM //
  useEffect(() => {
    setSaleInfoData(saleInfoDataInit) // this belongs to parent
    setClearForm(false)
  }, [clearForm])

  return (
    <Box>
      <Box>
        <Typography variant="h4">
          Sale info
        </Typography>
        <Typography variant="body2">
          If you choose not to setup a sale, the NFTs will be sent to the artist address as they&apos;re minted.
        </Typography>
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
          onClick={() => toggleCreateSale()}
        >
          <Grid item xs>
            <Typography variant="h5" sx={{ verticalAlign: 'middle' }}>
              Create Sales Portal
            </Typography>
          </Grid>
          ROYALTY INFO
          <Grid item xs="auto">
            <Typography
              sx={{
                display: 'inline-block',
                mr: '6px',
                verticalAlign: 'middle',
                color: createSale ? theme.palette.text.primary : theme.palette.text.secondary
              }}
            >
              Enable
            </Typography>
            <Switch
              focusVisibleClassName=".Mui-focusVisible"
              disableRipple
              checked={createSale}
            />
          </Grid>
        </Grid>
      </Box>
      <Collapse in={createSale}>
        <Grid container spacing={2} sx={{ mb: '24px' }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="filled"
              id="date-start"
              label="Date Start"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="filled"
              id="date-end"
              label="Date End"
            />
          </Grid>
        </Grid>
      </Collapse>
      <Button onClick={() => console.log(saleInfoData)}>Console log data</Button>
      <Button onClick={() => setClearForm(true)}>Clear Form</Button>
    </Box>
  );
};

export default SalesInfo;