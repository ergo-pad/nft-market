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
import PackTokenSection from '@components/create/PackTokenSection';
import { IRarityData } from '@pages/create';
import { saleInfoDataInit, ISaleInfoData, packTokenDataInit } from '@pages/create';

interface ISalesInfoProps {
  saleInfoData: ISaleInfoData;
  setSaleInfoData: React.Dispatch<React.SetStateAction<ISaleInfoData>>;
  clearForm: boolean;
  setClearForm: React.Dispatch<React.SetStateAction<boolean>>;
  rarityData: IRarityData[];
}

const SalesInfo: FC<ISalesInfoProps> = ({ saleInfoData, setSaleInfoData, clearForm, setClearForm, rarityData }) => {
  const [packTokenData, setPackTokenData] = useState([packTokenDataInit])
  const theme = useTheme()
  
  // SALE DATA STATES //
  const [createSale, setCreateSale] = useState(true)
  const toggleCreateSale = () => {
    setCreateSale(!createSale)
  }

  // CLEAR FORM //
  useEffect(() => {
    setSaleInfoData(saleInfoDataInit) // this belongs to parent
    setPackTokenData([packTokenDataInit])
    setClearForm(false)
  }, [clearForm])

  useEffect(() => {
    const timeout = setTimeout(() => setSaleInfoData(prev => ({ ...prev, packs: packTokenData })), 400);
    return () => clearTimeout(timeout);
  }, [JSON.stringify(packTokenData)])

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
      <PackTokenSection
          data={packTokenData}
          setData={setPackTokenData}
          rarityData={rarityData}
        />
      <Button onClick={() => console.log(saleInfoData)}>Console log data</Button>
      <Button onClick={() => setClearForm(true)}>Clear Form</Button>
    </Box>
  );
};

export default SalesInfo;