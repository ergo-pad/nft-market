import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardActionArea,
  Button,
  Box,
  Typography,
  useTheme
} from '@mui/material'
import dynamic from 'next/dynamic'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import Link from '@components/Link';
import { ThemeContext } from '@emotion/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/router'
import OpenPacks from '@components/dialogs/OpenPacks';
// const TimeRemaining = dynamic(() => import('@components/TimeRemaining'), {
//   ssr: false,
// });

export interface INftItem {
  imgUrl?: string;
  link: string;
  name: string;
  tokenId: string;
  qty?: number;
  price?: number;
  currency?: string;
  rarity?: string;
  saleType?: 'mint' | 'auction' | 'sale';
  collection?: string;
  collectionLink?: string;
  artist: string;
  artistLink: string;
}

interface INftCard {
  nftData: INftItem;
  index?: number;
  selected?: boolean[];
  setSelected?: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const randomInteger = (min: number, max: number) => {
  return (min + Math.random() * (max - min)).toFixed();
};

const NftCard: FC<INftCard> = ({
  nftData,
  index,
  selected,
  setSelected
}) => {
  const router = useRouter();
  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);
  const theme = useTheme()
  const SaleTypeSwitch = (saleType: 'mint' | 'auction' | 'sale') => {
    switch (saleType) {
      case "mint":
        return 'Mint';
      case "auction":
        return 'Auction';
      case "sale":
        return 'Sale';
    }
  }

  const handleSelect = () => {
    if (setSelected != undefined && index != undefined) {
      setSelected(prev => {
        const newArray = prev.map((item, i) => {
          if (index === i) {
            return !prev[index]
          }
          return item
        })
        return newArray
      })
    }
  }

  return (
    <>
      <Card
        elevation={0}
        sx={{
          // minWidth: '276px',
          borderColor: selected !== undefined && index !== undefined && selected[index] ? '#f00' : theme.palette.divider,
          mb: '6px',
          height: '100%',
        }}
      >
        <CardActionArea
          href={setSelected === undefined ? nftData.link : ''}
          onClick={() => setSelected != undefined && handleSelect()}
        >
          <Box sx={{
            position: 'relative',
            display: 'block',
            height: '235px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: theme.palette.divider
          }}>
            <Image
              src={nftData.imgUrl ? nftData.imgUrl : `/images/placeholder/${rand}.jpg`}
              layout="fill"
              objectFit="cover"
              draggable="false"
              alt="nft-image"
            />
          </Box>
          {nftData.price && setSelected === undefined && (
            <Box
              sx={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                p: '8px',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(6px)',
                color: '#fff',
                borderRadius: '6px',
              }}
            >
              <Typography sx={{ fontWeight: '700', }}>
                {nftData.price + ' ' + nftData.currency}
              </Typography>
            </Box>
          )}
          <CardContent sx={{ position: 'relative' }}>
            {nftData.saleType && setSelected === undefined && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '-16px',
                  right: '16px',
                  height: '28px',
                  p: '2px 8px',
                  background: theme.palette.primary.main,
                  color: theme.palette.background.default,
                  borderRadius: '50px',
                }}
              >
                <Typography sx={{ fontWeight: '700', }}>
                  {SaleTypeSwitch(nftData.saleType)}
                </Typography>
              </Box>
            )}
            <Typography
              sx={{
                fontWeight: '600',
                fontSize: '1.27rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {nftData.name}
            </Typography>
            {/* {nftData.saleEnd && (
            <Box>
              <AccessTimeIcon
                sx={{
                  verticalAlign: '-0.25em',
                  mr: '5px',
                }}
              />
              <Box
                sx={{
                  display: 'inline-block',
                }}
              >
                <TimeRemaining
                  endTime={nftData.saleEnd}
                />
              </Box>
            </Box>
          )} */}
          </CardContent>
        </CardActionArea>
        <CardActions
          sx={{
            p: '16px',
            pt: 0
          }}
        >
          <Grid2
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: '100%',
            }}
          >
            <Grid2>
              <Box
                sx={{
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {nftData.collectionLink ? (
                  <Link
                    href={nftData.collectionLink}
                    sx={{
                      color: theme.palette.text.secondary,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {nftData.collection}
                  </Link>
                ) : (
                  nftData.collection
                )}
                {' '}
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  by
                  {' '}
                  {nftData.artistLink ? (
                    <Link
                      href={nftData.artistLink}
                      sx={{
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {nftData.artist}
                    </Link>
                  ) : (
                    nftData.artist
                  )}
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </CardActions>
      </Card>
    </>
  );
};

export default NftCard;