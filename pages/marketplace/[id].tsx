import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import {
  Container,
} from '@mui/material'
import TokenInfo from '@components/token/TokenInfo';
import { ISalesCardProps } from '@components/token/MarketSalesCard';

////////////////////////////////////////////////////////////////////////////////////////
// BEGIN SAMPLE DATA ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

const SalesThingSale: ISalesCardProps = {
  sellerName: 'Paideia',
  sellerPfpUrl: '/images/paideia-circle-logo.png',
  sellerAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  postDate: new Date(1663786534000),
  artistAddress: '9gbRnDa1Hih5Tep2qAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  tokenName: 'Monk & Fox #0017',
  sale: {
    currency: 'Erg',
    price: 10,
    link: '/',
    discountCurrency: 'Ergopad',
    discount: 0.1
  },
}

const SalesThingAuction: ISalesCardProps = {
  sellerName: 'Paideia',
  sellerPfpUrl: '/images/paideia-circle-logo.png',
  sellerAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  postDate: new Date(1663786534000),
  artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  tokenName: 'Monk & Fox #0017',
  auction: {
    currency: 'Erg',
    currentBidPrice: 10,
    currentBidLink: '/',
    buyNowPrice: 100,
    buyNowLink: '/',
    endTime: new Date(1680201614000),
  }
}

const SalesThingMint = {
  title: 'Blockheads 3 Pack',
  description: 'When opened, you will receive 3 Blockhead NFTs. ',
  mintDate: new Date(1663353871000),
  tokenId: '9a8b5be32311f123c4e40f22233da12125c2123dcfd8d6a98e5a3659d38511c8',
  views: 124,
  category: 'Common',
  collectionTitle: 'Origins',
  collectionUrl: '/collections/wrath-of-gods',
  collectionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse a, risus nec condimentum volutpat accumsan dui, tincidunt dolor. Id eu, dolor quam fames nisi. Id eu, dolor quam fames nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  artistName: 'Paideia',
  artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
  artistLogoUrl: '/images/paideia-circle-logo.png',
  salesCard: {
    sellerName: 'Paideia',
    sellerPfpUrl: '/images/paideia-circle-logo.png',
    sellerAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    artistAddress: '9gbRnDa1Hih5TepwqAv33b8SGYUbFpqTwE9G78yffudKq59xTa9',
    postDate: new Date(1663786534000),
    sale: {
      currency: 'Erg',
      price: 10,
      link: '/',
      isPack: true
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////
// END SAMPLE DATA /////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

const Nft: NextPage = () => {
  const router = useRouter()
  const { id } = router.query;
  const [tokenId, setTokenId] = useState('')

  // CHANGE URL TO SEE DIFFERENT VIEWS. 
  // 'sale', 'mint', and 'auction' show different sale types. Anything else shows not for sale
  const [saleType, setSaleType] = useState('sale')

  useEffect(() => {
    if (id) {
      setTokenId(id.toString())
      setSaleType(id.toString())
    }
  }, [id]);

  return (
    <>
      <Container sx={{ my: '36px' }}>
        <TokenInfo
          tokenId={tokenId}
          marketplaceSaleInfo={saleType === 'sale' ? SalesThingSale : (saleType === 'auction' ? SalesThingAuction : undefined)}
          directSaleInfo={saleType === 'mint' ? {...SalesThingMint.salesCard, tokenName: SalesThingMint.title} : undefined}
        /> 
      </Container >
    </>
  )
}

export default Nft
