import React, { FC, useMemo } from 'react';
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
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import Link from '@components/Link';
import { ThemeContext } from '@emotion/react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/router'
import TimeRemaining from '@components/TimeRemaining';

export interface INftItem {
  imgUrl?: string;
  link: string;
  name: string;
  price?: number;
  currency?: string;
  rarity?: string;
  saleEnd?: Date;
  collection?: string;
  collectionLink?: string;
  artist: string;
  artistLink: string;
}

interface INftCard {
  nftData: INftItem;
}

const randomInteger = (min: number, max: number) => {
  return (min + Math.random() * (max - min)).toFixed();
};

const NftCard: FC<INftCard> = ({
  nftData
}) => {
  const router = useRouter();
  const rand = useMemo(() => randomInteger(1, 18), [1, 18]);
  const theme = useTheme()
  return (
    <Card
      elevation={0}
      sx={{
        // minWidth: '276px',
        mb: '6px',
      }}
    >
      <CardActionArea
        onClick={() => {
          nftData.link && router.push(nftData.link);
        }}
      >
        <Box sx={{ position: 'relative', display: 'block', height: '205px' }}>
          <Image src={nftData.imgUrl ? nftData.imgUrl : `/images/placeholder/${rand}.jpg`} layout="fill" draggable="false" alt="logo" />
        </Box>
        {nftData.price && (
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
          {nftData.rarity && (
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
                {nftData.rarity}
              </Typography>
            </Box>
          )}
          <Typography
            sx={{
              fontWeight: '700',
              fontSize: '1.1rem',
              mb: '6px',
            }}
          >
            {nftData.name}
          </Typography>
          {nftData.saleEnd && (
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
          )}
        </CardContent>
      </CardActionArea>
      <CardActions
        sx={{
          p: '16px',
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
                  fontStyle: 'italic'
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
  );
};

export default NftCard;