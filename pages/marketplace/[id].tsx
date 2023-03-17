import React, { FC, useState, useEffect } from 'react';
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import {
  Container,
} from '@mui/material'
import TokenInfo from '@components/token/TokenInfo';
import { ISalesCardProps } from '@components/token/MarketSalesCard';

const SalesThing: ISalesCardProps = {
  sellerName: 'Paideia',
  sellerPfpUrl: '/images/paideia-circle-logo.png',
  sellerAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  postDate: new Date(1663786534000),
  artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  tokenName: 'Monk & Fox #0017',
  // sale: {
  //   currency: 'Erg',
  //   price: 10,
  //   link: '/',
  //   discountCurrency: 'Ergopad',
  //   discount: 0.1
  // },
  auction: {
    currency: 'Erg',
    currentBidPrice: 10,
    currentBidLink: '/',
    buyNowPrice: 100,
    buyNowLink: '/',
    endTime: new Date(1680201614000),
  }
}

const Nft: NextPage = () => {
  const router = useRouter()
  const { id } = router.query;
  const [tokenId, setTokenId] = useState('')

  useEffect(() => {
    if (id) setTokenId(id.toString())
  }, [id]);

  return (
    <>
      <Container sx={{ my: '36px' }}>
        <TokenInfo
          tokenId={tokenId}
          marketplaceSaleInfo={SalesThing}
        />
      </Container >
    </>
  )
}

export default Nft
