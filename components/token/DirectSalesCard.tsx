import React, { FC, useState, useEffect } from 'react';
import type { NextPage } from 'next'
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button
} from '@mui/material'
import NumberIncrement from '@components/forms/NumberIncrement';
import ConfirmSale from '@components/dialogs/ConfirmSale';

/// API NEEDED ////////
const ApiPriceConversion: { [key: string]: number } = {
  erg: 1.51,
  ergopad: 0.006
}
/// END API NEEDED ///

export interface IDirectSalesCardProps {
  sellerName?: string;
  sellerPfpUrl?: string;
  sellerAddress: string;
  postDate: Date;
  tokenName: string;
  sale: {
    price: number;
    currency: string;
    link: string;
    isPack?: boolean;
  };
}

const DirectSalesCard: FC<IDirectSalesCardProps> = (props) => {
  const theme = useTheme()
  const upSm = useMediaQuery(theme.breakpoints.up('sm'))
  const [openNow, setOpenNow] = useState<boolean>(false)
  const [numberSold, setNumberSold] = useState<number>(1)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  const [purchaseCurrency, setPurchaseCurrency] = useState('Erg')

  const apiFormSubmit = (isUsd: boolean) => {
    isUsd ? (
      setTotalPrice(Number((numberSold * (ApiPriceConversion[props.sale.currency.toLowerCase()] * props.sale.price)).toFixed(2)))
    ) : (
      setTotalPrice(numberSold * props.sale.price)
    )
    setPurchaseCurrency(isUsd ? 'SigUSD' : props.sale.currency)
    setConfirmationOpen(true)
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            wrap="nowrap"
            sx={{
              mb: '12px',
              maxWidth: '100%',
            }}
          >
            <Grid item zeroMinWidth xs>
              <Box
                sx={{
                  // mb: '12px'
                }}
              >
                <Typography
                  sx={{
                    mb: 0,
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    lineHeight: 1.3
                  }}
                >
                  {props.sale.price + ' ' + props.sale.currency}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem'
                  }}
                >
                  ${(ApiPriceConversion['erg'] * props.sale.price).toFixed(2)} USD
                </Typography>
              </Box>
            </Grid>
            <Grid item xs="auto" sx={{ textAlign: 'right' }}>
              <Box
                sx={{
                  maxWidth: '180px'
                }}
              >
                <NumberIncrement
                  value={numberSold}
                  setValue={setNumberSold}
                  label="Quantity"
                  name="Quantity"
                />
              </Box>
            </Grid>
          </Grid>
          <FormGroup sx={{ mb: '12px' }}>
            <FormControlLabel control={
              <Checkbox
                checked={openNow}
                onChange={() => setOpenNow(!openNow)}
                inputProps={{ 'aria-label': "Open right away (I don't need the pack tokens)" }}
              />
            } label="Open right away (I don't need the pack tokens)" />
          </FormGroup>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={() => apiFormSubmit(false)}
                fullWidth
                variant="outlined"
              >
                Buy with {props.sale.currency}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={() => apiFormSubmit(true)}
                fullWidth
                variant="contained"
              >
                Buy with SigUSD
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <ConfirmSale
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        tokenName={props.tokenName}
        qty={numberSold}
        openNow={openNow}
        price={totalPrice}
        currency={purchaseCurrency}
      />
    </>
  )
}

export default DirectSalesCard