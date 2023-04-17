import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import {
  Container,
} from '@mui/material'
import MintSaleInfo from '@components/sales/MintSaleInfo';
import { ISalesCardProps } from '@components/token/MarketSalesCard';

const Sale: NextPage = () => {
  const router = useRouter()
  const { saleId } = router.query;
  const [thisSaleId, setThisSaleId] = useState('')

  useEffect(() => {
    if (saleId) {
      setThisSaleId(saleId.toString())
    }
  }, [saleId]);

  return (
    <>
      <Container sx={{ my: '36px' }}>
        <MintSaleInfo
          saleId={thisSaleId}
        />
      </Container >
    </>
  )
}

export default Sale
