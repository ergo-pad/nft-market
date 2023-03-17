import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next'
import {
  Container,
} from '@mui/material'
import { useRouter } from "next/router";
import dynamic from 'next/dynamic'
import DirectSalesCard, { IDirectSalesCardProps } from '@components/token/DirectSalesCard';
import TokenInfo from '@components/token/TokenInfo';

const TimeRemaining = dynamic(() => import('@components/TimeRemaining'), {
  ssr: false,
});

interface INftProps {
  title: string;
  description: string;
  mintDate: Date;
  tokenId: string;
  views: number;
  category?: string;
  collectionTitle?: string;
  collectionUrl?: string;
  collectionDescription?: string;
  artistName: string;
  artistAddress: string;
  artistLogoUrl: string;
  salesCard: IDirectSalesCardProps;
}

////////////////////////////////////////////////////////////////////////////////////////
// BEGIN SAMPLE DATA ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

const NftType = {
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

  useEffect(() => {
    if (id) setTokenId(id.toString())
  }, [id]);

  return (
    <>
      <Container sx={{ my: '36px' }}>
        <TokenInfo
          tokenId={tokenId}
          directSaleInfo={{...NftType.salesCard, tokenName: NftType.title}}
        />
      </Container >
    </>
  )
}

export default Nft
