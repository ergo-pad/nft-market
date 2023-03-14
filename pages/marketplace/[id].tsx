import React, { FC, useState, useEffect } from 'react';
import type { NextPage } from 'next'
import { useRouter } from "next/router";
import {
  Container,
} from '@mui/material'
import TokenInfo from '@components/token/TokenInfo';

const Nft: NextPage = () => {
  const router = useRouter()
  const { id } = router.query;
  const [tokenId, setTokenId] = useState('')

  useEffect(() => {
    if (id) setTokenId(id.toString())
  }, [id]);

  return (
    <>
      <Container sx={{ mb: '100px', mt: '48px' }}>
        <TokenInfo
          tokenId={tokenId}
        />
      </Container >
    </>
  )
}

export default Nft
